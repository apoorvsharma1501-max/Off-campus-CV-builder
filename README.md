# CV Studio

A CV builder for off-campus MBA placements, laid out like a campus placement portal.

- Sections ("buckets") and bullets you can add, edit, delete and reorder
- Several CVs, one per job description, copied from a master CV
- ATS keyword match: paste a JD and see which keywords your CV covers and which are missing
- Export to PDF (selectable text) and Word (.docx)

## Two ways to use it

| | Claude link | This website (Vercel / Netlify) |
|---|---|---|
| Editing, reordering, keyword match | Yes | Yes |
| PDF / Word export | Yes | Yes |
| Where CVs are saved | Your Claude account | Your browser only (use **Download backup** to move them) |
| AI keyword extraction and bullet reframing | Yes, on each person's Claude account | No: needs an Anthropic API key and a server function |

## Files

- `cv-studio.html`: the page source (also what is published to Claude)
- `index.html`: the deployable web page, generated from the source
- `build.mjs`: regenerates `index.html`

After editing `cv-studio.html`, run:

```bash
node build.mjs
```

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com: **Add New → Project**, import the repository.
3. Framework preset: **Other**. Leave the build command empty and the output directory as the root.
4. Click **Deploy**. No environment variables are needed.
