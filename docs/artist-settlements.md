# Artist agreements and manual payouts

## Current scope

The AKLO test walkthrough is deployed at
`https://mcliv.studio/artists/settlements/preview/aklo` on September 21, 2026,
using the shared artist UI with signed, one-hour test cookies. It makes no D1,
Shopify, provider or email writes; downloads are visibly marked as test documents.
Real settlement routes remain disabled until configuration and agreement facts
are ready. The canonical project architecture records the current deployment
and rollback versions.

The underlying implementation supports each of the 18 exhibition artists, with Lola
as the first planned real settlement. No real settlement, artist invitation,
bank account, or transfer was created. The synthetic preview is not evidence of
Lola’s sale amount, legal name, or payout entitlement.

Artist route: `/artists/settlements/:id`. Admin queue: `/admin/settlements`.
The feature is disabled unless `ARTIST_SETTLEMENTS_ENABLED=true`.

The artist opens a single-use invitation, reviews the full agreement and sale
statement, completes payment details with an approved hosted provider, and
signs once. The signed PDF is stored with a SHA-256 hash. Payment records remain
separate. A signature is never proof of payment.

MCLIV prepares and signs each exact agreement version before making an invite.
Amendments retain prior versions, revoke old access, and require a new artist
signature. Amendments are blocked while payments are reserved, processing, or
confirmed. Historical signed PDFs remain in D1; the current UI downloads the
current signed version. An administrator must retrieve a historical version
through the authenticated document service if an earlier copy is requested.

## Boundaries

- Sale facts are entered and checked manually against Shopify. There is no
  order import or webhook in this release. Canonical Order and LineItem GIDs
  prevent duplicate settlement identities; an operator verifies the mapping.
- Invitation email text is prepared for manual sending. No email API or
  scheduled reminders are connected. The existing submission-email binding
  has a fixed destination and must not be reused to send artist invitations.
- ACH and Stripe are approved **hosted setup links**, not new payment processor
  integrations. No Stripe account is created and no funds move through this
  application. The provider, account eligibility, funding route, and exact fee
  allocation must be confirmed before offering a method. Shopify funds do not
  automatically become a Stripe payout balance.
- Full bank details stay at the approved bank/provider. MCLIV records a
  recipient reference, account last four digits, and verification evidence.
  There is no bank-number, SSN, tax-ID, or ST-120 field.
- One agreement covers one artwork/sale. USD only; 20% MCLIV commission with
  rounding to the nearest cent, and the remaining cents allocated to the artist.
  Explicit agreed deductions are separate. Tax and shipping are excluded.
- No automatic legal sufficiency claim. The supplied drafting brief and bundled
  terms are draft material, not an executed contract or approved legal advice.

## Required before enabling

1. Confirm the MCLIV legal party and authorized signer, artist legal identity,
   signing capacity, address and verified email.
2. Verify the Shopify order/line, sale date, actual amount after discounts,
   allocated tax/shipping, and all prior or pending artist payments. Confirm
   custody, delivery, insurance, return/dispute terms and the payment deadline.
3. Approve the completed agreement and fee allocation. Replace the marked draft
   section; the server rejects unfilled draft markers. Do not add an LLC name,
   assume processing deductions, or treat a tax-inclusive receipt as art revenue.
4. Select and approve the bank/provider and its recipient-specific secure setup
   link. Confirm who pays any fee. Set only its exact HTTPS hostname in
   `SETTLEMENT_PAYOUT_HOSTS` (comma-separated if needed).
5. Protect `/admin/settlements*` using Cloudflare Access. Configure
   `SETTLEMENT_ACCESS_ISSUER` as the exact HTTPS team origin without a trailing
   slash, `SETTLEMENT_ACCESS_AUDIENCE` as the application audience, and
   `SETTLEMENT_ADMIN_EMAILS` as the approved comma-separated admin allowlist.
   The Worker checks JWT signatures, issuer, audience, expiry and email itself.
