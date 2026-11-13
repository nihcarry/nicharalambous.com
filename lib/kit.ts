import { KIT_SUBSCRIBE_URL } from "@/lib/site";

export type KitResult = { ok: true } | { ok: false; error: string };

/**
 * Subscribe to Kit form 10044760. Callers pass fetch so tests never hit the network.
 */
export async function subscribeToKit(
  input: { email: string; firstName: string },
  fetchImpl: typeof fetch = fetch,
): Promise<KitResult> {
  const email = input.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Add an email address." };
  }

  const body = new FormData();
  body.set("email_address", email);
  const firstName = input.firstName.trim();
  if (firstName) body.set("fields[first_name]", firstName);

  try {
    const response = await fetchImpl(KIT_SUBSCRIBE_URL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body,
    });
    if (!response.ok) {
      return { ok: false, error: "Could not subscribe right now. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not subscribe right now. Please try again." };
  }
}
