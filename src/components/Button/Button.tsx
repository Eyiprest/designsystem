import type { ButtonHTMLAttributes, MouseEvent } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** While true the button stays focusable but ignores clicks. */
  isLoading?: boolean;
  /** Text shown instead of the children while loading, for example "Placing order". */
  loadingLabel?: string;
}

/**
 * Native `<button>`. `type` defaults to "button" so a button inside a form never
 * submits by accident.
 *
 * Loading uses `aria-disabled` and not `disabled`. A `disabled` button drops out of the tab
 * order, so keyboard focus would be lost at the moment the user pressed it.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingLabel = 'Working',
  type = 'button',
  className,
  children,
  onClick,
  disabled,
  ...rest
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isLoading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      aria-disabled={isLoading || undefined}
      onClick={handleClick}
      className={['steady-button', `steady-button--${variant}`, `steady-button--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      data-loading={isLoading || undefined}
    >
      {isLoading ? (
        <>
          <span className="steady-button__spinner" aria-hidden="true" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
