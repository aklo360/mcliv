import {data, Link, useFetcher, useLoaderData} from 'react-router';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import type {Route} from './+types/submit';
import {buildMeta} from '~/lib/seo';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const DRAFT_STORAGE_KEY = 'mcliv-artist-submission-draft';

const STEPS = [
  {name: 'artworkName', label: 'Name of Artwork', maxLength: 160},
  {name: 'materialMedia', label: 'Material/Media', maxLength: 240},
  {name: 'artistBio', label: 'Artist Bio', maxLength: 4000},
  {name: 'price', label: 'Price', maxLength: 120},
  {name: 'image', label: 'Image Upload (optional)', maxLength: 0},
] as const;

type TextFieldName = (typeof STEPS)[number]['name'] extends infer Name
  ? Exclude<Name, 'image'>
  : never;

type TextValues = Record<TextFieldName, string>;

type ActionData =
  | {ok: true; submissionId: string}
  | {
      ok: false;
      formError: string;
      fieldErrors?: Partial<Record<TextFieldName | 'image', string>>;
      step?: number;
    };

type TurnstileApi = {
  render: (target: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const EMPTY_VALUES: TextValues = {
  artworkName: '',
  materialMedia: '',
  artistBio: '',
  price: '',
};

export const meta: Route.MetaFunction = ({location}) =>
  buildMeta({
    title: '1620 Artist Submission | MCLIV Studio',
    description: 'Submit artwork information to MCLIV Studio.',
    pathname: location.pathname,
  });

export async function loader({context}: Route.LoaderArgs) {
  const hasTurnstile = Boolean(
    context.env.TURNSTILE_SITE_KEY && context.env.TURNSTILE_SECRET_KEY,
  );

  return {
    turnstileSiteKey: hasTurnstile ? context.env.TURNSTILE_SITE_KEY : null,
  };
}

export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data<ActionData>(
      {ok: false, formError: 'Method not allowed.'},
      {status: 405},
    );
  }

  const formData = await request.formData();

  if (readText(formData, 'website')) {
    return data<ActionData>({ok: true, submissionId: crypto.randomUUID()});
  }

  if (context.env.TURNSTILE_SECRET_KEY) {
    const isHuman = await verifyTurnstile(
      request,
      formData,
      context.env.TURNSTILE_SECRET_KEY,
    );

    if (!isHuman) {
      return data<ActionData>(
        {
          ok: false,
          formError: 'Verification failed. Try again.',
          step: 4,
        },
        {status: 400},
      );
    }
  }

  const values: TextValues = {
    artworkName: readText(formData, 'artworkName'),
    materialMedia: readText(formData, 'materialMedia'),
    artistBio: readText(formData, 'artistBio'),
    price: readText(formData, 'price'),
  };
  const fieldErrors: Partial<Record<TextFieldName | 'image', string>> = {};

  validateRequiredField(fieldErrors, 'artworkName', values.artworkName, 160);
  validateRequiredField(
    fieldErrors,
    'materialMedia',
    values.materialMedia,
    240,
  );
  validateRequiredField(fieldErrors, 'artistBio', values.artistBio, 4000);
  validateRequiredField(fieldErrors, 'price', values.price, 120);

  const imageEntry = formData.get('image');
  const image =
    imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;

  if (image && !ALLOWED_IMAGE_TYPES.has(image.type)) {
    fieldErrors.image = 'Use a JPEG, PNG, or WEBP image.';
  } else if (image && image.size > MAX_IMAGE_BYTES) {
    fieldErrors.image = 'The image must be 10 MB or smaller.';
  }

  const firstErrorStep = STEPS.findIndex((step) => fieldErrors[step.name]);
  if (firstErrorStep >= 0) {
    return data<ActionData>(
      {
        ok: false,
        formError: 'Check the highlighted response.',
        fieldErrors,
        step: firstErrorStep,
      },
      {status: 400},
    );
  }

  const database = context.env.ARTIST_SUBMISSIONS_DB;
  if (!database) {
    return data<ActionData>(
      {
        ok: false,
        formError: 'Submissions are temporarily unavailable.',
      },
      {status: 503},
    );
  }

  const submissionId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  let imageKey: string | null = null;

  try {
    if (image) {
      const imageBucket = context.env.ARTIST_SUBMISSION_IMAGES;
      if (!imageBucket) {
        return data<ActionData>(
          {
            ok: false,
            formError: 'Image uploads are temporarily unavailable.',
            step: 4,
          },
          {status: 503},
        );
      }

      imageKey = `artist-submissions/${submissionId}/${safeFilename(
        image.name,
      )}`;
      await imageBucket.put(imageKey, await image.arrayBuffer(), {
        httpMetadata: {contentType: image.type},
        customMetadata: {submissionId},
      });
    }

    const result = await database
      .prepare(
        `INSERT INTO artist_submissions (
          id,
          artwork_name,
          material_media,
          artist_bio,
          price,
          image_key,
          image_filename,
          image_content_type,
          image_size,
          created_at,
          source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        submissionId,
        values.artworkName,
        values.materialMedia,
        values.artistBio,
        values.price,
        imageKey,
        image?.name ?? null,
        image?.type ?? null,
        image?.size ?? null,
        createdAt,
        'mcliv.studio/submit',
      )
      .run();

    if (!result.success) {
      throw new Error('D1 insert failed');
    }

    return data<ActionData>({ok: true, submissionId});
  } catch (error) {
    if (imageKey && context.env.ARTIST_SUBMISSION_IMAGES) {
      await context.env.ARTIST_SUBMISSION_IMAGES.delete(imageKey).catch(
        () => undefined,
      );
    }
    console.error('Artist submission failed', error);
    return data<ActionData>(
      {
        ok: false,
        formError: 'The submission could not be saved. Try again.',
      },
      {status: 500},
    );
  }
}

export default function Submit() {
  const {turnstileSiteKey} = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ActionData>();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<TextValues>(EMPTY_VALUES);
  const [imageName, setImageName] = useState('');
  const [localError, setLocalError] = useState('');
  const [turnstileReady, setTurnstileReady] = useState(!turnstileSiteKey);
  const isSubmitting = fetcher.state !== 'idle';
  const isComplete = fetcher.data?.ok === true;

  useEffect(() => {
    try {
      const storedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (!storedDraft) return;
      const draft = JSON.parse(storedDraft) as {
        values?: Partial<TextValues>;
        step?: number;
      };
      setValues({...EMPTY_VALUES, ...draft.values});
      if (
        typeof draft.step === 'number' &&
        draft.step >= 0 &&
        draft.step < STEPS.length
      ) {
        setStep(draft.step);
      }
    } catch {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (isComplete) {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({values, step}));
  }, [isComplete, step, values]);

  useEffect(() => {
    if (fetcher.data?.ok === false && fetcher.data.step !== undefined) {
      setStep(fetcher.data.step);
    }
  }, [fetcher.data]);

  useEffect(() => {
    const activePanel = formRef.current?.querySelector<HTMLElement>(
      `[data-submit-step="${step}"]`,
    );
    const activeControl = activePanel?.querySelector<HTMLElement>(
      'input:not([type="hidden"]), textarea',
    );
    activeControl?.focus();
  }, [step]);

  const activeServerError =
    fetcher.data?.ok === false
      ? fetcher.data.fieldErrors?.[STEPS[step].name]
      : undefined;
  const errorMessage = localError || activeServerError || '';

  const updateValue = (
    fieldName: TextFieldName,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLocalError('');
    setValues((current) => ({
      ...current,
      [fieldName]: event.target.value,
    }));
  };

  const submitForm = useCallback(() => {
    if (!formRef.current || isSubmitting) return;
    void fetcher.submit(formRef.current, {
      method: 'POST',
      encType: 'multipart/form-data',
    });
  }, [fetcher, isSubmitting]);

  const continueForm = useCallback(() => {
    if (step < STEPS.length - 1) {
      const activeStep = STEPS[step];
      if (activeStep.name !== 'image' && !values[activeStep.name].trim()) {
        setLocalError('This response is required.');
        return;
      }
      setLocalError('');
      setStep((current) => current + 1);
      return;
    }

    if (turnstileSiteKey && !turnstileReady) {
      setLocalError('Complete the verification first.');
      return;
    }

    submitForm();
  }, [step, submitForm, turnstileReady, turnstileSiteKey, values]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== 'Enter' || event.target instanceof HTMLButtonElement) {
      return;
    }

    if (
      event.target instanceof HTMLTextAreaElement &&
      !event.metaKey &&
      !event.ctrlKey
    ) {
      return;
    }

    if (
      event.target instanceof HTMLInputElement &&
      event.target.type === 'file'
    ) {
      return;
    }

    event.preventDefault();
    continueForm();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    continueForm();
  };

  if (fetcher.data?.ok) {
    return <SubmissionComplete submissionId={fetcher.data.submissionId} />;
  }

  return (
    <main className="submit-shell">
      <header className="submit-header">
        <Link
          className="submit-logo-link"
          to="/"
          aria-label="MCLIV Studio home"
        >
          <img className="submit-logo" src="/icons/logo.svg" alt="MCLIV" />
        </Link>
        <p className="submit-header-title">1620 Artist Submission</p>
        <p className="submit-progress-count">
          {formatStep(step + 1)} / {formatStep(STEPS.length)}
        </p>
      </header>

      <div className="submit-progress-track" aria-hidden="true">
        <span style={{width: `${((step + 1) / STEPS.length) * 100}%`}} />
      </div>

      <fetcher.Form
        ref={formRef}
        className="submit-form"
        method="post"
        encType="multipart/form-data"
        noValidate
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
      >
        <div className="submit-honeypot" aria-hidden="true">
          <label htmlFor="submit-website">Website</label>
          <input
            id="submit-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <section
          className="submit-question"
          data-submit-step="0"
          hidden={step !== 0}
        >
          <QuestionHeading index={0} />
          <input
            id="artworkName"
            className="submit-text-input"
            name="artworkName"
            type="text"
            value={values.artworkName}
            maxLength={160}
            aria-labelledby="submit-question-0"
            aria-describedby={errorMessage ? 'submit-active-error' : undefined}
            onChange={(event) => updateValue('artworkName', event)}
          />
        </section>

        <section
          className="submit-question"
          data-submit-step="1"
          hidden={step !== 1}
        >
          <QuestionHeading index={1} />
          <input
            id="materialMedia"
            className="submit-text-input"
            name="materialMedia"
            type="text"
            value={values.materialMedia}
            maxLength={240}
            aria-labelledby="submit-question-1"
            aria-describedby={errorMessage ? 'submit-active-error' : undefined}
            onChange={(event) => updateValue('materialMedia', event)}
          />
        </section>

        <section
          className="submit-question submit-question--bio"
          data-submit-step="2"
          hidden={step !== 2}
        >
          <QuestionHeading index={2} />
          <textarea
            id="artistBio"
            className="submit-text-input submit-textarea"
            name="artistBio"
            value={values.artistBio}
            maxLength={4000}
            rows={5}
            aria-labelledby="submit-question-2"
            aria-describedby={errorMessage ? 'submit-active-error' : undefined}
            onChange={(event) => updateValue('artistBio', event)}
          />
          <p className="submit-field-note">Command + Enter to continue</p>
        </section>

        <section
          className="submit-question"
          data-submit-step="3"
          hidden={step !== 3}
        >
          <QuestionHeading index={3} />
          <input
            id="price"
            className="submit-text-input"
            name="price"
            type="text"
            inputMode="text"
            value={values.price}
            maxLength={120}
            aria-labelledby="submit-question-3"
            aria-describedby={errorMessage ? 'submit-active-error' : undefined}
            onChange={(event) => updateValue('price', event)}
          />
        </section>

        <section
          className="submit-question"
          data-submit-step="4"
          hidden={step !== 4}
        >
          <QuestionHeading index={4} />
          <div className="submit-upload-row">
            <label className="submit-upload-trigger" htmlFor="image">
              Select Image
            </label>
            <span className="submit-upload-name">
              {imageName || 'No file selected'}
            </span>
          </div>
          <input
            id="image"
            className="submit-file-input"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-labelledby="submit-question-4"
            aria-describedby="submit-image-note"
            onChange={(event) => {
              setLocalError('');
              setImageName(event.target.files?.[0]?.name ?? '');
            }}
          />
          <p id="submit-image-note" className="submit-field-note">
            JPEG, PNG, or WEBP · 10 MB max
          </p>
          {turnstileSiteKey ? (
            <Turnstile
              siteKey={turnstileSiteKey}
              onStatusChange={setTurnstileReady}
            />
          ) : null}
        </section>

        <div className="submit-form-footer">
          <div className="submit-error-wrap" aria-live="polite">
            {errorMessage ? (
              <p id="submit-active-error" className="submit-error" role="alert">
                {errorMessage}
              </p>
            ) : fetcher.data?.ok === false ? (
              <p className="submit-error" role="alert">
                {fetcher.data.formError}
              </p>
            ) : null}
          </div>

          <nav className="submit-actions" aria-label="Submission steps">
            <button
              className="submit-action submit-action--back"
              type="button"
              disabled={step === 0 || isSubmitting}
              onClick={() => {
                setLocalError('');
                setStep((current) => Math.max(0, current - 1));
              }}
            >
              Back
            </button>
            <button
              className="submit-action submit-action--next"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting'
                : step === STEPS.length - 1
                  ? 'Submit'
                  : 'Continue'}
              <span aria-hidden="true">↗</span>
            </button>
          </nav>
        </div>
      </fetcher.Form>
    </main>
  );
}

function QuestionHeading({index}: {index: number}) {
  return (
    <div className="submit-question-heading">
      <p className="submit-question-number">{formatStep(index + 1)}</p>
      <h1 id={`submit-question-${index}`}>{STEPS[index].label}</h1>
    </div>
  );
}

function Turnstile({
  siteKey,
  onStatusChange,
}: {
  siteKey: string;
  onStatusChange: (ready: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let widgetId: string | null = null;
    let disposed = false;

    const renderWidget = () => {
      if (disposed || !containerRef.current || !window.turnstile || widgetId) {
        return;
      }

      const options: Record<string, unknown> = {
        sitekey: siteKey,
        theme: 'light',
        size: 'flexible',
        callback: () => onStatusChange(true),
      };
      options['expired-callback'] = () => onStatusChange(false);
      options['error-callback'] = () => onStatusChange(false);
      widgetId = window.turnstile.render(containerRef.current, options);
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-mcliv-turnstile]',
    );

    if (existingScript) {
      if (window.turnstile) renderWidget();
      else existingScript.addEventListener('load', renderWidget, {once: true});
    } else {
      const script = document.createElement('script');
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.mclivTurnstile = 'true';
      script.addEventListener('load', renderWidget, {once: true});
      document.head.appendChild(script);
    }

    return () => {
      disposed = true;
      if (existingScript) {
        existingScript.removeEventListener('load', renderWidget);
      }
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [onStatusChange, siteKey]);

  return <div className="submit-turnstile" ref={containerRef} />;
}

function SubmissionComplete({submissionId}: {submissionId: string}) {
  return (
    <main className="submit-shell submit-shell--complete">
      <header className="submit-header">
        <Link
          className="submit-logo-link"
          to="/"
          aria-label="MCLIV Studio home"
        >
          <img className="submit-logo" src="/icons/logo.svg" alt="MCLIV" />
        </Link>
        <p className="submit-header-title">1620 Artist Submission</p>
        <p className="submit-progress-count">Complete</p>
      </header>
      <div className="submit-progress-track" aria-hidden="true">
        <span style={{width: '100%'}} />
      </div>
      <section className="submit-complete">
        <p className="submit-question-number">Submission received</p>
        <h1>Thank you.</h1>
        <p className="submit-complete-copy">
          Your artwork information has been recorded.
        </p>
        <p className="submit-reference">Reference · {submissionId}</p>
        <Link className="submit-action submit-action--next" to="/">
          MCLIV Studio <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}

function readText(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === 'string' ? value.trim() : '';
}

function validateRequiredField(
  errors: Partial<Record<TextFieldName | 'image', string>>,
  fieldName: TextFieldName,
  value: string,
  maxLength: number,
) {
  if (!value) errors[fieldName] = 'This response is required.';
  else if (value.length > maxLength) {
    errors[fieldName] = `Use ${maxLength} characters or fewer.`;
  }
}

function safeFilename(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase() ?? 'image';
  const stem = filename
    .replace(/\.[^.]+$/, '')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return `${stem || 'artwork'}.${extension.replace(/[^a-z0-9]/g, '')}`;
}

async function verifyTurnstile(
  request: Request,
  formData: FormData,
  secret: string,
) {
  const token = readText(formData, 'cf-turnstile-response');
  if (!token) return false;

  const verification = new FormData();
  verification.set('secret', secret);
  verification.set('response', token);
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) verification.set('remoteip', remoteIp);

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {method: 'POST', body: verification},
    );
    const result = (await response.json()) as {success?: boolean};
    return response.ok && result.success === true;
  } catch {
    return false;
  }
}

function formatStep(value: number) {
  return String(value).padStart(2, '0');
}
