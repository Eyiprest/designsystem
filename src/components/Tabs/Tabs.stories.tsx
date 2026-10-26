import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { 'aria-label': 'Payment instructions' },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Payment instructions">
        <Tab id="bank">Bank transfer</Tab>
        <Tab id="ussd">USSD</Tab>
        <Tab id="cash">Cash</Tab>
      </TabList>
      <TabPanel id="bank">Send the exact amount to the sample account shown on the order.</TabPanel>
      <TabPanel id="ussd">Dial the sample code on your phone and follow the prompts.</TabPanel>
      <TabPanel id="cash">Pay at a sample pickup point and show your order number.</TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bank = canvas.getByRole('tab', { name: 'Bank transfer' });
    const ussd = canvas.getByRole('tab', { name: 'USSD' });
    const cash = canvas.getByRole('tab', { name: 'Cash' });

    // Roles and relationships.
    await expect(canvas.getByRole('tablist')).toBeInTheDocument();
    await expect(bank).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveAccessibleName('Bank transfer');

    // Tab lands on the selected tab only (roving tabindex), arrows move and select.
    await userEvent.tab();
    await expect(bank).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(ussd).toHaveFocus();
    await expect(ussd).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveAccessibleName('USSD');

    await userEvent.keyboard('{End}');
    await expect(cash).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}'); // wraps
    await expect(bank).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(bank).toHaveFocus();
  },
};

export const ManualActivation: Story = {
  render: (args) => (
    <Tabs {...args} keyboardActivation="manual">
      <TabList aria-label="Payment instructions">
        <Tab id="bank">Bank transfer</Tab>
        <Tab id="ussd">USSD</Tab>
      </TabList>
      <TabPanel id="bank">Bank panel</TabPanel>
      <TabPanel id="ussd">USSD panel</TabPanel>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ussd = canvas.getByRole('tab', { name: 'USSD' });
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    // Focus moved, selection did not.
    await expect(ussd).toHaveFocus();
    await expect(ussd).toHaveAttribute('aria-selected', 'false');
    await userEvent.keyboard('{Enter}');
    await expect(ussd).toHaveAttribute('aria-selected', 'true');
  },
};

export const DisabledTab: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Payment instructions">
        <Tab id="bank">Bank transfer</Tab>
        <Tab id="ussd" isDisabled>USSD</Tab>
        <Tab id="cash">Cash</Tab>
      </TabList>
      <TabPanel id="bank">Bank panel</TabPanel>
      <TabPanel id="ussd">USSD panel</TabPanel>
      <TabPanel id="cash">Cash panel</TabPanel>
    </Tabs>
  ),
};
