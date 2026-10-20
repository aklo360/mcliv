import {Form} from 'react-router';
import {artists} from '~/lib/exhibition-1620';
import {DRAFT_AGREEMENT} from '~/lib/settlements/draft';
import type {Terms} from '~/lib/settlements/domain';
import {Submit} from './Portal';

function Field({
  name,
  label,
  value,
  type = 'text',
  hint,
}: {
  name: string;
  label: string;
  value?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label>
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value}
        required
        maxLength={500}
      />
      {hint && <span className="settlement-small">{hint}</span>}
    </label>
  );
}
export function AgreementForm({
  terms,
  reviseId,
}: {
  terms?: Terms;
  reviseId?: string;
}) {
  return (
    <Form method="post" action="/admin/settlements">
      <input type="hidden" name="intent" value="create" />
      <input type="hidden" name="reviseId" value={reviseId || ''} />
      <section className="settlement-form-section">
        <h2>Parties &amp; artwork</h2>
        <p>
          Use verified legal identities. Lola is the first sale; this form
          supports all 18 artists.
        </p>
        <div className="settlement-form-grid">
          <label>
            Artist
            <select
              name="artistSlug"
              defaultValue={
                terms?.artistSlug ||
                artists.find((a) => a.name.toLowerCase().includes('lola'))?.slug
              }
              required
            >
              {artists.map((a) => (
                <option value={a.slug} key={a.slug}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <Field
            name="artistLegalName"
            label="Artist legal name"
            value={terms?.artistLegalName}
          />
          <Field
            name="artistEmail"
            label="Verified artist email"
            type="email"
            value={terms?.artistEmail}
          />
          <Field
            name="artistCapacity"
            label="Signing capacity"
            value={terms?.artistCapacity}
            hint="For example, artist signing personally or authorized representative."
          />
          <Field
            name="artistAddress"
            label="Artist address"
            value={terms?.artistAddress}
          />
          <Field
            name="mclivLegalName"
            label="MCLIV legal person / company"
            value={terms?.mclivLegalName}
          />
          <Field
            name="mclivAddress"
            label="MCLIV address"
            value={terms?.mclivAddress}
          />
          <Field name="title" label="Artwork title" value={terms?.title} />
        </div>
        <label>
          Artwork record
          <textarea
            name="description"
            required
            maxLength={3000}
            defaultValue={terms?.description}
            placeholder="Year, medium, dimensions, frame, condition, image/catalogue reference and SKU."
          />
        </label>
      </section>
      <section className="settlement-form-section">
        <h2>Verified sale</h2>
        <p>
          Enter this artwork’s allocated amounts after discounts. Tax-inclusive
          receipts must be separated first. Do not use an entire multi-artwork
          order total.
        </p>
        <div className="settlement-form-grid">
          <Field
            name="orderId"
            label="Shopify order ID"
            value={terms?.orderId}
          />
          <Field
            name="lineId"
            label="Shopify line item ID"
            value={terms?.lineId}
          />
          <Field
            name="saleDate"
            label="Actual sale date"
            type="date"
            value={terms?.saleDate}
          />
          <Field
            name="dueDate"
            label="Agreed payment initiation deadline"
            type="date"
            value={terms?.dueDate}
          />
          {(
            [
              [
                'artworkAmount',
                'Artwork after discounts (USD)',
                'artworkCents',
              ],
              ['taxAmount', 'Allocated sales tax (USD)', 'taxCents'],
              ['shippingAmount', 'Allocated shipping (USD)', 'shippingCents'],
              [
                'totalAmount',
                'Total allocated to this line (USD)',
                'totalCents',
              ],
              ['deductionAmount', 'Agreed deductions (USD)', 'deductionCents'],
            ] as const
          ).map(([name, label, key]) => (
            <Field
              key={name}
              name={name}
              label={label}
              value={
                terms
                  ? (terms[key] / 100).toFixed(2)
                  : name === 'deductionAmount'
                    ? '0.00'
                    : undefined
              }
            />
          ))}
        </div>
        <label>
          Deduction explanation
          <textarea
            name="deductionReason"
            maxLength={2000}
            defaultValue={terms?.deductionReason}
            placeholder="None, or each specific deduction agreed by the artist."
          />
        </label>
      </section>
      <section className="settlement-form-section">
        <h2>Payment setup</h2>
        <p>
          Use a recipient-specific hosted bank/provider link. This app does not
          collect full bank details or initiate transfers.
        </p>
        <label>
          Approved method
          <select name="method" defaultValue={terms?.method || 'ach'}>
            <option value="ach">Direct bank / ACH</option>
            <option value="stripe">
              Stripe (requires approved account and hosted flow)
            </option>
          </select>
        </label>
        <Field
          name="payoutUrl"
          label="Secure hosted payment setup URL"
          type="url"
          value={terms?.payoutUrl}
        />
        <label>
          Approved fees and who pays them
          <textarea
            name="feeTerms"
            required
            maxLength={2000}
            defaultValue={terms?.feeTerms}
          />
        </label>
      </section>
      <section className="settlement-form-section">
        <h2>Agreement &amp; MCLIV signature</h2>
        <p>
          The text below is a draft. Replace the delivery/returns section and
          complete legal review before approval. The artist receives the exact
          approved text plus the sale statement above.
        </p>
        <label>
          Complete agreement terms
          <textarea
            name="agreement"
            required
            maxLength={40000}
            rows={22}
            defaultValue={terms?.agreement || DRAFT_AGREEMENT}
          />
        </label>
        <Field
          name="mclivSigner"
          label="Authorized MCLIV signer’s legal name"
        />
        {[
          [
            'legalReviewed',
            'The completed agreement, fee allocation, delivery, insurance, returns and deadline have been reviewed and approved for this sale.',
          ],
          [
            'saleVerified',
            'I verified the Shopify order line, discounts, tax and shipping allocation, artist share, and any deductions against the actual sale.',
          ],
          [
            'contactVerified',
            'I verified the legal artist identity, signing capacity, and invitation email.',
          ],
          [
            'noPriorPayment',
            'No artist payout has already been made or is pending outside this ledger. I have reconciled the bank records.',
          ],
          [
            'mclivConsent',
            'I am authorized to sign for the named MCLIV legal party. I consent to electronic records and intend my typed name to sign this exact agreement and sale statement.',
          ],
        ].map(([name, label]) => (
          <label key={name} className="settlement-check">
            <input type="checkbox" name={name} required />
            <span>{label}</span>
          </label>
        ))}
        <Submit>
          {reviseId ? 'Sign amended agreement' : 'Approve & sign as MCLIV'}
        </Submit>
        <p className="settlement-small">
          This stores the agreement and MCLIV signature. No invitation or
          payment is sent.
        </p>
      </section>
    </Form>
  );
}
