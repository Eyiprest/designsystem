import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion, AccordionItem } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: { children: null },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Accordion {...args}>
        <AccordionItem id="bank" title="How do I pay by bank transfer?">
          Send the exact total to the sample account on your order. Use the order number as the reference.
        </AccordionItem>
        <AccordionItem id="ussd" title="How do I pay with USSD?">
          Dial the sample code for your bank. The code includes your order amount.
        </AccordionItem>
        <AccordionItem id="cash" title="Where can I pay with cash?">
          Use any of the sample pickup points listed on the order page.
        </AccordionItem>
      </Accordion>
    </div>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bank = canvas.getByRole('button', { name: 'How do I pay by bank transfer?' });
    const ussd = canvas.getByRole('button', { name: 'How do I pay with USSD?' });

    // Starts collapsed, state exposed, controlled panel linked.
    await expect(bank).toHaveAttribute('aria-expanded', 'false');
    await expect(bank).toHaveAttribute('aria-controls', 'bank-panel');
    await expect(canvas.queryByText(/exact total/)).not.toBeVisible();

    // Each header is its own tab stop. Enter and Space both work.
    await userEvent.tab();
    await expect(bank).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(bank).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/exact total/)).toBeVisible();

    await userEvent.tab();
    await expect(ussd).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(ussd).toHaveAttribute('aria-expanded', 'true');
    // Single mode: opening one closes the other.
    await expect(bank).toHaveAttribute('aria-expanded', 'false');
  },
};

export const AllowMultiple: Story = {
  args: { allowMultiple: true, defaultOpen: ['bank'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bank = canvas.getByRole('button', { name: 'How do I pay by bank transfer?' });
    const cash = canvas.getByRole('button', { name: 'Where can I pay with cash?' });
    await expect(bank).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(cash);
    await expect(bank).toHaveAttribute('aria-expanded', 'true');
    await expect(cash).toHaveAttribute('aria-expanded', 'true');
  },
};

export const HeadingLevels: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Payment questions</h2>
      <Accordion>
        <AccordionItem id="q1" title="Is this a real payment?" headingLevel={3}>No. Everything here is sample data.</AccordionItem>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { level: 3, name: 'Is this a real payment?' })).toBeInTheDocument();
  },
};
