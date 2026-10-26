import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Alert, ToastHost, showToast } from './Notification';

const meta = {
  title: 'Components/Notification',
  component: Alert,
  args: { variant: 'info', title: 'Sample checkout' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InfoAlert: Story = {
  args: { variant: 'info', title: 'Sample checkout', children: 'No money moves in this demonstration.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Sample checkout');
  },
};

export const StaticNotice: Story = {
  args: { variant: 'info', live: false, title: 'Standing notice', children: 'Already on the page at load, so it is not a live region.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('status')).toBeNull();
    await expect(within(canvasElement).queryByRole('alert')).toBeNull();
    await expect(within(canvasElement).getByText('Standing notice')).toBeInTheDocument();
  },
};

export const SuccessAlert: Story = {
  args: { variant: 'success', title: 'Details saved', children: 'Your delivery details were updated.' },
};

export const WarningAlert: Story = {
  args: { variant: 'warning', title: 'Order expires soon', children: 'The sample reference is valid for 24 hours.' },
};

export const ErrorAlert: Story = {
  args: { variant: 'error', title: 'We could not place the order', children: 'The sample service is not responding. Try again.' },
  play: async ({ canvasElement }) => {
    // Errors use role=alert so they are announced immediately.
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent('We could not place the order');
  },
};

export const Toasts: Story = {
  render: () => (
    <>
      <Button onClick={() => showToast({ title: 'Receipt sent', description: 'Check your email in a few minutes.', variant: 'success' })}>
        Send receipt
      </Button>
      <ToastHost />
    </>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Send receipt' });
    await userEvent.click(trigger);

    // Region is labelled, the toast appears, and focus stays on the button that caused it.
    const region = await screen.findByRole('region');
    await expect(region).toHaveAccessibleName(/notification/i);
    await within(region).findByText('Receipt sent');
    await expect(trigger).toHaveFocus();

    // Dismiss button is reachable and works. Simulated Enter does not trigger React Aria's press
    // handler in this test runner, so keyboard dismissal is checked with real key events in
    // scripts/keyboard-checks.mjs. Here we click.
    const dismiss = within(region).getByRole('button', { name: 'Dismiss' });
    await userEvent.click(dismiss);
    // The whole region unmounts when the queue is empty, so query the document, not the old region node.
    await waitFor(() => expect(screen.queryByText('Receipt sent')).toBeNull());
  },
};
