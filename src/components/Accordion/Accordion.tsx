import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import './Accordion.css';

interface AccordionContextValue {
  openIds: ReadonlySet<string>;
  toggle: (id: string) => void;
}
const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  /** Ids of items open on first render. */
  defaultOpen?: string[];
  /** Allow several items open at once. Default: opening one closes the others. */
  allowMultiple?: boolean;
  children: ReactNode;
}

/**
 * Each item is a heading containing a native `<button aria-expanded aria-controls>`, followed by a
 * panel. Enter and Space work because it is a real button, and every header is its own Tab stop.
 * Closed panels use the `hidden` attribute, which removes them from the accessibility tree and the tab order.
 */
export function Accordion({ defaultOpen = [], allowMultiple = false, children }: AccordionProps) {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set(defaultOpen));
  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(allowMultiple ? current : []);
      if (current.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return (
    <AccordionContext.Provider value={{ openIds, toggle }}>
      <div className="steady-accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  /** Stable, unique within the accordion. Also used to build the DOM ids that link button and panel. */
  id: string;
  title: string;
  /** Heading level for the title. Pick the level that fits the page outline. Default 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
}

export function AccordionItem({ id, title, headingLevel = 3, children }: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('<AccordionItem> must be used inside <Accordion>.');
  const isOpen = ctx.openIds.has(id);
  const Heading = `h${headingLevel}` as const;
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <div className="steady-accordion__item">
      <Heading className="steady-accordion__heading">
        <button
          type="button"
          id={buttonId}
          className="steady-accordion__button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => ctx.toggle(id)}
        >
          <span>{title}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="steady-accordion__chevron">
            <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </Heading>
      <div id={panelId} hidden={!isOpen} className="steady-accordion__panel">
        {children}
      </div>
    </div>
  );
}
