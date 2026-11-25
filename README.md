# CV Studio

A CV builder for off-campus MBA placements, laid out like a campus placement portal. Only `@bitsom.edu.in` emails can register.

- Sections ("buckets") and bullets you can add, edit, delete and reorder
- Several CVs, one per job description, copied from a master CV
- ATS keyword match: paste a JD and see which keywords your CV covers and which are missing
- Four templates (Campus, Classic, Modern, Compact) that also apply to PDF and Word export
- One-page check, bullet quality checks, and undo
- Export to PDF (selectable text) and Word (.docx)
- Create an account with a BITSoM email and a password; CVs are saved to your account and sync across devices

## Files

| File | What it is |
|---|---|
| `cv-studio.html` | The page source (also what is published to Claude) |
| `build.mjs` | Builds `dist/index.html` for the website, using the environment variables below |
| `vercel.json` | Tells Vercel to run the build and serve `dist/` |
| `supabase/setup.sql` | Creates the CV table, privacy rules, and the BITSoM-only sign-up rule |

## One-time setup

### 1. Supabase (free)

1. Create a project at supabase.com. Any region near India (Mumbai) works.
2. **SQL Editor → New query**: paste all of `supabase/setup.sql` and click **Run**.
3. **Authentication → Sign In / Providers → Email**: keep **Email** on and turn **Confirm email** OFF, so people can sign in right after creating an account. No email is sent, so no SMTP setup is needed.
4. **Forgotten passwords**: in **Authentication → Users**, delete that person's user; they can then register again. Their saved CVs are deleted with the account, so ask them to download a backup first if they can.
5. **Project Settings → API Keys**: copy the **Publishable key**.

### 2. Vercel

1. **Project → Settings → Environment Variables**, add:
   - `SUPABASE_URL` = `https://<your-project>.supabase.co`
   - `SUPABASE_ANON_KEY` = the Publishable key
2. **Deployments → ⋯ → Redeploy**.

The publishable key is meant to be public. The row-level security rules in `setup.sql` are what keep each person's CVs private.

## Local testing

```bash
CV_NO_LOGIN=1 node build.mjs
```

Then open `dist/index.html` through any local server. This skips sign-in and saves CVs in the browser.
