/**
 * Match Next.js env precedence: load `.env`, then `.env.local` (local overrides).
 * Use at the top of scripts that need SANITY_WRITE_TOKEN or other secrets.
 */
import path from "path";
import { config } from "dotenv";

const root = path.resolve(__dirname, "..");

config({ path: path.join(root, ".env"), quiet: true });
config({ path: path.join(root, ".env.local"), override: true, quiet: true });
