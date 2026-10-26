import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Select } from './Select';

const banks = [
  { value: 'harbour', label: 'Harbour Bank (sample)' },
  { value: 'meridian', label: 'Meridian Savings (sample)' },
  { value: 'ridge', label: 'Ridge Credit Union (sample)' },
  { value: 'closed', label: 'Old Quay Bank (sample)', disabled: true },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  args: { label: 'Your bank', name: 'bank', options: banks, placeholder: 'Choose a bank' },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'We show the USSD code that matches your bank.', required: true } };

export const Error: Story = {
  args: { required: true, error: 'Choose a bank' },
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByLabelText(/Your bank/);
    await expect(select).toHaveAttribute('aria-invalid', 'true');
    await expect(select).toHaveAccessibleDescription('Error: Choose a bank');
  },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 'harbour' } };

export const ChoosingAnOption: Story = {
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByLabelText('Your bank');
    await userEvent.tab();
    await expect(select).toHaveFocus();
    await userEvent.selectOptions(select, 'meridian');
    await expect(select).toHaveValue('meridian');
  },
};
