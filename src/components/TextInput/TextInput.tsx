import type { InputHTMLAttributes, ReactNode } from 'react';
import { FieldError, FieldHint, RequiredMark, useFieldIds, useFormError } from '../internal/field';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: ReactNode;
  hint?: ReactNode;
  /** Error message. Inside a <Form>, the error for `name` is picked up automatically. */
  error?: ReactNode;
}

/**
 * Native `<input>` with a visible `<label>`. The hint and error are linked with aria-describedby,
 * and `aria-invalid` is set only while an error is showing.
 * Pass `autoComplete` for personal data fields (WCAG 1.3.5).
 */
export function TextInput({ label, hint, error: errorProp, id, name, required, className, type = 'text', ...rest }: TextInputProps) {
  const error = useFormError(name, errorProp);
  const { controlId, hintId, errorId, describedBy } = useFieldIds(id, Boolean(hint), Boolean(error));

  return (
    <div className={['steady-field', className].filter(Boolean).join(' ')}>
      <label htmlFor={controlId} className="steady-field__label">
        {label}
        {required ? <RequiredMark /> : null}
      </label>
      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      <input
        {...rest}
        id={controlId}
        name={name}
        type={type}
        required={required}
        className="steady-control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
    </div>
  );
}
