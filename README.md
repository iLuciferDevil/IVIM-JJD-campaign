# IVIM JJD Executive Dashboard (POC)

Pillar's IVIM JJD paid-media performance dashboard, built as a standalone static application.

## Publishing workflow

All code updates are committed to the **main** branch of `iLuciferDevil/IVIM-JJD-campaign`.

**Pillar owns the Vercel project and deploys the GitHub repository.** No changes are made to Pillar's Vercel account through this assistant.

## IMPORTANT: Require authentication before sharing

The dashboard **does not currently implement a password login itself**. Do not treat a client-side password prompt as security: anyone can bypass client-side checks and see static assets.

In **Pillar's Vercel project**, open **Security → Deployment Protection** (menu labels can vary by account and plan).

Choose one:

- **Recommended for internal use:** Enable **Vercel Authentication**, set coverage to **All Deployments**, and grant the intended Pillar/IVIM viewers access.
- **If a single shared password is necessary:** Enable Vercel's **Password Protection** for **All Deployments**, if supported by Pillar's Vercel plan. Set the password privately in Vercel. Do not commit passwords, password hashes, cookies or credentials to GitHub.

Verify that a private/incognito browser session cannot open the production dashboard without authentication. Verify preview deployment URLs are also protected.

**The GitHub repository itself is presently public.** Make it private in GitHub Settings → General → Danger Zone → Change repository visibility (if appropriate for Pillar policies). Deployment protection does not make a public source repository private.

## Deployment in Pillar's Vercel

1. Import GitHub repository `iLuciferDevil/IVIM-JJD-campaign` as a new Vercel project.
2. Root Directory: `./`.
3. Framework preset: **Other**, no build command.
4. Enable Deployment Protection **before sharing the URL**.
5. Deploy and perform the private/incognito access test above.

## Importing data

- Export campaign-by-day performance reports from Meta Ads Manager and Google Ads.
- Include reporting day, campaign/ad set, spend/cost, clicks and the specific JJD registration event/conversion-action column.
- Upload the CSVs using the dashboard's file selectors. Meta's `Registered` event is supported.
- If a report is aggregated across multiple days, re-export with a **daily** breakdown before using daily trend charts.

## Metrics

- Blended CPR = (Meta spend + Google spend) / (Meta registration conversion events + Google registration conversion events).
- These are platform-attributed events, **not** deduplicated first-party unique registrations. Both platforms may claim the same registration.
- Initial boosted-post registrations should only be counted from the actual Meta export, not manually added.
- Registration-to-schedule, no-show rate, provider utilization and close rate await IVIM-supplied data.
- 90-day LTV:CAC requires separate revenue and customer-acquisition data.

## POC data handling

- Imported aggregate CSV data is saved in browser-local storage. It is **not** synced between team members or uploaded to Vercel.
- Do not import patient-level records or personally identifiable information.
- To share live numbers between stakeholders, build an authenticated data API and controlled reporting store first.
