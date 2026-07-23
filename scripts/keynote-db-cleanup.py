#!/usr/bin/env python3
"""Analyze keynote outreach DB export and produce cleanup actions."""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import unquote

COMPANY_ALIASES = {
    "transferwise (wise)": "wise",
    "wise": "wise",
}

def norm_linkedin(url: str) -> str:
    if not url:
        return ""
    url = unquote(url.strip().lower().rstrip("/"))
    url = re.sub(r"^https?://([a-z]{2}\.)?(www\.)?linkedin\.com/in/", "", url)
    return url.split("?")[0].strip("/")

def norm_company(name: str) -> str:
    if not name:
        return ""
    n = name.strip().lower()
    return COMPANY_ALIASES.get(n, n)

def page_id(url: str) -> str:
    if not url:
        return ""
    return url.rstrip("/").split("/")[-1]

def is_company(row: dict) -> bool:
    rt = row.get("Record Type")
    if rt == "Company":
        return True
    if rt == "Contact":
        return False
    # Heuristic: company rows have empty Company Name and usually no LinkedIn
    return not row.get("Company Name") and not row.get("userDefined:LinkedIn URL")

def is_contact(row: dict) -> bool:
    return row.get("Record Type") == "Contact" or bool(row.get("Company Name"))

def score_contact(row: dict) -> tuple:
    title = (row.get("Title") or "").lower()
    score = 0
    if row.get("Verification Level") == "Search-confirmed":
        score += 10
    if row.get("Sector"):
        score += 3
    if "internal comm" in title or "employee comm" in title:
        score += 8
    if "employee experience" in title or "people experience" in title:
        score += 7
    if "employee engagement" in title or "engagement" in title:
        score += 6
    if "workplace experience" in title:
        score += 5
    if "learning" in title and "development" in title:
        score += 4
    if "people operations" in title or "people ops" in title:
        score += 2
    if "hr business partner" in title or "people partner" in title:
        score += 1
    if "former" in title:
        score -= 25
    if re.search(r"\bvp\b|\bchief\b|head of people\b|director of people\b", title) and "internal" not in title and "communication" not in title:
        score -= 4
    score += {"High": 3, "Medium": 2, "Low": 1}.get(row.get("Priority") or "", 0)
    if row.get("LinkedIn Status") in ("Connected", "Responded", "Warm"):
        score += 15
    return (score, row.get("url", ""))

def score_company(row: dict) -> tuple:
    score = 0
    if row.get("Record Type") == "Company":
        score += 5
    if row.get("Verification Level") == "Search-confirmed":
        score += 3
    if row.get("Sector"):
        score += 2
    if row.get("Status") == "Done":
        score += 2
    if row.get("Notes"):
        score += 1
    # Penalize rows polluted with contact fields
    if row.get("userDefined:LinkedIn URL"):
        score -= 10
    if row.get("Title"):
        score -= 5
    if row.get("LinkedIn Status"):
        score -= 5
    return (score, row.get("url", ""))

