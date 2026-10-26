import { Tab as AriaTab, TabList as AriaTabList, TabPanel as AriaTabPanel, Tabs as AriaTabs } from 'react-aria-components';
import type { TabListProps, TabPanelProps, TabProps, TabsProps } from 'react-aria-components';
import './Tabs.css';

/**
 * Tabs on React Aria. It provides role="tablist" / "tab" / "tabpanel", aria-selected,
 * aria-controls, a roving tabindex (Tab enters the list once), Arrow keys, Home and End,
 * and hides inactive panels.
 *
 * `keyboardActivation` defaults to "automatic": moving to a tab with the arrow keys selects it.
 * Use "manual" (Enter or Space to select) when a panel is slow to render.
 */
export function Tabs(props: Omit<TabsProps, 'className'>) {
  return <AriaTabs {...props} className="steady-tabs" />;
}

export function TabList<T extends object>(props: Omit<TabListProps<T>, 'className'>) {
  return <AriaTabList {...props} className="steady-tablist" />;
}

export function Tab(props: Omit<TabProps, 'className'>) {
  return <AriaTab {...props} className="steady-tab" />;
}

export function TabPanel(props: Omit<TabPanelProps, 'className'>) {
  return <AriaTabPanel {...props} className="steady-tabpanel" />;
}
