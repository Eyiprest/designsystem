import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Text,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from 'react-aria-components';
import './Notification.css';

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

/** Each variant has its own shape, so meaning never depends on colour alone. */
function VariantIcon({ variant }: { variant: NotificationVariant }) {
  const common = { width: 20, height: 20, viewBox: '0 0 20 20', 'aria-hidden': true, focusable: false } as const;
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  switch (variant) {
    case 'success':
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="8.2" {...stroke} />
          <path d="M6.2 10.4l2.6 2.6 5-5.4" {...stroke} />
        </svg>
      );
    case 'warning':
      return (
        <svg {...common}>
          <path d="M10 2.6l8 14H2l8-14z" {...stroke} />
          <path d="M10 8v4" {...stroke} />
          <circle cx="10" cy="14.3" r="0.6" fill="currentColor" stroke="currentColor" />
        </svg>
      );
    case 'error':
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="8.2" {...stroke} />
          <path d="M7 7l6 6M13 7l-6 6" {...stroke} />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="8.2" {...stroke} />
          <path d="M10 9v5" {...stroke} />
          <circle cx="10" cy="6.2" r="0.6" fill="currentColor" stroke="currentColor" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Alert: inline, stays until the page changes                         */
/* ------------------------------------------------------------------ */

export interface AlertProps {
  variant: NotificationVariant;
  title: string;
  children?: ReactNode;
  /**
   * Whether assistive technology should announce this message. Default true.
   * Set false for a message that is already on the page when it loads, such as a standing
   * notice at the top. A live role on content that never changes only adds noise.
   */
  live?: boolean;
  className?: string;
}

/**
 * Inline message. Errors use role="alert" (announced at once, interrupting speech).
 * Everything else uses role="status" (announced politely, at the next pause).
 *
 * Limitation: some screen readers do not announce a live region that is inserted into the page
 * already containing its text. For a message that appears after an action, prefer the toast
 * region below, which is always present in the page, or render the Alert empty and fill it.
 */
export function Alert({ variant, title, children, live = true, className }: AlertProps) {
  return (
    <div
      role={live ? (variant === 'error' ? 'alert' : 'status') : undefined}
      className={['steady-alert', `steady-alert--${variant}`, className].filter(Boolean).join(' ')}
    >
      <VariantIcon variant={variant} />
      <div className="steady-alert__text">
        <p className="steady-alert__title">{title}</p>
        {children ? <div>{children}</div> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toast: transient, routine, never takes focus                        */
/* ------------------------------------------------------------------ */

export interface ToastContentData {
  title: string;
  description?: string;
  /** Errors are deliberately not an option. Use <Alert variant="error"> so the message cannot time out. */
  variant?: 'info' | 'success';
}

export const toastQueue = new ToastQueue<ToastContentData>({ maxVisibleToasts: 3 });

/**
 * Show a routine confirmation, for example "Receipt sent".
 * `timeout` is in milliseconds. It is never shorter than 5000, and React Aria pauses the timer
 * while the pointer is over the toast or focus is inside the region.
 */
export function showToast(content: ToastContentData, timeout = 6000): string {
  return toastQueue.add(content, { timeout: Math.max(5000, timeout) });
}

/**
 * Mount once, near the end of <body>. React Aria renders it as a labelled region ("Notifications")
 * in a polite live region, and lets keyboard users jump to it with F6. Focus is never moved
 * into a toast automatically.
 */
export function ToastHost() {
  return (
    <ToastRegion queue={toastQueue} className="steady-toast-region">
      {({ toast }) => (
        <Toast toast={toast} className={`steady-toast steady-toast--${toast.content.variant ?? 'info'}`}>
          <VariantIcon variant={toast.content.variant ?? 'info'} />
          <ToastContent className="steady-toast__content">
            <Text slot="title" className="steady-toast__title">
              {toast.content.title}
            </Text>
            {toast.content.description ? (
              <Text slot="description" className="steady-toast__description">
                {toast.content.description}
              </Text>
            ) : null}
          </ToastContent>
          <AriaButton slot="close" aria-label="Dismiss" className="steady-toast__close">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </AriaButton>
        </Toast>
      )}
    </ToastRegion>
  );
}
