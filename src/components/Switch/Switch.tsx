import type { ReactNode } from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import type { SwitchProps as AriaSwitchProps } from 'react-aria-components';
import './Switch.css';

export interface SwitchProps extends Omit<AriaSwitchProps, 'children' | 'className' | 'style'> {
  /** Visible label. Describe the setting, not the state: "Email receipts", not "Turn on email receipts". */
  children: ReactNode;
}

/**
 * Built on React Aria's Switch, which renders a visually hidden `<input type="checkbox" role="switch">`.
 * React Aria provides the role, the checked state, Space to toggle, and the hover/focus/disabled
 * data attributes this stylesheet reads. The look is ours.
 *
 * Use a switch only when the change takes effect immediately. If the user must press a Save
 * button first, use a checkbox.
 */
export function Switch({ children, ...props }: SwitchProps) {
  return (
    <AriaSwitch {...props} className="steady-switch">
      <span className="steady-switch__track" aria-hidden="true">
        <span className="steady-switch__thumb" />
      </span>
      <span className="steady-switch__label">{children}</span>
    </AriaSwitch>
  );
}
