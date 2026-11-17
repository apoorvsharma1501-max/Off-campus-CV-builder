# CV Studio

A CV builder for off-campus MBA placements, laid out like a campus placement portal. Sign-in is limited to `@bitsom.edu.in` emails.

- Sections ("buckets") and bullets you can add, edit, delete and reorder
- Several CVs, one per job description, copied from a master CV
- ATS keyword match: paste a JD and see which keywords your CV covers and which are missing
- One-page check, bullet quality checks, and undo
- Export to PDF (selectable text) and Word (.docx)
- Sign in with a code emailed to your BITSoM address; CVs are saved to your account and sync across devices

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
3. **Authentication → Sign In / Providers → Email**: keep **Email** on. Turn **Confirm email** on.
4. **Authentication → Emails → Templates**: in both **Magic Link** and **Confirm signup**, replace the body with something like:

   ```html
   <h2>Your CV Studio sign-in code</h2>
   <p>Enter this code to sign in: <strong style="font-size:24px">{{ .Token }}</strong></p>
   <p>It expires in 1 hour. If you didn't ask for it, ignore this email.</p>
   ```

5. **Authentication → Emails → SMTP Settings**: turn on custom SMTP. Supabase's built-in email only sends a few emails an hour, which is not enough for a batch. With Gmail:
   - Host `smtp.gmail.com`, port `465`, username = your Gmail address
   - Password = a Gmail **app password** (Google Account → Security → 2-Step Verification → App passwords)
   - Sender email = the same Gmail address, sender name `CV Studio`
6. **Project Settings → API**: copy the **Project URL** and the **anon public** key.

### 2. Vercel

1. **Project → Settings → Environment Variables**, add:
   - `SUPABASE_URL` = the Project URL
   - `SUPABASE_ANON_KEY` = the anon public key
2. **Deployments → ⋯ → Redeploy**.

The anon key is meant to be public. The row-level security rules in `setup.sql` are what keep each person's CVs private.

## Local testing

```bash
CV_NO_LOGIN=1 node build.mjs
```

Then open `dist/index.html` through any local server. This skips sign-in and saves CVs in the browser.
