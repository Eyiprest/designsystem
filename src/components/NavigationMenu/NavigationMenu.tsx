import type { ReactNode } from 'react';
import './NavigationMenu.css';

export interface NavItem {
  href: string;
  label: ReactNode;
  /** Marks the link for the page the user is on. */
  current?: boolean;
}

export interface NavigationMenuProps {
  /** Accessible name of the landmark, for example "Main". Needed when a page has more than one nav. */
  label: string;
  items: NavItem[];
  className?: string;
}

/**
 * A `<nav>` landmark containing a plain list of links. There is no `role="menu"`: that role
 * promises application-style arrow-key behaviour that site navigation does not have, and it
 * changes how screen readers handle the keyboard. Tab moves between links, which is what
 * people expect.
 *
 * The current page is marked with `aria-current="page"`, and visually with a bar and bold text.
 * Links wrap onto new lines on narrow screens, so there is nothing to collapse and nothing hidden.
 */
export function NavigationMenu({ label, items, className }: NavigationMenuProps) {
  return (
    <nav aria-label={label} className={['steady-nav', className].filter(Boolean).join(' ')}>
      <ul className="steady-nav__list">
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="steady-nav__link" aria-current={item.current ? 'page' : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export interface SkipLinkProps {
  /** Id of the element to skip to, with a leading #. That element needs `tabIndex={-1}`. */
  href?: string;
  children?: ReactNode;
}

/**
 * First focusable element on the page. Hidden until it receives keyboard focus, then shown at the top
 * left, above everything else, so it is never covered (WCAG 2.4.1, 2.4.11).
 */
export function SkipLink({ href = '#main', children = 'Skip to main content' }: SkipLinkProps) {
  return (
    <a href={href} className="steady-skip-link">
      {children}
    </a>
  );
}
