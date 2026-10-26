import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';

interface Order {
  id: string;
  item: string;
  quantity: number;
  amount: number;
  status: string;
}

const rows: Order[] = [
  { id: 'SO-1003', item: 'Ceramic pour-over set', quantity: 1, amount: 18500, status: 'Awaiting payment' },
  { id: 'SO-1001', item: 'Linen apron', quantity: 2, amount: 12000, status: 'Paid (sample)' },
  { id: 'SO-1002', item: 'Hand-bound notebook', quantity: 3, amount: 9600, status: 'Paid (sample)' },
];

const money = (n: number) => `₦${n.toLocaleString('en-NG')}`;

const columns: Column<Order>[] = [
  { key: 'id', header: 'Order', isRowHeader: true, sortable: true },
  { key: 'item', header: 'Item', sortable: true },
  { key: 'quantity', header: 'Qty', align: 'end', sortable: true },
  { key: 'amount', header: 'Amount', align: 'end', sortable: true, render: (r) => money(r.amount) },
  { key: 'status', header: 'Status' },
];

const meta = {
  title: 'Components/Data table',
  component: DataTable<Order>,
  args: { caption: 'Sample orders', columns, rows, getRowId: (r: Order) => r.id },
} satisfies Meta<typeof DataTable<Order>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table', { name: 'Sample orders' });
    // Column headers and row headers are programmatically linked to cells.
    await expect(within(table).getAllByRole('columnheader')).toHaveLength(5);
    await expect(within(table).getAllByRole('rowheader').map((c) => c.textContent)).toEqual(['SO-1003', 'SO-1001', 'SO-1002']);
  },
};

export const Sorting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const orderSort = canvas.getByRole('button', { name: 'Order' });

    await userEvent.tab(); // scrollable region comes first
    await userEvent.tab();
    await expect(orderSort).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('columnheader', { name: 'Order' })).toHaveAttribute('aria-sort', 'ascending');
    await expect(canvas.getAllByRole('rowheader').map((c) => c.textContent)).toEqual(['SO-1001', 'SO-1002', 'SO-1003']);
    await expect(canvas.getByRole('status')).toHaveTextContent('Sorted by Order, ascending.');

    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('columnheader', { name: 'Order' })).toHaveAttribute('aria-sort', 'descending');
    await expect(canvas.getByRole('status')).toHaveTextContent('Sorted by Order, descending.');

    // Numbers sort as numbers, not text.
    await userEvent.click(canvas.getByRole('button', { name: 'Amount' }));
    await expect(canvas.getAllByRole('rowheader').map((c) => c.textContent)).toEqual(['SO-1002', 'SO-1001', 'SO-1003']);
  },
};

export const InitiallySorted: Story = {
  args: { defaultSort: { key: 'amount', direction: 'descending' } },
};

export const Empty: Story = {
  args: { rows: [], emptyMessage: 'No sample orders yet.' },
};

export const NarrowContainer: Story = {
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
  play: async ({ canvasElement }) => {
    // The table scrolls inside its own region. The page itself must not scroll sideways.
    const region = within(canvasElement).getByRole('region', { name: 'Sample orders' });
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    await expect(region).toHaveAttribute('tabindex', '0');
  },
};