6. After explicit deployment approval, back up the existing D1 database and apply
   `migrations/0002_artist_settlements.sql` to the existing
   `ARTIST_SUBMISSIONS_DB` binding. These tables are additive and do not modify
   artist submissions. Confirm the migration on local/staging D1 first.
7. Deploy the reviewed build with the feature disabled, check unauthenticated
   access denial, then enable it only after configuration is verified. Check
   HTML, data and document responses for `no-store` and `noindex` headers.
8. Prepare Lola’s verified agreement, review the invite’s recipient and exact
   text, and get approval before sending through the approved email account.

Do not deploy from the dirty historical main checkout. This implementation is
based on production commit `50760df`, branch `feat/artist-settlements`.

## Payout procedure

1. Check the queue each business day. It highlights overdue dates and the prior
   business day in New York time. Reminders and escalations are manual.
2. Resolve corrections or assisted-signing requests with the artist. Routine
   follow-up stops while a request is open. Never reset an existing deadline or
   forfeit proceeds because paperwork is incomplete.
3. Check the exact signed version, cleared sale funds, recipient identity,
   provider destination and amount. Store verification evidence and approve.
4. Reserve the intended amount **before** making one transfer in the actual
   bank/provider. Reservations do not send money. The database enforces the
   entitlement limit and one record per request ID, including concurrent writes.
5. Record the provider reference and processing status. If an API or bank page
   times out, reconcile it before retrying; a timeout is not proof of failure.
6. Record confirmation only against actual provider/bank evidence. Record a
   cumulative returned amount if funds come back. Partial and returned transfers
   update the remaining balance. A failed/cancelled record requires evidence
   that funds were not sent; it must not release an uncertain transfer for retry.
7. The artist sees the separate payment history and can retain the signed PDF.
   Send any payment confirmation manually through the approved email account.

An existing payment obligation can require human action even if the routine
software gate is incomplete. Escalate to the authorized MCLIV signatory before
the due date; agree on assisted completion and the lawful payment route. This
release has no unsigned-payment override. If funds are paid outside its ledger,
do not create or reserve another payment here until those funds are reconciled.

Destination changes require direct verification and a notice to the previously
verified contact before a new approved agreement/link. A changed email message
alone is not enough to replace a destination.

## Verification and preview

```sh
node scripts/settlements/check.mjs
node --conditions=workerd scripts/settlements/check-walkthrough-runtime.mjs
npm run typecheck
npm run lint
npm run build
node --conditions=workerd scripts/check-1620-runtime.mjs
node --conditions=workerd scripts/settlements/preview.mjs
```

The check script requires Node 22.13+ with `node:sqlite` (verified on Node 26).
It runs against synthetic SQLite data and temporary files, never production D1.
The local development preview binds only `127.0.0.1:4179`, blocks external API calls, and uses
test-only admin authentication in the preview harness. The production code has
no local-admin bypass. Stop the preview with Ctrl-C.

The PDF uses a static instance of the site’s Inter font. Rebuild that derived
asset with `scripts/settlements/prepare-font.py` when needed. Application builds
embed it at build time and make no runtime font request during signing.

## Rollback and retention

Disable `ARTIST_SETTLEMENTS_ENABLED` or restore the prior Worker version to stop
new access and writes. Do **not** drop settlement tables, rewrite signed PDFs,
or release reservations as a rollback step. Reconcile any actual bank transfer
before marking it failed. Preserve signed files, their hashes, versions, audit
records and the payout ledger. Review retention/access policy before live use.

## Reference points

- [New York artist consignment law](https://www.nysenate.gov/legislation/laws/ACA/12.01)
- [New York electronic signatures](https://www.nysenate.gov/legislation/laws/STT/304)
- [Stripe: Global Payouts and Connect comparison](https://docs.stripe.com/global-payouts/compare-with-connect)
- [Cloudflare Access JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
