import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Intentional: we use <a> instead of Link to force full page loads and avoid
      // RSC .txt payloads being served when client-side nav fails (static export + S3/CloudFront)
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default eslintConfig;