def main():
    rows = json.loads(Path(sys.argv[1]).read_text())
    if isinstance(rows, dict) and "results" in rows:
        rows = rows["results"]

    companies = [r for r in rows if is_company(r)]
    contacts = [r for r in rows if is_contact(r) and not is_company(r)]

    print(f"Total: {len(rows)} | Companies: {len(companies)} | Contacts: {len(contacts)}")

    actions = {"delete_contacts": [], "delete_companies": [], "fix": []}

    # --- LinkedIn URL duplicates among contacts ---
    by_url = defaultdict(list)
    for c in contacts:
        u = norm_linkedin(c.get("userDefined:LinkedIn URL", ""))
        if u:
            by_url[u].append(c)

    for url, group in by_url.items():
        if len(group) < 2:
            continue
        ranked = sorted(group, key=score_contact, reverse=True)
        keep = ranked[0]
        for r in ranked[1:]:
            actions["delete_contacts"].append({
                "page_id": page_id(r["url"]),
                "reason": f"duplicate LinkedIn URL (keep {keep.get('Name')} @ {keep.get('Company Name')})",
                "url": r.get("url"),
            })

    # --- Former titles ---
    for c in contacts:
        if "former" in (c.get("Title") or "").lower():
            pid = page_id(c["url"])
            if not any(d["page_id"] == pid for d in actions["delete_contacts"]):
                actions["delete_contacts"].append({
                    "page_id": pid,
                    "reason": "former title",
                    "url": c.get("url"),
                })

    # --- Duplicate company rows by name ---
    by_co_name = defaultdict(list)
    for co in companies:
        name = (co.get("Name") or "").strip().lower()
        if name:
            by_co_name[name].append(co)

    for name, group in by_co_name.items():
        if len(group) < 2:
            continue
        ranked = sorted(group, key=score_company, reverse=True)
        keep = ranked[0]
        for r in ranked[1:]:
            actions["delete_companies"].append({
                "page_id": page_id(r["url"]),
                "reason": f"duplicate company row (keep {page_id(keep['url'])[:8]}...)",
                "url": r.get("url"),
            })

    # --- Fix polluted company rows (contact data on company record) ---
    polluted = [
        co for co in companies
        if co.get("userDefined:LinkedIn URL") or co.get("Title") or co.get("LinkedIn Status")
    ]
    for co in polluted:
        pid = page_id(co["url"])
        if any(d["page_id"] == pid for d in actions["delete_companies"]):
            continue
        actions["fix"].append({
            "page_id": pid,
            "command": "clear_contact_fields_on_company",
            "fields": {
                "Record Type": "Company",
                "userDefined:LinkedIn URL": None,
                "Title": None,
                "LinkedIn Status": None,
                "date:Last Touch:start": None,
                "date:Last Touch:is_datetime": None,
                "Status": "Done" if co.get("Status") != "In progress" else co.get("Status"),
            },
            "note": f"Company row had contact fields mixed in ({co.get('Title')})",
        })

    # --- Contacts missing Record Type ---
    for c in contacts:
        if c.get("Record Type") != "Contact":
            actions["fix"].append({
                "page_id": page_id(c["url"]),
                "command": "set_record_type",
                "fields": {"Record Type": "Contact"},
            })

    # --- Companies missing Record Type ---
    for co in companies:
        if co.get("Record Type") != "Company" and not co.get("userDefined:LinkedIn URL"):
            pid = page_id(co["url"])
            if not any(f["page_id"] == pid for f in actions["fix"]):
                actions["fix"].append({
                    "page_id": pid,
                    "command": "set_record_type",
                    "fields": {"Record Type": "Company"},
                })

    # --- >3 contacts per company (trim weakest) ---
    by_company = defaultdict(list)
    delete_ids = {d["page_id"] for d in actions["delete_contacts"]}
    for c in contacts:
        if page_id(c["url"]) in delete_ids:
            continue
        co = norm_company(c.get("Company Name", ""))
        if co:
            by_company[co].append(c)

    for co, group in by_company.items():
        if len(group) <= 3:
            continue
        ranked = sorted(group, key=score_contact, reverse=True)
        for r in ranked[3:]:
            actions["delete_contacts"].append({
                "page_id": page_id(r["url"]),
                "reason": f">3 contacts at {co} (cap at 3)",
                "url": r.get("url"),
            })

    # Dedupe delete lists
    seen = set()
    unique_deletes = []
    for d in actions["delete_contacts"]:
        if d["page_id"] not in seen:
            seen.add(d["page_id"])
            unique_deletes.append(d)
    actions["delete_contacts"] = unique_deletes

    seen = set()
    unique_co_del = []
    for d in actions["delete_companies"]:
        if d["page_id"] not in seen:
            seen.add(d["page_id"])
            unique_co_del.append(d)
    actions["delete_companies"] = unique_co_del

    out = Path("/tmp/keynote_cleanup_actions.json")
    out.write_text(json.dumps(actions, indent=2))

    print(f"\nDelete contacts: {len(actions['delete_contacts'])}")
    print(f"Delete duplicate companies: {len(actions['delete_companies'])}")
    print(f"Fix records: {len(actions['fix'])}")
    print(f"Wrote {out}")

    # Summary of duplicate URLs
    print("\nTop duplicate LinkedIn URLs:")
    for url, group in sorted(by_url.items(), key=lambda x: -len(x[1]))[:15]:
        if len(group) > 1:
            print(f"  {url}: {len(group)}x — {', '.join(g.get('Company Name','?') for g in group)}")

if __name__ == "__main__":
    main()
