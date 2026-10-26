import { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Alert,
  Button,
  Checkbox,
  DataTable,
  Form,
  NavigationMenu,
  Radio,
  RadioGroup,
  Select,
  SkipLink,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextInput,
  showToast,
} from '../index';
import type { FormErrors, FormValues } from '../index';
import {
  banks,
  deliveryFee,
  formatMoney,
  lineItems,
  methodLabels,
  orderNumber,
  pickupPoints,
  sampleAccount,
  subtotal,
  total,
  ussdCodeFor,
} from './data';
import type { LineItem, PaymentMethod } from './data';
import './checkout.css';

const BASE_TITLE = 'Checkout (demonstration) | Steady';

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const text = (key: string) => String(values[key] ?? '').trim();

  if (!text('fullName')) errors.fullName = 'Enter your full name';

  if (!text('email')) errors.email = 'Enter your email address';
  else if (!/^\S+@\S+\.\S+$/.test(text('email'))) errors.email = 'Enter an email address in the correct format, like ada@example.com';

  const phone = text('phone').replace(/[\s()-]/g, '');
  if (!phone) errors.phone = 'Enter a phone number';
  else if (!/^\+?\d{7,15}$/.test(phone)) errors.phone = 'Enter a phone number with 7 to 15 digits, like 0800 000 0000';

  const method = text('method');
  if (!method) errors.method = 'Choose a payment method';
  if ((method === 'bank' || method === 'ussd') && !text('bank')) errors.bank = 'Choose your bank';
  if (method === 'cash' && !text('pickup')) errors.pickup = 'Choose a pickup point';

  return errors;
}

const itemColumns = [
  { key: 'name', header: 'Item', isRowHeader: true },
  { key: 'quantity', header: 'Qty', align: 'end' as const },
  { key: 'lineTotal', header: 'Amount', align: 'end' as const, render: (r: LineItem) => formatMoney(r.quantity * r.unitPrice) },
];

function OrderSummary() {
  return (
    <section aria-labelledby="summary-heading" id="summary" className="checkout__summary">
      <h2 id="summary-heading" className="checkout__h2">Order summary</h2>
      <DataTable caption="Items in this sample order" columns={itemColumns} rows={lineItems} getRowId={(r) => r.id} />
      <dl className="checkout__totals">
        <div><dt>Subtotal</dt><dd>{formatMoney(subtotal)}</dd></div>
        <div><dt>Delivery (sample)</dt><dd>{formatMoney(deliveryFee)}</dd></div>
        <div className="checkout__total"><dt>Total</dt><dd>{formatMoney(total)}</dd></div>
      </dl>
    </section>
  );
}

function Instructions({ method, bank, pickup }: { method: PaymentMethod; bank: string; pickup: string }) {
  const bankLabel = banks.find((b) => b.value === bank)?.label;
  const pickupLabel = pickupPoints.find((p) => p.value === pickup)?.label;

  if (method === 'bank') {
    return (
      <dl className="checkout__details">
        <div><dt>Bank</dt><dd>{sampleAccount.bank}</dd></div>
        <div><dt>Account name</dt><dd>{sampleAccount.name}</dd></div>
        <div><dt>Account number</dt><dd>{sampleAccount.number}</dd></div>
        <div><dt>Amount</dt><dd>{formatMoney(total)}</dd></div>
        <div><dt>Reference</dt><dd>{orderNumber}</dd></div>
        {bankLabel ? <div><dt>Sending from</dt><dd>{bankLabel}</dd></div> : null}
      </dl>
    );
  }
  if (method === 'ussd') {
    return (
      <>
        <p>On your phone, dial this sample code{bankLabel ? ` for ${bankLabel}` : ''}, then follow the prompts:</p>
        <p className="checkout__code"><code>{ussdCodeFor(bank)}</code></p>
        <p className="checkout__muted">This code is made up. It does not work on any network.</p>
      </>
    );
  }
  return (
    <>
      <p>Take {formatMoney(total)} and your order number <strong>{orderNumber}</strong> to:</p>
      <p><strong>{pickupLabel ?? 'your chosen pickup point'}</strong></p>
      <p className="checkout__muted">These pickup points are made up.</p>
    </>
  );
}

