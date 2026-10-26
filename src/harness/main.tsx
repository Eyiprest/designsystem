/**
 * Dev-only page used by scripts/keyboard-checks.mjs. Each demo is the bare component with no play
 * function, so real keyboard events hit the same markup a user would get. Open /harness.html?c=dialog etc.
 * Not part of the production build (vite build uses index.html only).
 */
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.css';
import {
  Accordion, AccordionItem, Alert, Button, Checkbox, DataTable, Dialog, DialogActions, Form, NavigationMenu, Radio, RadioGroup,
  Select, SkipLink, Switch, Tab, TabList, TabPanel, Tabs, TextInput, ToastHost, showToast,
} from '../index';
import type { FormErrors, FormValues } from '../index';

function ButtonDemo() {
  const [n, setN] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button onClick={() => setN((v) => v + 1)}>Count</Button>
      <Button disabled>Disabled</Button>
      <Button variant="secondary">After disabled</Button>
      <output data-testid="count">{n}</output>
    </div>
  );
}

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <p><a href="#behind">Link behind</a></p>
      <Dialog isOpen={open} onOpenChange={setOpen} title="Edit details">
        {({ close }) => (
          <>
            <TextInput label="Nickname" name="nick" />
            <DialogActions>
              <Button variant="secondary" onClick={close}>Cancel</Button>
              <Button onClick={close}>Save</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

const validate = (v: FormValues): FormErrors => {
  const e: FormErrors = {};
  if (!String(v.fullName ?? '').trim()) e.fullName = 'Enter your full name';
  if (!String(v.email ?? '').trim()) e.email = 'Enter your email address';
  return e;
};

const rows = [
  { id: 'a', item: 'Pour-over set', qty: 1, amount: 18500 },
  { id: 'b', item: 'Apron', qty: 2, amount: 12000 },
  { id: 'c', item: 'Notebook', qty: 1, amount: 3200 },
];

const demos: Record<string, () => React.ReactElement> = {
  button: ButtonDemo,
  textinput: () => <TextInput label="Full name" name="fullName" autoComplete="name" hint="As on your ID" />,
  select: () => (
    <Select label="Bank" name="bank" placeholder="Choose" options={[{ value: 'harbour', label: 'Harbour' }, { value: 'meridian', label: 'Meridian' }, { value: 'ridge', label: 'Ridge' }]} />
  ),
  radios: () => (
    <>
      <button>Before</button>
      <RadioGroup legend="Method" name="m">
        <Radio value="bank" label="Bank" /><Radio value="ussd" label="USSD" /><Radio value="cash" label="Cash" />
      </RadioGroup>
      <button>After</button>
    </>
  ),
  checkbox: () => <Checkbox name="r" label="Email me a receipt" />,
  switch: () => <Switch>Email receipts</Switch>,
  dialog: DialogDemo,
  tabs: () => (
    <Tabs aria-label="Instructions">
      <TabList aria-label="Instructions"><Tab id="a">Bank</Tab><Tab id="b">USSD</Tab><Tab id="c">Cash</Tab></TabList>
      <TabPanel id="a"><a href="#x">Link in bank panel</a></TabPanel><TabPanel id="b">USSD panel</TabPanel><TabPanel id="c">Cash panel</TabPanel>
    </Tabs>
  ),
  toast: () => (
    <>
      <Button onClick={() => showToast({ title: 'Receipt sent', variant: 'success' })}>Send receipt</Button>
      <ToastHost />
    </>
  ),
  alert: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Alert variant="error" title="Could not place order">Try again.</Alert>
      <Alert variant="warning" title="Expires soon">24 hours.</Alert>
    </div>
  ),
  form: () => (
    <Form validate={validate} onSubmit={() => undefined} aria-label="Contact">
      <TextInput label="Full name" name="fullName" required />
      <TextInput label="Email address" name="email" type="email" required />
      <Button type="submit">Continue</Button>
    </Form>
  ),
  table: () => (
    <DataTable caption="Orders" getRowId={(r) => r.id} rows={rows}
      columns={[{ key: 'item', header: 'Item', isRowHeader: true, sortable: true }, { key: 'qty', header: 'Qty', align: 'end', sortable: true }, { key: 'amount', header: 'Amount', align: 'end', sortable: true }]} />
  ),
  nav: () => (
    <>
      <SkipLink href="#main" />
      <header><NavigationMenu label="Main" items={[{ href: '#shop', label: 'Shop' }, { href: '#checkout', label: 'Checkout', current: true }, { href: '#help', label: 'Help' }]} /></header>
      <main id="main" tabIndex={-1}><h1>Main content</h1><button>First button in main</button></main>
    </>
  ),
  accordion: () => (
    <Accordion>
      <AccordionItem id="one" title="First question">First answer</AccordionItem>
      <AccordionItem id="two" title="Second question">Second answer</AccordionItem>
    </Accordion>
  ),
};

const which = new URLSearchParams(location.search).get('c') ?? 'button';
const Demo = demos[which];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ padding: 16 }}>{Demo ? <Demo /> : <p>Unknown component: {which}</p>}</div>
  </StrictMode>,
);
