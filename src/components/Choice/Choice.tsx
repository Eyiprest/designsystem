import { createContext, useContext, useId, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { FieldError, FieldHint, RequiredMark, useFormError } from '../internal/field';
import './Choice.css';

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

interface ChoiceBase extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  label: ReactNode;
  hint?: ReactNode;
}

function ChoiceItem({ type, label, hint, id, className, ...rest }: ChoiceBase & { type: 'checkbox' | 'radio' }) {
  const generated = useId();
  const inputId = id ?? generated;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div className={['steady-choice', className].filter(Boolean).join(' ')}>
      <input {...rest} id={inputId} type={type} className="steady-choice__input" aria-describedby={hintId} />
      <label htmlFor={inputId} className="steady-choice__label">
        {label}
      </label>
      {hint ? (
        <FieldHint id={hintId}>{hint}</FieldHint>
      ) : null}
    </div>
  );
}

interface GroupProps {
  legend: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Used to read the error from a surrounding <Form>. */
  name?: string;
  children: ReactNode;
  className?: string;
}

/**
 * `fieldset` + `legend` is the native way to name a group. The hint and error hang off the
 * fieldset with aria-describedby, so they are read when focus enters the group.
 */
function Group({ legend, hint, error: errorProp, required, name, children, className }: GroupProps) {
  const error = useFormError(name, errorProp);
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <fieldset
      className={['steady-group', error ? 'steady-group--invalid' : '', className].filter(Boolean).join(' ')}
      aria-describedby={describedBy}
      data-name={name}
    >
      <legend className="steady-field__label">
        {legend}
        {required ? <RequiredMark /> : null}
      </legend>
      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      <div className="steady-group__items">{children}</div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Checkbox                                                            */
/* ------------------------------------------------------------------ */

export type CheckboxProps = ChoiceBase;

/** A single native checkbox. For several related options use <CheckboxGroup>. */
export function Checkbox(props: CheckboxProps) {
  return <ChoiceItem {...props} type="checkbox" />;
}

export type CheckboxGroupProps = GroupProps;

/** Related checkboxes. Each child is a <Checkbox> sharing one `name`. */
export function CheckboxGroup(props: CheckboxGroupProps) {
  return <Group {...props} />;
}

/* ------------------------------------------------------------------ */
/* Radio group                                                         */
/* ------------------------------------------------------------------ */

interface RadioContextValue {
  name: string;
  value: string | undefined;
  required: boolean;
  setValue: (v: string) => void;
}
const RadioContext = createContext<RadioContextValue | null>(null);

export interface RadioGroupProps extends Omit<GroupProps, 'name'> {
  /** Required. Native radios need a shared name, and it is also the key used by <Form>. */
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Native radio inputs sharing a name, so the browser provides the arrow-key behaviour:
 * Tab enters the group once, arrow keys move and select, Tab leaves.
 */
export function RadioGroup({ name, value, defaultValue, onValueChange, required, ...group }: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const setValue = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };
  return (
    <RadioContext.Provider value={{ name, value: current, required: Boolean(required), setValue }}>
      <Group {...group} name={name} required={required} />
    </RadioContext.Provider>
  );
}

export interface RadioProps extends Omit<ChoiceBase, 'name' | 'checked' | 'defaultChecked' | 'value'> {
  value: string;
}

export function Radio({ value, onChange, ...rest }: RadioProps) {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('<Radio> must be used inside <RadioGroup>.');
  return (
    <ChoiceItem
      {...rest}
      type="radio"
      name={ctx.name}
      value={value}
      checked={ctx.value === value}
      required={ctx.required}
      onChange={(e) => {
        ctx.setValue(value);
        onChange?.(e);
      }}
    />
  );
}
