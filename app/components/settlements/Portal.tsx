import type {ReactNode} from 'react';
import {Form, useNavigation} from 'react-router';
import {dollars, totals, type Terms} from '~/lib/settlements/domain';

export function Portal({
  children,
  admin = false,
  signing = false,
}: {
  children: ReactNode;
  admin?: boolean;
  signing?: boolean;
}) {
  return (
    <div className={`settlement${signing ? ' settlement--signing' : ''}`}>
      <header className="settlement-header">
        <a href="/" aria-label="MCLIV home">
          <img src="/icons/logo.svg" alt="MCLIV" width="104" height="30" />
        </a>
        <span>
          {admin
            ? 'Artist payments / Admin'
            : signing
              ? 'Artist agreement'
              : 'Artist payments'}
        </span>
        <a href="mailto:info@mcliv.studio">Contact MCLIV</a>
      </header>
      <main className="settlement-main">{children}</main>
      <footer className="settlement-footer">
        MCLIV <span>Private artist services</span>
      </footer>
    </div>
  );
}
export function Submit({
  children,
  name,
  value,
}: {
  children: ReactNode;
  name?: string;
  value?: string;
}) {
  const busy = useNavigation().state !== 'idle';
  return (
    <button
      className="settlement-button"
      type="submit"
      name={name}
      value={value}
      disabled={busy}
    >
      {busy ? 'Please wait…' : children}
    </button>
  );
}
export function Notice({message}: {message?: string | null}) {
  return message ? (
    <div className="settlement-notice" role="status">
      {message}
    </div>
  ) : null;
}
export function SaleStatement({terms}: {terms: Terms}) {
  const split = totals(terms);
  return (
    <dl className="settlement-statement">
      <div>
        <dt>Artwork sale</dt>
        <dd>{dollars(terms.artworkCents)}</dd>
      </div>
      <div>
        <dt>MCLIV commission · 20%</dt>
        <dd>−{dollars(split.commission)}</dd>
      </div>
      <div>
        <dt>Agreed deductions</dt>
        <dd>−{dollars(terms.deductionCents)}</dd>
      </div>
      <div className="settlement-total">
        <dt>Your payment</dt>
        <dd>{dollars(split.artist)}</dd>
      </div>
      <div>
        <dt>Payment initiation deadline</dt>
        <dd>{terms.dueDate}</dd>
      </div>
    </dl>
  );
}
export function HelpForm({preview = false}: {preview?: boolean}) {
  return (
    <details className="settlement-help">
      <summary>Something wrong, or need help signing?</summary>
      {preview ? (
        <p>
          This test request will not send a message or create a support case. Do
          not enter private information.
        </p>
      ) : (
        <p>
          Ask for a correction, a different payment method, or assisted signing.
          This does not waive money owed or restart your payment deadline.
          Requests appear in MCLIV’s payment queue; contact us directly if
          urgent.
        </p>
      )}
      <Form method="post">
        <input type="hidden" name="intent" value="help" />
        <label>
          How can we help?
          <textarea
            name="reason"
            required
            minLength={3}
            maxLength={2000}
            placeholder="Do not enter bank account numbers or tax IDs."
          />
        </label>
        <Submit>Request help</Submit>
      </Form>
    </details>
  );
}
