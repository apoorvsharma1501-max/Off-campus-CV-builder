// Builds dist/index.html, the website Vercel serves, from cv-studio.html
// (the page source, also published to Claude).
//
// Settings come from environment variables (set them in Vercel → Settings → Environment Variables):
//   SUPABASE_URL           e.g. https://abcd1234.supabase.co
//   SUPABASE_ANON_KEY      the project's "anon public" key (safe to expose; row-level security protects data)
//   ALLOWED_EMAIL_DOMAIN   optional, defaults to bitsom.edu.in
//   OTP_LENGTH             optional, digits in the emailed code, defaults to 6
//   CV_NO_LOGIN=1          local testing only: skip sign-in and save in the browser
//
// Run locally: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const env = process.env;
const src = readFileSync(new URL("./cv-studio.html", import.meta.url), "utf8");
const cut = src.indexOf("<header");
if (cut < 0) throw new Error("Couldn't find <header> in cv-studio.html");

const config = {
  supabaseUrl: (env.SUPABASE_URL || "").trim(),
  supabaseAnonKey: (env.SUPABASE_ANON_KEY || "").trim(),
  allowedDomain: (env.ALLOWED_EMAIL_DOMAIN || "bitsom.edu.in").trim().toLowerCase(),
  otpLength: Number(env.OTP_LENGTH) || 6,
  noLogin: env.CV_NO_LOGIN === "1",
};
if (!config.noLogin && (!config.supabaseUrl || !config.supabaseAnonKey)) {
  console.warn("Warning: SUPABASE_URL / SUPABASE_ANON_KEY not set. The site will show 'Sign-in isn't set up yet'.");
}

const head = src.slice(0, cut).trim();
const body = src.slice(cut).trim().replace("/*__CV_CONFIG__*/", "window.CV_CONFIG = " + JSON.stringify(config) + ";");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}img{max-width:100%}</style>
${head}
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>
</head>
<body>
${body}
</body>
</html>
`;
mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });
writeFileSync(new URL("./dist/index.html", import.meta.url), html);
console.log(`Wrote dist/index.html (${html.length} bytes) · login: ${config.noLogin ? "off (local test)" : config.supabaseUrl ? "Supabase, @" + config.allowedDomain : "not configured"}`);
