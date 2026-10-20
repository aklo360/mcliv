# Artist settlements acceptance

AKLO test walkthrough deployed; real settlement activation remains pending.
Canonical workflow, limits, configuration, and rollback: [artist-settlements.md](artist-settlements.md).

- [x] One agreement and payout record per sold artwork; all 18 artists tested.
- [x] Integer USD amounts, 80/20 split, explicit tax/shipping and deductions.
- [x] Versioned agreements, one artist signature, retained signed PDF and hash.
- [x] Expiring invitations, scoped sessions, verified admin JWTs and same-origin writes.
- [x] Provider-hosted payment setup; masked destination references only.
- [x] Payment approval, duplicate request guard, concurrent balance limits, partial/returned payments.
- [x] Correction and assistance requests; visible deadline escalation.
- [x] Fourteen focused checks; typecheck, lint, build and existing exhibition runtime checks.
- [x] Desktop/mobile signing and admin UI check; signed PDF visual check.
- [ ] Confirm legal parties, actual sale, due date, final terms and provider/fees.
- [ ] Configure Access, migrate staging D1, approve production rollout, and prepare Lola’s real record.
- [ ] Approve and send her invitation through the chosen email account.

No real sale record, invitation, or money transfer was created. Email delivery,
reminders, Shopify sale import, and actual transfers remain manual in this release.
