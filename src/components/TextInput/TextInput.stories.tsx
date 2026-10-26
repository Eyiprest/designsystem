import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TextInput } from './TextInput';

const meta = {
  title: 'Components/Text input',
  component: TextInput,
  args: { label: 'Full name', name: 'fullName', autoComplete: 'name' },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { label: 'Phone number', name: 'phone', type: 'tel', autoComplete: 'tel', hint: 'We use this only to send the payment reminder.' },
};

export const Required: Story = { args: { required: true } };

export const Error: Story = {
  args: { required: true, error: 'Enter your full name' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText(/Full name/);
    // The message is part of the field's description, and the field is marked invalid.
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Error: Enter your full name');
  },
};

export const ErrorWithHint: Story = {
  args: { label: 'Email address', name: 'email', type: 'email', autoComplete: 'email', hint: 'For example, ada@example.com', error: 'Enter an email address in the correct format' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Email address');
    // Hint is read first, then the error.
    await expect(input).toHaveAccessibleDescription('For example, ada@example.com Error: Enter an email address in the correct format');
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Ada Lovelace' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText('Full name')).toBeDisabled();
  },
};

export const Typing: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Full name');
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('Ada Lovelace');
    await expect(input).toHaveValue('Ada Lovelace');
  },
};
