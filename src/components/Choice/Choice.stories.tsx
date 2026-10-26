import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from './Choice';

const meta = {
  title: 'Components/Checkbox and radio group',
  component: RadioGroup,
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const methodRadios = (
  <>
    <Radio value="bank" label="Bank transfer" hint="Send money from your banking app." />
    <Radio value="ussd" label="USSD" hint="Dial a short code on any phone." />
    <Radio value="cash" label="Pay with cash" />
  </>
);

export const Radios: Story = {
  args: { legend: 'Payment method', name: 'method', children: methodRadios },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bank = canvas.getByRole('radio', { name: 'Bank transfer' });
    const ussd = canvas.getByRole('radio', { name: 'USSD' });
    // The group is named by its legend.
    await expect(canvas.getByRole('group', { name: 'Payment method' })).toBeInTheDocument();
    await userEvent.click(bank);
    await expect(bank).toBeChecked();
    // Arrow keys move the selection inside the group.
    await userEvent.keyboard('{ArrowDown}');
    await expect(ussd).toBeChecked();
    await expect(bank).not.toBeChecked();
  },
};

export const RadiosWithError: Story = {
  args: { legend: 'Payment method', name: 'method', required: true, error: 'Choose a payment method', children: methodRadios },
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: /Payment method/ });
    await expect(group).toHaveAccessibleDescription('Error: Choose a payment method');
  },
};

export const RadiosDisabledOption: Story = {
  args: {
    legend: 'Delivery',
    name: 'delivery',
    defaultValue: 'standard',
    children: (
      <>
        <Radio value="standard" label="Standard (3 to 5 days)" />
        <Radio value="express" label="Express" disabled hint="Not available for this order." />
      </>
    ),
  },
};

export const SingleCheckbox: StoryObj<typeof Checkbox> = {
  render: () => <Checkbox name="receipt" label="Email me a receipt" hint="Sent to the address you entered above." />,
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox', { name: 'Email me a receipt' });
    await expect(box).not.toBeChecked();
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(box).toBeChecked();
  },
};

export const CheckboxGroupStory: StoryObj<typeof CheckboxGroup> = {
  name: 'Checkbox group',
  render: () => (
    <CheckboxGroup legend="Send me reminders by" hint="Choose all that apply.">
      <Checkbox name="remind" value="sms" label="Text message" />
      <Checkbox name="remind" value="email" label="Email" defaultChecked />
      <Checkbox name="remind" value="none" label="Phone call" disabled />
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Send me reminders by' })).toBeInTheDocument();
    await expect(canvas.getByRole('checkbox', { name: 'Email' })).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: 'Phone call' })).toBeDisabled();
  },
};

export const CheckboxGroupWithError: StoryObj<typeof CheckboxGroup> = {
  render: () => (
    <CheckboxGroup legend="Send me reminders by" required error="Choose at least one way to be reminded">
      <Checkbox name="remind" value="sms" label="Text message" />
      <Checkbox name="remind" value="email" label="Email" />
    </CheckboxGroup>
  ),
};
