import type { ReactNode, SelectHTMLAttributes } from 'react';
import { FieldError, FieldHint, RequiredMark, useFieldIds, useFormError } from '../internal/field';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'children'> {
  label: ReactNode;
  options: SelectOption[];
  hint?: ReactNode;
  error?: ReactNode;
  /** Text of the empty first option, for example "Choose a bank". Omit when a value is always selected. */
  placeholder?: string;
}

/**
 * Wraps the browser's native `<select>`. The popup list, type-ahead, arrow keys and mobile pickers
 * all come from the browser, so they behave the way each person's device already teaches them.
 * Use this unless the options need rich content (icons, descriptions) or async search.
 */
export function Select({ label, options, hint, error: errorProp, placeholder, id, name, required, className, ...rest }: SelectProps) {
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
      <select
        {...rest}
        id={controlId}
        name={name}
        required={required}
        className="steady-control steady-select"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      >
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
