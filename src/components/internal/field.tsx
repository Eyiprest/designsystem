import { createContext, useContext, useId } from 'react';
import type { ReactNode } from 'react';
import './field.css';

/**
 * Errors supplied by a surrounding <Form>. A field reads its own error by `name`,
 * so the field and the error summary always show the same message.
 */
export const FormErrorsContext = createContext<Record<string, string>>({});

export function useFormError(name: string | undefined, explicit: ReactNode | undefined): ReactNode | undefined {
  const fromForm = useContext(FormErrorsContext);
  if (explicit) return explicit;
  return name ? fromForm[name] : undefined;
}

export interface FieldIds {
  controlId: string;
  hintId: string | undefined;
  errorId: string | undefined;
  /** Space-separated ids for aria-describedby, in reading order: hint, then error. */
  describedBy: string | undefined;
}

export function useFieldIds(id: string | undefined, hasHint: boolean, hasError: boolean): FieldIds {
  const generated = useId();
  const controlId = id ?? generated;
  const hintId = hasHint ? `${controlId}-hint` : undefined;
  const errorId = hasError ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return { controlId, hintId, errorId, describedBy };
}

export function ErrorIcon() {
  return (
    <svg className="steady-field__error-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

/** Error text. The hidden "Error:" prefix means the message is not announced as a bare sentence. */
export function FieldError({ id, children }: { id: string | undefined; children: ReactNode }) {
  return (
    <p id={id} className="steady-field__error">
      <ErrorIcon />
      <span>
        <span className="steady-vh">Error: </span>
        {children}
      </span>
    </p>
  );
}

export function FieldHint({ id, children }: { id: string | undefined; children: ReactNode }) {
  return (
    <p id={id} className="steady-field__hint">
      {children}
    </p>
  );
}

/**
 * The visual "(required)" is hidden from assistive technology. The native `required`
 * attribute already exposes that state, and reading both would say "required" twice.
 */
export function RequiredMark() {
  return (
    <span className="steady-field__required" aria-hidden="true">
      {' '}
      (required)
    </span>
  );
}
