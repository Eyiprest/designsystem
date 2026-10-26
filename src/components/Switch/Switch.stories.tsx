import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { children: 'Email receipts', onChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = { args: { defaultSelected: true } };

export const Disabled: Story = { args: { isDisabled: true } };

export const DisabledOn: Story = { args: { isDisabled: true, defaultSelected: true } };

export const Toggling: Story = {
  play: async ({ canvasElement, args }) => {
    const toggle = within(canvasElement).getByRole('switch', { name: 'Email receipts' });
    await expect(toggle).not.toBeChecked();
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(toggle).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
  },
};
