#!/usr/bin/env python3
"""Analyze Interrupt Apathy outreach database export for duplicates and sanity issues."""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse

def normalize_linkedin(url: str) -> str:
    if not url:
        return ""
    url = url.strip().lower().rstrip("/")
    url = re.sub(r"^https?://(www\.|uk\.|za\.|ng\.|gh\.|fi\.|de\.|ie\.|se\.|mt\.|gi\.|in\.|ca\.)?linkedin\.com", "https://linkedin.com", url)
    return url

def normalize_company(name: str) -> str:
    if not name:
        return ""
    n = name.strip().lower()
    aliases = {
        "transferwise (wise)": "wise",
        "wise": "wise",
    }
    return aliases.get(n, n)

def score_contact(row: dict) -> tuple:
    """Higher = keep this record."""
    title = (row.get("Title") or "").lower()
    score = 0
    if row.get("Verification Level") == "Search-confirmed":
        score += 10
    if row.get("Sector"):
        score += 5
    if "internal comm" in title or "employee comm" in title:
        score += 8
    if "employee experience" in title or "people experience" in title:
        score += 7
    if "employee engagement" in title or "engagement" in title:
        score += 6
    if "workplace experience" in title:
        score += 5
    if "people operations" in title or "people ops" in title:
        score += 2
    if "hr business partner" in title or "people partner" in title:
        score += 1
    if "former" in title or "recruiter" in title:
        score -= 20
    if "head of people" in title or "director" in title and "internal" not in title:
        score -= 3
    priority = row.get("Priority") or ""
    score += {"High": 3, "Medium": 2, "Low": 1}.get(priority, 0)
    return (score, row.get("url", ""))

def page_id(url: str) -> str:
    return url.rsplit("/", 1)[-1] if url else ""

def main():
    paths = sys.argv[1:]
    if not paths:
        print("Usage: analyze-keynote-db.py page*.json ...", file=sys.stderr)
        sys.exit(1)

    rows = []
    for p in paths:
        data = json.loads(Path(p).read_text())
        if isinstance(data, dict) and "results" in data:
            rows.extend(data["results"])
        elif isinstance(data, list):
            rows.extend(data)

    print(f"Total rows: {len(rows)}")

    companies = [r for r in rows if r.get("Record Type") == "Company" or (not r.get("Record Type") and not r.get("Company Name"))]
    contacts = [r for r in rows if r.get("Record Type") == "Contact" or (r.get("Company Name") and r.get("Record Type") != "Company")]
    # Fix: company records have empty Company Name
    companies = [r for r in rows if r.get("Record Type") in (None, "Company") and not r.get("Company Name")]
    contacts = [r for r in rows if r.get("Record Type") == "Contact" or (r.get("Company Name") and r.get("Record Type") != "Company")]

    print(f"Companies: {len(companies)}, Contacts: {len(contacts)}")

    # LinkedIn URL duplicates (global)
    by_url = defaultdict(list)
    for c in contacts:
        url = normalize_linkedin(c.get("userDefined:LinkedIn URL", ""))
        if url:
            by_url[url].append(c)

    url_dupes = {k: v for k, v in by_url.items() if len(v) > 1}
    print(f"\n=== LinkedIn URL duplicates: {len(url_dupes)} ===")
    to_delete = []
    for url, group in sorted(url_dupes.items(), key=lambda x: -len(x[1])):
        ranked = sorted(group, key=score_contact, reverse=True)
        keep = ranked[0]
        remove = ranked[1:]
        print(f"\n{url}")
        print(f"  KEEP: {keep.get('Name')} @ {keep.get('Company Name')} ({page_id(keep.get('url',''))[:8]}...) score={score_contact(keep)[0]}")
        for r in remove:
            print(f"  DELETE: {r.get('Name')} @ {r.get('Company Name')} ({page_id(r.get('url',''))[:8]}...) score={score_contact(r)[0]}")
            to_delete.append(r)

    # Same person same company (name+company dupes without URL)
    by_name_co = defaultdict(list)
    for c in contacts:
        key = (c.get("Name", "").strip().lower(), normalize_company(c.get("Company Name", "")))
        if key[0] and key[1]:
            by_name_co[key].append(c)
    name_dupes = {k: v for k, v in by_name_co.items() if len(v) > 1}
    print(f"\n=== Name+Company duplicates: {len(name_dupes)} ===")
    for key, group in sorted(name_dupes.items()):
        urls = {normalize_linkedin(c.get("userDefined:LinkedIn URL", "")) for c in group}
        if len(urls) == 1 and urls.pop():
            continue  # already handled
        ranked = sorted(group, key=score_contact, reverse=True)
        keep = ranked[0]
        remove = [r for r in ranked[1:] if r not in to_delete]
        if remove:
            print(f"\n{key[0]} @ {key[1]}")
            print(f"  KEEP: {keep.get('url')}")
            for r in remove:
                print(f"  DELETE: {r.get('url')}")
                to_delete.append(r)

    # >3 contacts per company
    by_company = defaultdict(list)
    for c in contacts:
        co = normalize_company(c.get("Company Name", ""))
        if co:
            by_company[co].append(c)
    over3 = {k: v for k, v in by_company.items() if len(v) > 3}
    print(f"\n=== Companies with >3 contacts: {len(over3)} ===")
    for co, group in sorted(over3.items(), key=lambda x: -len(x[1])):
        print(f"  {co}: {len(group)} contacts")

    # Missing fields
    missing = {"no_linkedin": [], "no_title": [], "no_company": [], "no_priority": [], "no_region": [], "no_record_type": []}
    for c in contacts:
        if not c.get("userDefined:LinkedIn URL"):
            missing["no_linkedin"].append(c)
        if not c.get("Title"):
            missing["no_title"].append(c)
        if not c.get("Company Name"):
            missing["no_company"].append(c)
        if not c.get("Priority"):
            missing["no_priority"].append(c)
        if not c.get("Region"):
            missing["no_region"].append(c)
    print("\n=== Missing fields (contacts) ===")
    for k, v in missing.items():
        print(f"  {k}: {len(v)}")

    # Former titles
    former = [c for c in contacts if "former" in (c.get("Title") or "").lower()]
    print(f"\n=== Former titles to remove: {len(former)} ===")
    for c in former:
        print(f"  {c.get('Name')} @ {c.get('Company Name')}: {c.get('Title')}")
        if c not in to_delete:
            to_delete.append(c)

    # Company name mismatches
    company_names = {r.get("Name", "").strip().lower() for r in companies}
    orphan_contacts = []
    for c in contacts:
        co = c.get("Company Name", "").strip()
        if co and normalize_company(co) not in {normalize_company(n) for n in company_names} and co.lower() not in company_names:
            orphan_contacts.append(c)
    print(f"\n=== Contacts without matching Company row: {len(set(c.get('Company Name') for c in orphan_contacts))} companies ===")

    # Dedupe to_delete by url
    seen = set()
    unique_delete = []
    for r in to_delete:
        pid = r.get("url")
        if pid not in seen:
            seen.add(pid)
            unique_delete.append(r)

    out = Path("/tmp/keynote_cleanup_plan.json")
    out.write_text(json.dumps({"delete": unique_delete, "stats": {
        "total": len(rows), "contacts": len(contacts), "companies": len(companies),
        "url_dupes": len(url_dupes), "to_delete": len(unique_delete),
    }}, indent=2))
    print(f"\nWrote cleanup plan: {len(unique_delete)} deletes -> {out}")

if __name__ == "__main__":
    main()
