# IVIM JJD Executive Dashboard

Standalone IVIM JJD performance dashboard, maintained in this GitHub repository. Pillar deploys this project to its own Vercel account.

## Password access (same architecture as Jones Soda)

The repository contains a custom password login screen (`login.html`), a server-side login endpoint (`api/auth/login.js`), a logout endpoint, and middleware (`middleware.js`) to protect the dashboard and routes. A successful login grants an HTTP-only, secure, signed cookie valid for 12 hours. The password is never written to frontend source code or GitHub.

### Required deployment configuration

In **Pillar's Vercel project**, set an encrypted environment variable named:

```text
IVIM_JJD_DASHBOARD_PASSWORD
```

Set its value to a strong, unique password that Pillar chooses; apply to Production and any accessible Preview deployments, then **redeploy**. Do not add the actual password to GitHub or paste it into a public channel.

This environment variable supplies the password checked by our custom application code. It is **not** Vercel's built-in deployment password-protection feature. No separate Vercel password protection setting is necessary.

Without the environment variable, dashboard routes fail closed with HTTP 503.

After deployment, verify in incognito: visiting the dashboard redirects to the sign-in screen; a wrong password is rejected; the right password opens the dashboard; and `/index.html` cannot be opened without a valid session.

## Deployment

1. Pillar imports `iLuciferDevil/IVIM-JJD-campaign` into its Vercel account.
2. Set project root to `./` and framework preset to **Other**.
3. Supply `IVIM_JJD_DASHBOARD_PASSWORD` in project environment variables.
4. Deploy and test sign-in. The `@vercel/functions` dependency is already listed in `package.json`.

## POC data imports

- Meta CSV: daily spend, clicks, campaign/ad-set and the `Registered` custom event.
- Google CSV: daily cost, clicks, campaign and registration conversion action.
- Blended CPR = combined platform spend / combined platform-attributed registration events.
- Source reports must use **daily breakdowns** for daily charts.
- Imported aggregates are kept in each viewer's own browser-local storage, not shared with other dashboard users.
- Do not upload patient names, emails or health information.

## Later integrations

Registration-to-schedule, no-show rate, provider utilization, close rate, and 90-day LTV:CAC require IVIM source-system data.

## Repository privacy

For internal/client use, prefer setting the GitHub repo to **private**. Application-level login protects the deployed dashboard but does not make a public GitHub repo private.
