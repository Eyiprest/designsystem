import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Radio, RadioGroup } from '../Choice/Choice';
import { TextInput } from '../TextInput/TextInput';
import { Form } from './Form';
import type { FormErrors, FormValues } from './Form';

const validate = (v: FormValues): FormErrors => {
  const errors: FormErrors = {};
  if (!String(v.fullName ?? '').trim()) errors.fullName = 'Enter your full name';
  const email = String(v.email ?? '').trim();
  if (!email) errors.email = 'Enter your email address';
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter an email address in the correct format, like ada@example.com';
  if (!v.method) errors.method = 'Choose a payment method';
  return errors;
};

const meta = {
  title: 'Components/Form with validation',
  component: Form,
  args: { validate, onSubmit: fn(), children: null, 'aria-label': 'Contact and payment' },
  render: (args) => (
    <div style={{ maxWidth: 440 }}>
      <Form {...args}>
        {({ isSubmitting }) => (
          <>
            <TextInput label="Full name" name="fullName" autoComplete="name" required />
            <TextInput label="Email address" name="email" type="email" autoComplete="email" required hint="For example, ada@example.com" />
            <RadioGroup legend="Payment method" name="method" required>
              <Radio value="bank" label="Bank transfer" />
              <Radio value="ussd" label="USSD" />
            </RadioGroup>
            <div>
              <Button type="submit" isLoading={isSubmitting} loadingLabel="Submitting">Continue</Button>
            </div>
          </>
        )}
      </Form>
    </div>
  ),
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const FailedSubmit: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));

    // Summary appears and takes focus.
    const summary = await canvas.findByRole('group', { name: 'There is a problem' });
    await waitFor(() => expect(summary).toHaveFocus());
    await expect(args.onSubmit).not.toHaveBeenCalled();

    // One link per problem, wording identical to the inline message.
    const links = within(summary).getAllByRole('link');
    await expect(links.map((l) => l.textContent)).toEqual([
      'Enter your full name',
      'Enter your email address',
      'Choose a payment method',
    ]);
    await expect(canvas.getByLabelText(/Full name/)).toHaveAccessibleDescription('Error: Enter your full name');

    // Each link moves focus to its field. For the radio group it is the first radio.
    await userEvent.click(within(summary).getByRole('link', { name: 'Enter your email address' }));
    await expect(canvas.getByLabelText(/Email address/)).toHaveFocus();
    await userEvent.click(within(summary).getByRole('link', { name: 'Choose a payment method' }));
    await expect(canvas.getByRole('radio', { name: 'Bank transfer' })).toHaveFocus();
  },
};

export const FixThenSubmit: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await canvas.findByRole('group', { name: 'There is a problem' });

    await userEvent.type(canvas.getByLabelText(/Full name/), 'Ada Lovelace');
    await userEvent.type(canvas.getByLabelText(/Email address/), 'ada@example.com');
    await userEvent.click(canvas.getByRole('radio', { name: 'USSD' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
    await expect(args.onSubmit).toHaveBeenCalledWith({ fullName: 'Ada Lovelace', email: 'ada@example.com', method: 'ussd' });
    await expect(canvas.queryByRole('group', { name: 'There is a problem' })).toBeNull();
  },
};

export const BadEmailFormat: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/Full name/), 'Ada');
    await userEvent.type(canvas.getByLabelText(/Email address/), 'not-an-email');
    await userEvent.click(canvas.getByRole('radio', { name: 'Bank transfer' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    const input = canvas.getByLabelText(/Email address/);
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(
      'For example, ada@example.com Error: Enter an email address in the correct format, like ada@example.com',
    );
  },
};
