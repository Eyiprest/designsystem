import type { ReactNode } from 'react';
import { Dialog as AriaDialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import './Dialog.css';

export interface DialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** Visible heading. It also becomes the dialog's accessible name. */
  title: string;
  /** Content, or a function that receives `close`. */
  children: ReactNode | ((api: { close: () => void }) => ReactNode);
  /**
   * "alertdialog" is for confirmations that need an answer (delete, discard). It cannot be
   * dismissed by clicking outside, and its role tells assistive technology it is urgent.
   */
  role?: 'dialog' | 'alertdialog';
}

/**
 * Modal dialog on React Aria's Modal and Dialog. React Aria provides:
 * - focus moved into the dialog on open, and kept inside it (Tab and Shift+Tab wrap)
 * - focus returned to the element that was focused before opening
 * - Escape to close
 * - the rest of the page hidden from assistive technology and blocked from pointer input
 * - aria-labelledby pointing at the title heading
 *
 * The dialog is controlled so it can be opened from any native <Button>. Put `autoFocus` on the
 * safest button if the first thing in the dialog is not the right place for focus to start.
 */
export function Dialog({ isOpen, onOpenChange, title, children, role = 'dialog' }: DialogProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={role === 'dialog'}
      className="steady-dialog-overlay"
    >
      <Modal className="steady-dialog-modal">
        <AriaDialog role={role} className="steady-dialog">
          {({ close }) => (
            <>
              <Heading slot="title" className="steady-dialog__title">
                {title}
              </Heading>
              <div className="steady-dialog__body">{typeof children === 'function' ? children({ close }) : children}</div>
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

/** Right-aligned row of buttons at the bottom of a dialog. Primary action last. */
export function DialogActions({ children }: { children: ReactNode }) {
  return <div className="steady-dialog__actions">{children}</div>;
}
