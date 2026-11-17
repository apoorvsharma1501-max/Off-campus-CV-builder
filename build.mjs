// Builds index.html (a normal web page for Vercel/Netlify/GitHub Pages)
// from cv-studio.html (the page source published to Claude).
// Run: node build.mjs
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync(new URL("./cv-studio.html", import.meta.url), "utf8");
const cut = src.indexOf("<header");
if (cut < 0) throw new Error("Couldn't find <header> in cv-studio.html");
const head = src.slice(0, cut).trim();
const body = src.slice(cut).trim();

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}img{max-width:100%}</style>
${head}
</head>
<body>
${body}
</body>
</html>
`;
writeFileSync(new URL("./index.html", import.meta.url), html);
console.log("Wrote index.html (" + html.length + " bytes)");
