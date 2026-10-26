import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { ToastHost, toastQueue } from '../index';
import { Checkout } from './Checkout';

const meta = {
  title: 'Patterns/Checkout (demonstration)',
  component: Checkout,
  parameters: { layout: 'fullscreen' },
  // The toast queue is shared by the whole page. Empty it so a toast from one story cannot show up in the next.
  beforeEach: () => {
    toastQueue.clear();
  },
  render: () => (
    <>
      <Checkout />
      <ToastHost />
    </>
  ),
} satisfies Meta<typeof Checkout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The page as first loaded. No interaction, so axe checks the starting state. */
export const Initial: Story = {};

async function fillContact(canvas: ReturnType<typeof within>) {
  await userEvent.type(canvas.getByLabelText(/Full name/), 'Ada Lovelace');
  await userEvent.type(canvas.getByLabelText(/Email address/), 'ada@example.com');
  await userEvent.type(canvas.getByLabelText(/Phone number/), '0800 000 0000');
}

/** Submit empty: summary appears, takes focus, links go to the right fields. Final state is checked by axe. */
export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Place sample order' }));
    const summary = await canvas.findByRole('group', { name: 'There is a problem' });
    await waitFor(() => expect(summary).toHaveFocus());
    await expect(within(summary).getAllByRole('link').map((l) => l.textContent)).toEqual([
      'Enter your full name',
      'Enter your email address',
      'Enter a phone number',
      'Choose a payment method',
    ]);
    // Page title leads with the problem.
    await expect(document.title.startsWith('Error: ')).toBe(true);
  },
};

export const PhoneFormatError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillContact(canvas);
    const phone = canvas.getByLabelText(/Phone number/);
    await userEvent.clear(phone);
    await userEvent.type(phone, '12');
    await userEvent.click(canvas.getByRole('radio', { name: 'Bank transfer' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Place sample order' }));
    await expect(await canvas.findByRole('link', { name: /Enter a phone number with 7 to 15 digits/ })).toBeInTheDocument();
  },
};

export const PickingAMethodShowsFeedback: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'USSD' }));
    // A visible instruction block, plus a polite status message for screen readers.
    await expect(canvas.getByRole('heading', { name: 'USSD: what happens next' })).toBeInTheDocument();
    const announcement = canvas.getByText('USSD selected. Instructions are shown below the payment methods.');
    await expect(announcement).toHaveAttribute('role', 'status');
    // Bank select is required for USSD, and the cash-only field is absent.
    await expect(canvas.getByLabelText(/Your bank/)).toBeInTheDocument();
    await expect(canvas.queryByLabelText(/Pickup point/)).toBeNull();
    await userEvent.click(canvas.getByRole('radio', { name: 'Pay with cash' }));
    await expect(canvas.getByLabelText(/Pickup point/)).toBeInTheDocument();
    await expect(canvas.queryByLabelText(/Your bank/)).toBeNull();
  },
};

export const BankTransferFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillContact(canvas);
    await userEvent.click(canvas.getByRole('radio', { name: 'Bank transfer' }));
    await userEvent.selectOptions(canvas.getByLabelText(/Your bank/), 'harbour');
    const submit = canvas.getByRole('button', { name: 'Place sample order' });
    await userEvent.click(submit);

    // Loading state: still focusable, label changes.
    await expect(await canvas.findByRole('button', { name: 'Placing sample order' })).toHaveAttribute('aria-disabled', 'true');

    // Confirmation. It must not claim that any payment happened.
    const heading = await canvas.findByRole('heading', { name: 'Sample order created' }, { timeout: 4000 });
    await waitFor(() => expect(heading).toHaveFocus());
    await expect(canvas.getByText(/awaiting payment \(sample\)/)).toBeInTheDocument();
    await expect(canvas.queryByText(/payment received|payment successful|paid/i)).toBeNull();
    await expect(document.title).toBe('Sample order placed | Steady');

    // Tabs show the instructions for the method that was chosen.
    await userEvent.click(canvas.getByRole('tab', { name: 'Bank transfer details' }));
    await expect(canvas.getByText('SAMPLE SHOP LTD (DEMO)')).toBeInTheDocument();

    // Receipt checkbox was ticked, so a toast confirms it, and says nothing was emailed.
    await expect(await screen.findByText('Sample receipt "sent"')).toBeInTheDocument();
  },
};

export const UssdFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillContact(canvas);
    await userEvent.click(canvas.getByRole('radio', { name: 'USSD' }));
    await userEvent.selectOptions(canvas.getByLabelText(/Your bank/), 'meridian');
    await userEvent.click(canvas.getByRole('button', { name: 'Place sample order' }));
    await canvas.findByRole('heading', { name: 'Sample order created' }, { timeout: 4000 });
    await userEvent.click(canvas.getByRole('tab', { name: 'USSD details' }));
    await expect(canvas.getByText('*000*22*SO1042*35200#')).toBeInTheDocument();
    await expect(canvas.getByText(/does not work on any network/)).toBeInTheDocument();
  },
};

export const CashFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillContact(canvas);
    await userEvent.click(canvas.getByRole('radio', { name: 'Pay with cash' }));
    await userEvent.selectOptions(canvas.getByLabelText(/Pickup point/), 'point-b');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Send me a sample receipt' })); // untick
    await userEvent.click(canvas.getByRole('button', { name: 'Place sample order' }));
    await canvas.findByRole('heading', { name: 'Sample order created' }, { timeout: 4000 });
    await userEvent.click(canvas.getByRole('tab', { name: 'Pay with cash details' }));
    await expect(canvas.getByText(/Sample Point B/)).toBeInTheDocument();
    // No receipt was requested, so no toast.
    await expect(screen.queryByText('Sample receipt "sent"')).toBeNull();
  },
};

export const SimulatedFailure: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillContact(canvas);
    await userEvent.click(canvas.getByRole('radio', { name: 'Bank transfer' }));
    await userEvent.selectOptions(canvas.getByLabelText(/Your bank/), 'ridge');
    await userEvent.click(canvas.getByRole('switch', { name: 'Simulate a failed order' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Place sample order' }));
    // Error is a role=alert, the form and the user's entries are still there.
    const alert = await canvas.findByRole('alert', {}, { timeout: 4000 });
    await expect(alert).toHaveTextContent('We could not place the order');
    await expect(canvas.getByLabelText(/Full name/)).toHaveValue('Ada Lovelace');
    await expect(canvas.queryByRole('heading', { name: 'Sample order created' })).toBeNull();
  },
};

export const ChangingMethodClearsStaleError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillContact(canvas);
    await userEvent.click(canvas.getByRole('radio', { name: 'Bank transfer' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Place sample order' }));
    const summary = await canvas.findByRole('group', { name: 'There is a problem' });
    await expect(within(summary).getByRole('link', { name: 'Choose your bank' })).toBeInTheDocument();
    // Switching to cash removes the bank field, so its error must not linger. The summary unmounts
    // when it has no errors left, so query the document and not the old summary node.
    await userEvent.click(canvas.getByRole('radio', { name: 'Pay with cash' }));
    await waitFor(() => expect(canvas.queryByRole('link', { name: 'Choose your bank' })).toBeNull());
    await expect(canvas.queryByRole('group', { name: 'There is a problem' })).toBeNull();
    // The new field's error does not appear until the next submit.
    await expect(canvas.getByLabelText(/Pickup point/)).not.toHaveAttribute('aria-invalid');
  },
};
