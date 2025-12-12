# Frontend Sanity Checks — Transactions & Business Ownership

This file describes quick checks and commands to verify the frontend behavior around vendor transactions and business ownership. Use these steps while the backend ownership guard is being implemented.

## Start development server

```bash
npm install
npm run dev
```

## Verify BusinessContext and transaction filtering

1. Open the Transactions page (Dashboard → Transactions).
2. Open DevTools (Console & Network).
3. Look for these debug logs:
   - `[useVendorTransactions] business filter candidates: [...] businessName: '...' txnBizIds sample: [...]`
   - `[useVendorTransactions] fetched X returned, Y unique, Z filtered for business`
   - `[TransactionsPage] derived stats: {...} api stats: {...}`
4. In the top-right corner of the app you should see a small debug overlay (development only) with:
   - `id`: current `BusinessContext.business.id`
   - `name`: current `BusinessContext.business.businessName`
   - `Transactions` and `Filtered` counts
5. For individual rows (dev only) each transaction shows `bizId: ...` and business name if available. Confirm the `bizId` matches the overlay `id` for transactions you expect to see.

## Common failure modes

- `derived stats` is `null` while `api stats` is non-empty:
  - This means the frontend filtered out all transactions for the current `business` (i.e., `filteredTransactions.length === 0`). Check the debug overlay and per-row `bizId` fields to see why they don't match.
- `transactions show other businesses`:
  - Ensure `ctxBusiness.id` matches the `bizId` values printed per-row. If they don't, verify the BusinessContext is returning the correct business (GET `/api/business` response), and that the user is actually owner/staff of the business shown.

## Quick investigative commands

- Re-fetch business context in the console:

```js
// in browser console
window.__APP__?.business?.refresh?.(); // if you wired refresh into window for debug
// or call the backend endpoint directly
fetch('/api/business', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('ACCESS_TOKEN') } }).then(r=>r.json()).then(console.log)
```

- Inspect transactions API response directly (Network tab):
  - GET `/api/transactions/vendor/my-transactions` → view Response body to confirm `businessId` values.

## What to send to backend team

If something looks wrong, capture and send:
- The `/api/transactions/vendor/my-transactions` full JSON response
- The `/api/transactions/vendor/stats` response
- The values printed in the debug overlay (`ctxBusiness.id` and name)

These will help them implement the backend guard quickly.

---

If you want, I can add a temporary toggle in the UI to export the filtered transaction list (JSON) for easier sharing with backend engineers.