const stepsFor: Record<PaymentMethod, string[]> = {
  bank: ['Open your banking app.', 'Send the exact amount to the sample account.', `Use ${orderNumber} as the reference.`],
  ussd: ['Dial the sample code.', 'Confirm the amount shown.', 'Keep the confirmation message.'],
  cash: ['Go to your pickup point.', 'Show your order number.', 'Pay the exact amount and keep your receipt.'],
};

export function Checkout() {
  const [method, setMethod] = useState<PaymentMethod | undefined>();
  const [announcement, setAnnouncement] = useState('');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [placed, setPlaced] = useState<null | { method: PaymentMethod; bank: string; pickup: string; email: string; receipt: boolean }>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);

  // Put "Error:" first in the page title while the form has errors, and restore it after.
  const handleValidationChange = (errors: FormErrors) => {
    document.title = Object.keys(errors).length > 0 ? `Error: ${BASE_TITLE}` : BASE_TITLE;
  };
  useEffect(() => {
    document.title = BASE_TITLE;
  }, []);

  // After the form is replaced by the confirmation view, move focus to its heading.
  useEffect(() => {
    if (placed) confirmationRef.current?.focus();
  }, [placed]);

  const onMethodChange = (value: string) => {
    const next = value as PaymentMethod;
    setMethod(next);
    setAnnouncement(`${methodLabels[next]} selected. Instructions are shown below the payment methods.`);
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitError(false);
    // Stand-in for a network request. Nothing leaves the browser.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    if (simulateFailure) {
      setSubmitError(true);
      return;
    }
    const chosen = String(values.method) as PaymentMethod;
    const receipt = values.receipt === 'yes';
    setPlaced({ method: chosen, bank: String(values.bank ?? ''), pickup: String(values.pickup ?? ''), email: String(values.email), receipt });
    document.title = `Sample order placed | Steady`;
    if (receipt) showToast({ title: 'Sample receipt "sent"', description: `Nothing was emailed to ${String(values.email)}.`, variant: 'success' });
  };

  const reset = () => {
    setPlaced(null);
    setMethod(undefined);
    setAnnouncement('');
    setSubmitError(false);
    document.title = BASE_TITLE;
  };

  return (
    <>
      <SkipLink href="#main" />
      <header className="checkout__header">
        <p className="checkout__brand">Sample Shop</p>
        <NavigationMenu
          label="On this page"
          items={[
            { href: '#payment', label: 'Payment', current: !placed },
            { href: '#summary', label: 'Order summary' },
            { href: '#help', label: 'Help' },
          ]}
        />
      </header>

      <main id="main" tabIndex={-1} className="checkout">
        <Alert variant="info" live={false} title="This is a demonstration">
          Everything on this page is sample data. No money moves and nothing is sent.
        </Alert>

        {placed ? (
          <div className="checkout__grid">
            <section aria-labelledby="done-heading" className="checkout__panel">
              <h1 id="done-heading" ref={confirmationRef} tabIndex={-1} className="checkout__h1">Sample order created</h1>
              <p>
                Order <strong>{orderNumber}</strong> is <strong>awaiting payment (sample)</strong>. No payment has been
                taken, because this page cannot take payments.
              </p>
              <Tabs aria-label="After you order" defaultSelectedKey="how">
                <TabList aria-label="After you order">
                  <Tab id="how">How to pay</Tab>
                  <Tab id="details">{methodLabels[placed.method]} details</Tab>
                </TabList>
                <TabPanel id="how">
                  <ol className="checkout__steps">
                    {stepsFor[placed.method].map((s) => <li key={s}>{s}</li>)}
                  </ol>
                </TabPanel>
                <TabPanel id="details">
                  <Instructions method={placed.method} bank={placed.bank} pickup={placed.pickup} />
                </TabPanel>
              </Tabs>
              <div><Button variant="secondary" onClick={reset}>Start again</Button></div>
            </section>
            <OrderSummary />
          </div>
        ) : (
          <div className="checkout__grid">
            <section aria-labelledby="payment-heading" id="payment" className="checkout__panel">
              <h1 id="payment-heading" className="checkout__h1">Checkout</h1>

              {submitError ? (
                <Alert variant="error" title="We could not place the order">
                  The sample service did not respond. Your details are still here. Try again.
                </Alert>
              ) : null}

              <Form aria-label="Contact and payment" validate={validate} onSubmit={onSubmit} onValidationChange={handleValidationChange}>
                {({ isSubmitting }) => (
                  <>
                    <fieldset className="checkout__section">
                      <legend className="checkout__h2">Your details</legend>
                      <TextInput label="Full name" name="fullName" autoComplete="name" required />
                      <TextInput label="Email address" name="email" type="email" autoComplete="email" required hint="For example, ada@example.com" />
                      <TextInput label="Phone number" name="phone" type="tel" autoComplete="tel" required hint="Used only for the sample reminder." />
                    </fieldset>

                    <fieldset className="checkout__section">
                      <legend className="checkout__h2">Payment</legend>
                      <RadioGroup legend="Payment method" name="method" required value={method} onValueChange={onMethodChange}>
                        <Radio value="bank" label="Bank transfer" hint="Send money from your banking app." />
                        <Radio value="ussd" label="USSD" hint="Dial a short code. Works on any phone." />
                        <Radio value="cash" label="Pay with cash" hint="Pay at a pickup point." />
                      </RadioGroup>

                      {(method === 'bank' || method === 'ussd') && (
                        <Select
                          key="bank"
                          label="Your bank"
                          name="bank"
                          required
                          placeholder="Choose your bank"
                          options={banks.map(({ value, label }) => ({ value, label }))}
                        />
                      )}
                      {method === 'cash' && (
                        <Select key="pickup" label="Pickup point" name="pickup" required placeholder="Choose a pickup point" options={pickupPoints} />
                      )}

                      {/* Always present so a change is announced. Empty until a method is chosen. */}
                      <div role="status" className="steady-vh">{announcement}</div>

                      {method ? (
                        <div className="checkout__instructions">
                          <h2 className="checkout__h3">{methodLabels[method]}: what happens next</h2>
                          <Instructions method={method} bank="" pickup="" />
                        </div>
                      ) : null}
                    </fieldset>

                    <Checkbox name="receipt" value="yes" label="Send me a sample receipt" hint="Nothing is actually emailed." defaultChecked />

                    <div role="group" aria-labelledby="demo-controls-heading" className="checkout__section checkout__demo-controls">
                      <h2 id="demo-controls-heading" className="checkout__h3">Demonstration controls</h2>
                      <Switch isSelected={simulateFailure} onChange={setSimulateFailure}>Simulate a failed order</Switch>
                    </div>

                    <div>
                      <Button type="submit" size="lg" isLoading={isSubmitting} loadingLabel="Placing sample order">
                        Place sample order
                      </Button>
                    </div>
                  </>
                )}
              </Form>
            </section>

            <OrderSummary />
          </div>
        )}

        <section aria-labelledby="help-heading" id="help" className="checkout__help">
          <h2 id="help-heading" className="checkout__h2">Questions about paying</h2>
          <Accordion>
            <AccordionItem id="help-real" title="Is any of this real?">
              No. The shop, products, prices, bank, account number, USSD code and pickup points are all made up.
            </AccordionItem>
            <AccordionItem id="help-methods" title="Why three payment methods?">
              The page shows how one set of components handles three different sets of instructions.
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </>
  );
}
