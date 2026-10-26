import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Dialog, DialogActions } from './Dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ role = 'dialog' }: { role?: 'dialog' | 'alertdialog' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{role === 'dialog' ? 'Edit delivery details' : 'Cancel order'}</Button>
      <p>
        <a href="#behind">A link behind the dialog</a>
      </p>
      <Dialog
        isOpen={open}
        onOpenChange={setOpen}
        role={role}
        title={role === 'dialog' ? 'Edit delivery details' : 'Cancel this order?'}
      >
        {({ close }) =>
          role === 'dialog' ? (
            <>
              <p>Changes apply to this sample order only.</p>
              <DialogActions>
                <Button variant="secondary" onClick={close}>Close</Button>
                <Button onClick={close}>Save</Button>
              </DialogActions>
            </>
          ) : (
            <>
              <p>The sample order will be removed. This cannot be undone.</p>
              <DialogActions>
                {/* Focus starts on the safe choice. */}
                <Button variant="secondary" autoFocus onClick={close}>Keep order</Button>
                <Button onClick={close}>Cancel order</Button>
              </DialogActions>
            </>
          )
        }
      </Dialog>
    </>
  );
}

export const Basic: Story = {
  args: { isOpen: false, onOpenChange: () => {}, title: '', children: null },
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Edit delivery details' });
    await userEvent.click(trigger);

    // Opens with an accessible name and focus inside the dialog.
    const dialog = await screen.findByRole('dialog', { name: 'Edit delivery details' });
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    // Tab never leaves the dialog: after more tabs than there are controls, focus is still inside.
    for (let i = 0; i < 6; i++) await userEvent.tab();
    await expect(dialog.contains(document.activeElement)).toBe(true);
    for (let i = 0; i < 6; i++) await userEvent.tab({ shift: true });
    await expect(dialog.contains(document.activeElement)).toBe(true);

    // The page behind is inert while the dialog is open: it cannot take focus or pointer input, and
    // browsers leave inert content out of the accessibility tree. React Aria uses `inert` for this.
    // (Testing Library's role queries and Playwright's ariaSnapshot ignore `inert`, so we assert it directly.
    // The accessibility-tree result was checked separately against Chromium's real tree. See docs/test-report.md.)
    const behind = canvasElement.querySelector<HTMLAnchorElement>('a[href="#behind"]');
    await expect(behind).not.toBeNull();
    await expect(behind!.closest('[inert]')).not.toBeNull();
    behind!.focus();
    await expect(behind).not.toHaveFocus();
    await expect(dialog.contains(document.activeElement)).toBe(true);

    // Escape closes it and focus returns to the button that opened it.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const ConfirmationAlertDialog: Story = {
  args: { isOpen: false, onOpenChange: () => {}, title: '', children: null },
  render: () => <Demo role="alertdialog" />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Cancel order' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', { name: 'Cancel this order?' });
    // The safe action has focus when it opens.
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Keep order' })).toHaveFocus());
    await userEvent.click(within(dialog).getByRole('button', { name: 'Keep order' }));
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
