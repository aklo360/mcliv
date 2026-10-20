import {useEffect, useRef, useState} from 'react';
import {Form, useLocation, useNavigation, useSubmit} from 'react-router';
import {Portal, Notice, HelpForm} from './Portal';
import {CONSENT, dollars, type Terms} from '~/lib/settlements/domain';

export type ArtistView =
  | {authenticated: false}
  | {
      authenticated: true;
      terms: Terms;
      document: string;
      documentHash: string;
      signedAt: string | null;
      artistSigner: string | null;
      mclivSigner: string;
      mclivSignedAt: string;
      issue: string | null;
      fundsCleared: boolean;
      destinationVerified: boolean;
      last4: string | null;
      entitlement: number;
      payments: {
        id: string;
        status: string;
        amountCents: number;
        returnedCents: number;
        updatedAt: string;
      }[];
    };

const STEPS = ['Review agreement', 'Payment details', 'Sign agreement'];

function documentBlocks(document: string) {
  let offset = 0;
  return document.split('\n\n').map((text) => {
    const start = offset;
    offset += text.length + 2;
    return {text, start};
  });
}

export function ArtistFlow({
  data,
  result,
  preview = false,
}: {
  data: ArtistView;
  result?: {error?: string; message?: string; opened?: boolean};
  preview?: boolean;
}) {
  const submit = useSubmit();
  const location = useLocation();
  const busy = useNavigation().state !== 'idle';
  const [stage, setStage] = useState(0);
  const [token, setToken] = useState(preview ? 'preview' : '');
  const [setupOpened, setSetupOpened] = useState(false);
  const [destinationComplete, setDestinationComplete] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const signedAt = data.authenticated ? data.signedAt : null;
  useEffect(() => {
    const invite = new URLSearchParams(window.location.hash.slice(1)).get(
      'invite',
    );
    if (invite) {
      window.history.replaceState(null, '', window.location.pathname);
      setToken(invite);
    }
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    heading.current?.focus({preventScroll: true});
  }, [stage, data.authenticated, signedAt]);
  const message =
    result?.error ||
    (data.authenticated && data.signedAt ? undefined : result?.message);
  const previewNotice = preview && (
    <div className="signing-preview">
      Test walkthrough · No signature or payment is recorded.
    </div>
  );
  const restart = () => {
    setStage(0);
    setDestinationComplete(false);
    setSetupOpened(false);
    void submit({intent: 'exchange', token: 'preview'}, {method: 'post'});
  };
  if (!data.authenticated)
    return (
      <Portal signing>
        {previewNotice}
        <section className="signing-card signing-intro">
          <p className="signing-kicker">MCLIV / Artist services</p>
          <h1 ref={heading} tabIndex={-1}>
            Congrats, your art sold.
          </h1>
          <p>Review your agreement, add payment details, and sign.</p>
          <Notice message={message} />
          {token ? (
            <button
              className="settlement-button"
              type="button"
              disabled={busy}
              onClick={() =>
                void submit({intent: 'exchange', token}, {method: 'post'})
              }
            >
              {busy ? 'Opening agreement…' : 'Sign your consignment agreement'}
            </button>
          ) : (
            <p>
              Open your invitation from MCLIV, or{' '}
              <a href="mailto:info@mcliv.studio">request a new link</a>.
            </p>
          )}
        </section>
      </Portal>
    );
  const paid = data.payments
    .filter((p) => p.status === 'confirmed')
    .reduce((sum, p) => sum + p.amountCents - p.returnedCents, 0);
  const processing = data.payments
    .filter((p) => p.status === 'processing')
    .reduce((sum, p) => sum + p.amountCents, 0);
  const complete = paid === data.entitlement && data.entitlement > 0;
  return (
    <Portal signing>
      {previewNotice}
      <Notice message={message} />
      {data.issue && (
        <Notice message="Your request is under review. Contact MCLIV if your payment deadline is close." />
      )}
      {data.signedAt ? (
        <section className="signing-card">
          <p className="signing-kicker">MCLIV / {data.terms.artistName}</p>
          <h1 ref={heading} tabIndex={-1}>
            {preview
              ? 'Test complete.'
              : complete
                ? 'Payment confirmed.'
                : 'Agreement signed.'}
          </h1>
          <p>
            {preview
              ? 'Your sample agreement is ready.'
              : 'Keep a copy of your signed agreement.'}
          </p>
          <a
            className="settlement-button"
            href={`${location.pathname}/agreement.pdf`}
          >
            {preview ? 'Download test agreement' : 'Download signed agreement'}
          </a>
          {!preview && (
            <details className="signing-details">
              <summary>Payment status</summary>
              <dl className="settlement-statement">
                <div>
                  <dt>Confirmed received*</dt>
                  <dd>{dollars(paid)}</dd>
                </div>
                <div>
                  <dt>Processing</dt>
                  <dd>{dollars(processing)}</dd>
                </div>
                <div>
                  <dt>Remaining entitlement</dt>
                  <dd>{dollars(data.entitlement - paid)}</dd>
                </div>
                <div>
                  <dt>Payment details</dt>
                  <dd>
                    {data.destinationVerified
                      ? `Verified · •••• ${data.last4}`
                      : 'Awaiting verification'}
                  </dd>
                </div>
                <div>
                  <dt>Sale funds</dt>
                  <dd>
                    {data.fundsCleared ? 'Cleared' : 'Awaiting clearance'}
                  </dd>
                </div>
              </dl>
              <p className="settlement-small">
                *Based on reconciled bank/provider records, less recorded
                returns. Signing alone does not confirm payment.
              </p>
              {data.payments.map((p) => (
                <p key={p.id}>
                  {dollars(p.amountCents)} · {p.status} ·{' '}
                  {p.updatedAt.slice(0, 10)}
                  {p.returnedCents
                    ? ` · ${dollars(p.returnedCents)} returned`
                    : ''}
                </p>
              ))}
            </details>
          )}
          {preview && (
            <button
              type="button"
              className="settlement-text-button"
              disabled={busy}
              onClick={restart}
            >
              Start again
            </button>
          )}
          <HelpForm preview={preview} />
        </section>
      ) : (
        <>
          <div className="signing-toolbar">
            <div>
              <span className="signing-kicker">
                1620 / {data.terms.artistName}
              </span>
              <h1 ref={heading} tabIndex={-1}>
                {STEPS[stage]}
              </h1>
            </div>
            {stage === 0 && (
              <button
                type="button"
                className="settlement-text-button"
                onClick={() => window.print()}
              >
                Print
              </button>
            )}
          </div>
          <ol className="signing-progress" aria-label="Agreement steps">
            {['Review', 'Payment', 'Sign'].map((label, index) => (
              <li
                key={label}
                aria-current={stage === index ? 'step' : undefined}
                data-complete={index < stage}
              >
                <span>{index + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          {stage === 0 && (
            <article
              className="signing-paper"
              aria-label="Full consignment agreement"
            >
              <div className="signing-paper-header">
                <span>MCLIV</span>
                <span>Consignment agreement</span>
              </div>
              <div className="signing-document">
                {documentBlocks(data.document).map(({text, start}) => (
                  <p key={start}>{text}</p>
                ))}
              </div>
              <div className="signing-paper-footer">
                {preview
                  ? 'Test copy · Not a binding agreement'
                  : `MCLIV signed by ${data.mclivSigner} · ${data.mclivSignedAt.slice(0, 10)}`}
              </div>
            </article>
          )}
          {stage === 1 && (
            <section className="signing-card signing-step-card">
              <p className="signing-kicker">Payment destination</p>
              <h2>Where should we send your payment?</h2>
              {preview ? (
                <p>
                  Use sample details to try this step. No bank information is
                  collected.
                </p>
              ) : (
                <>
                  <p>
                    Add your details securely with our{' '}
                    {data.terms.method === 'ach' ? 'bank payment' : 'Stripe'}{' '}
                    provider, then return here.
                  </p>
                  <p className="settlement-small">{data.terms.feeTerms}</p>
                  {setupOpened && (
                    <>
                      <a
                        href={data.terms.payoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Reopen secure payment setup
                      </a>
                      <label className="settlement-check signing-destination">
                        <input
                          type="checkbox"
                          checked={destinationComplete}
                          onChange={(e) =>
                            setDestinationComplete(e.target.checked)
                          }
                        />
                        <span>
                          I completed payment setup. The recipient details
                          belong to me or my authorized payee.
                        </span>
                      </label>
                    </>
                  )}
                </>
              )}
            </section>
          )}
          {stage === 2 && (
            <section className="signing-card signing-step-card">
              <p className="signing-kicker">Artist signature</p>
              <h2>Sign your agreement.</h2>
              <Form id="signing-form" method="post">
                <input type="hidden" name="intent" value="sign" />
                <input
                  type="hidden"
                  name="documentHash"
                  value={data.documentHash}
                />
                <input
                  type="hidden"
                  name="destinationComplete"
                  value={destinationComplete ? 'on' : ''}
                />
                <label>
                  Your full legal name
                  <input
                    name="artistSigner"
                    required
                    autoComplete="name"
                    placeholder={data.terms.artistLegalName}
                    className="signing-name"
                  />
                </label>
                <p className="settlement-small">
                  {preview
                    ? 'Enter AKLO for this test.'
                    : `Enter exactly: ${data.terms.artistLegalName}. Signing as ${data.terms.artistCapacity}.`}
                </p>
                <label className="settlement-check">
                  <input type="checkbox" name="consent" required />
                  <span>
                    {preview
                      ? 'I understand this is a test, with no legal signature or real payment.'
                      : 'I agree to this agreement and consent to electronic signing under the terms below.'}
                  </span>
                </label>
                {!preview && (
                  <details className="signing-details">
                    <summary>Electronic signing terms</summary>
                    <p>{CONSENT}</p>
                  </details>
                )}
              </Form>
            </section>
          )}
          <div className="signing-support">
            <HelpForm preview={preview} />
          </div>
          <div className="signing-dock">
            <div className="signing-dock-inner">
              <span className="signing-step-count">Step {stage + 1} of 3</span>
              <div className="signing-actions">
                {stage > 0 && (
                  <button
                    type="button"
                    className="settlement-text-button"
                    disabled={busy}
                    onClick={() => setStage(stage - 1)}
                  >
                    Back
                  </button>
                )}
                {stage === 0 && (
                  <button
                    type="button"
                    className="settlement-button"
                    onClick={() => setStage(1)}
                  >
                    Continue
                  </button>
                )}
                {stage === 1 &&
                  (preview ? (
                    <button
                      type="button"
                      className="settlement-button"
                      onClick={() => {
                        setDestinationComplete(true);
                        setStage(2);
                      }}
                    >
                      Use test payment details
                    </button>
                  ) : setupOpened ? (
                    <button
                      type="button"
                      className="settlement-button"
                      disabled={!destinationComplete}
                      onClick={() => setStage(2)}
                    >
                      Continue
                    </button>
                  ) : (
                    <a
                      className="settlement-button"
                      href={data.terms.payoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setSetupOpened(true)}
                    >
                      Set up payment details
                    </a>
                  ))}
                {stage === 2 && (
                  <button
                    className="settlement-button"
                    type="submit"
                    form="signing-form"
                    disabled={busy || !destinationComplete}
                  >
                    {busy
                      ? 'Please wait…'
                      : preview
                        ? 'Complete test signature'
                        : 'Sign agreement & request payout'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Portal>
  );
}
