/**
 * Sample data for the checkout demonstration. Everything here is invented.
 * The bank names, account number, USSD code and pickup points do not exist.
 */

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export const lineItems: LineItem[] = [
  { id: 'pour-over', name: 'Ceramic pour-over set', quantity: 1, unitPrice: 18500 },
  { id: 'apron', name: 'Linen apron', quantity: 2, unitPrice: 6000 },
  { id: 'notebook', name: 'Hand-bound notebook', quantity: 1, unitPrice: 3200 },
];

export const deliveryFee = 1500;
export const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
export const total = subtotal + deliveryFee;

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });
export const formatMoney = (amount: number) => naira.format(amount);

export const orderNumber = 'SO-1042';

export const banks = [
  { value: 'harbour', label: 'Harbour Bank (sample)', ussdPrefix: '*000*11' },
  { value: 'meridian', label: 'Meridian Savings (sample)', ussdPrefix: '*000*22' },
  { value: 'ridge', label: 'Ridge Credit Union (sample)', ussdPrefix: '*000*33' },
];

export const pickupPoints = [
  { value: 'point-a', label: 'Sample Point A, 1 Example Street' },
  { value: 'point-b', label: 'Sample Point B, 2 Example Avenue' },
];

export const sampleAccount = {
  bank: 'Sample Settlement Bank',
  name: 'SAMPLE SHOP LTD (DEMO)',
  number: '0000000000',
};

/** Builds a made-up USSD string such as *000*11*SO1042*35200#. It does not work on any network. */
export function ussdCodeFor(bankValue: string): string {
  const bank = banks.find((b) => b.value === bankValue) ?? banks[0]!;
  return `${bank.ussdPrefix}*${orderNumber.replace('-', '')}*${total}#`;
}

export type PaymentMethod = 'bank' | 'ussd' | 'cash';

export const methodLabels: Record<PaymentMethod, string> = {
  bank: 'Bank transfer',
  ussd: 'USSD',
  cash: 'Pay with cash',
};
