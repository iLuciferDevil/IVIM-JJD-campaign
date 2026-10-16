# IVIM JJD Executive Dashboard (POC)

This is a standalone static dashboard for IVIM's JJD paid campaigns.

## Deploy on Pillar Vercel
1. Import GitHub repository `iLuciferDevil/PillarMarketingDashboard` as a **new** Vercel project.
2. Set **Root Directory** to `ivim-jjd`.
3. Framework preset: **Other**. No build command or environment variables are required for this prototype.
4. Deploy, then configure Vercel Deployment Protection before sharing client data.

## Use
- Export campaign/day reports from Meta Ads Manager and Google Ads.
- Include day, campaign name, spend, clicks and the JJD registration event/conversion-action column.
- Upload each CSV using the corresponding file picker; map the exact registration-event column if prompted.
- Filter by date and channel.

## Definitions
- Blended CPR = (Meta spend + Google spend)/(Meta registration events + Google registration events).
- These are **platform-attributed events**, not deduplicated first-party unique registrations.
- The 41 registrations reported from the initial boost are reference-only until confirmed in the Meta CSV; avoid adding them manually to the imported event totals.
- Registration-to-schedule, no-show rate, provider utilization and close rate are intentionally pending IVIM-source integration.
- 90-day LTV:CAC remains out of scope until revenue and acquisition data are available.

## Security and persistence
- No patient-level information or PII is needed or appropriate for these CSV uploads.
- The POC stores imported aggregates in local browser storage. Other users will **not** see those imports just by opening the deployed site.
- CSV files are not uploaded to Vercel by this prototype.
- The dashboard loads Chart.js from a public CDN.
- For a shared production dashboard, replace local storage with an access-controlled reporting API and secured data store.
