import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, MouseEvent, ReactNode } from 'react';
import { FormErrorsContext } from '../internal/field';
import './Form.css';

export type FormValues = Record<string, FormDataEntryValue | FormDataEntryValue[]>;
export type FormErrors = Record<string, string>;

export interface FormProps {
  /**
   * Return an object of `{ fieldName: message }`. An empty object means the values are valid.
   * Messages are shown inline and again, word for word, in the error summary.
   */
  validate: (values: FormValues) => FormErrors;
  /** Called only when `validate` returns no errors. May be async. */
  onSubmit: (values: FormValues) => void | Promise<void>;
  /** Content, or a function that receives `{ isSubmitting }` so the submit button can show progress. */
  children: ReactNode | ((state: { isSubmitting: boolean }) => ReactNode);
  /** Heading of the error summary. */
  errorSummaryTitle?: string;
  /**
   * Called whenever the set of visible errors changes. Use it to prefix the page title with
   * "Error:" while the form has errors, so the problem is the first thing a screen reader announces.
   */
  onValidationChange?: (errors: FormErrors) => void;
  /** Short name for the form, used as its accessible name. */
  'aria-label'?: string;
  className?: string;
}

function readValues(form: HTMLFormElement): FormValues {
  const out: FormValues = {};
  for (const [key, value] of new FormData(form).entries()) {
    const existing = out[key];
    if (existing === undefined) out[key] = value;
    else out[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
  }
  return out;
}

/**
 * A native `<form noValidate>` that owns validation, so messages are ours and not the browser's
 * popups (which are announced inconsistently and cannot be styled or summarised).
 *
 * On a failed submit: errors appear inline, an error summary appears at the top of the form, and
 * focus moves to the summary. Each summary link moves focus to its field. After that, each error
 * clears when its field becomes valid.
 */
export function Form({ validate, onSubmit, children, errorSummaryTitle = 'There is a problem', onValidationChange, className, ...rest }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [isSubmitting, setSubmitting] = useState(false);
  const headingId = useId();

  // Move focus to the summary after a failed submit, and only then. Depending on `errors` here would
  // pull focus out of the field the user is typing in every time an error clears.
  // The attempt counter makes this run again if the user submits a second time with the same errors.
  useEffect(() => {
    if (attempt > 0) summaryRef.current?.focus();
  }, [attempt]);

  useEffect(() => {
    onValidationChange?.(errors);
  }, [errors, onValidationChange]);

  /**
   * After a failed submit, errors clear as soon as the field is fixed. They never appear early and the
   * wording never changes while the user types: only errors that were already showing can go away.
   * This also drops an error for a field that has since left the form.
   */
  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    if (Object.keys(errors).length === 0) return;
    const found = validate(readValues(event.currentTarget));
    setErrors((previous) => {
      const remaining = Object.entries(previous).filter(([name]) => name in found);
      // Same set: return the old object so nothing re-renders.
      return remaining.length === Object.keys(previous).length ? previous : Object.fromEntries(remaining);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const values = readValues(event.currentTarget);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setAttempt((n) => n + 1);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  const focusField = (event: MouseEvent<HTMLAnchorElement>, name: string) => {
    event.preventDefault();
    const found = formRef.current?.elements.namedItem(name);
    // Radios and checkboxes with one name come back as a list: focus the first.
    const target = found instanceof RadioNodeList ? found[0] : found;
    if (target instanceof HTMLElement) {
      target.focus();
      target.scrollIntoView({ block: 'center' });
    }
  };

  const entries = Object.entries(errors);

  return (
    <FormErrorsContext.Provider value={errors}>
      <form
        {...rest}
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        onChange={handleChange}
        className={['steady-form', className].filter(Boolean).join(' ')}
      >
        {entries.length > 0 ? (
          <div ref={summaryRef} tabIndex={-1} role="group" aria-labelledby={headingId} className="steady-error-summary">
            <h2 id={headingId} className="steady-error-summary__title">
              {errorSummaryTitle}
            </h2>
            <ul className="steady-error-summary__list">
              {entries.map(([name, message]) => (
                <li key={name}>
                  <a href={`#${name}`} onClick={(e) => focusField(e, name)}>
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {typeof children === 'function' ? children({ isSubmitting }) : children}
      </form>
    </FormErrorsContext.Provider>
  );
}
