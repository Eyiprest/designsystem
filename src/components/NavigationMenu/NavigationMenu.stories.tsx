import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { NavigationMenu, SkipLink } from './NavigationMenu';

const items = [
  { href: '#shop', label: 'Shop' },
  { href: '#checkout', label: 'Checkout', current: true },
  { href: '#orders', label: 'Orders' },
  { href: '#help', label: 'Help' },
];

const meta = {
  title: 'Components/Navigation menu',
  component: NavigationMenu,
  args: { label: 'Main', items },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await expect(within(nav).getAllByRole('link')).toHaveLength(4);
    await expect(canvas.getByRole('link', { name: 'Checkout' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: 'Shop' })).not.toHaveAttribute('aria-current');

    // Plain links: Tab moves through them in order, one stop each.
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Shop' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Checkout' })).toHaveFocus();
  },
};

export const WithSkipLink: Story = {
  render: (args) => (
    <>
      <SkipLink href="#main" />
      <header>
        <NavigationMenu {...args} />
      </header>
      <main id="main" tabIndex={-1}>
        <h1 style={{ fontSize: 24 }}>Page content</h1>
        <p>Press Tab once to reveal the skip link.</p>
      </main>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The skip link is the first stop and becomes visible on focus.
    await userEvent.tab();
    const skip = canvas.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toHaveFocus();
    const box = skip.getBoundingClientRect();
    await expect(box.top).toBeGreaterThanOrEqual(0);
    await expect(box.left).toBeGreaterThanOrEqual(0);
    // Activating the link is not tested here: pressing Enter moves the test iframe to a new URL and closes
    // Vitest's browser connection. Activation is covered by scripts/keyboard-checks.mjs, which uses real navigation.
    await expect(skip).toHaveAttribute('href', '#main');
    await expect(canvas.getByRole('main')).toHaveAttribute('id', 'main');
    await expect(canvas.getByRole('main')).toHaveAttribute('tabindex', '-1');
  },
};

export const NarrowScreen: Story = {
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
  play: async ({ canvasElement }) => {
    // Links wrap: nothing is clipped and the page does not need to scroll sideways.
    const nav = within(canvasElement).getByRole('navigation', { name: 'Main' });
    await expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth);
  },
};
