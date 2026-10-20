export type Terms = {
  artistSlug: string;
  artistName: string;
  artistLegalName: string;
  artistEmail: string;
  artistAddress: string;
  artistCapacity: string;
  mclivLegalName: string;
  mclivAddress: string;
  title: string;
  description: string;
  orderId: string;
  lineId: string;
  saleDate: string;
  artworkCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  deductionCents: number;
  deductionReason: string;
  dueDate: string;
  agreement: string;
  method: 'ach' | 'stripe';
  payoutUrl: string;
  feeTerms: string;
};

export const CONSENT =
  'I consent to use electronic records and signatures for this agreement. I have reviewed the full agreement and sale statement, can download and retain a copy, and intend my typed legal name to be my signature. I may request a correction or assisted signing without forfeiting any payment owed.';

export function dollars(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function cents(value: string): number {
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(value))
    throw new Error(
      'Enter a positive USD amount with at most two decimal places.',
    );
  const [whole, part = ''] = value.split('.');
  return Number(whole) * 100 + Number(part.padEnd(2, '0'));
}

export function totals(t: Pick<Terms, 'artworkCents' | 'deductionCents'>) {
  const commission = Math.round((t.artworkCents * 20) / 100);
  return {commission, artist: t.artworkCents - commission - t.deductionCents};
}

export function validateTerms(t: Terms) {
  const required: (keyof Terms)[] = [
    'artistSlug',
    'artistName',
    'artistLegalName',
    'artistEmail',
    'artistAddress',
    'artistCapacity',
    'mclivLegalName',
    'mclivAddress',
    'title',
    'description',
    'orderId',
    'lineId',
    'saleDate',
    'dueDate',
    'agreement',
    'payoutUrl',
    'feeTerms',
  ];
  for (const key of required)
    if (typeof t[key] !== 'string' || !String(t[key]).trim())
      throw new Error(`Complete ${key} before approving this agreement.`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.artistEmail))
    throw new Error('Enter the verified artist email.');
  if (
    !/^gid:\/\/shopify\/Order\/[1-9]\d*$/.test(t.orderId) ||
    !/^gid:\/\/shopify\/LineItem\/[1-9]\d*$/.test(t.lineId)
  )
    throw new Error(
      'Use the canonical Shopify Order and LineItem IDs (gid://shopify/Order/… and gid://shopify/LineItem/…).',
    );
  for (const amount of [
    t.artworkCents,
    t.taxCents,
    t.shippingCents,
    t.totalCents,
    t.deductionCents,
  ]) {
    if (!Number.isSafeInteger(amount) || amount < 0 || amount > 999999999)
      throw new Error('Invalid USD amount.');
  }
  if (
    !t.artworkCents ||
    t.artworkCents + t.taxCents + t.shippingCents !== t.totalCents
  )
    throw new Error(
      'The line total must equal artwork after discounts, allocated tax, and allocated shipping. Do not use the full order total for a multi-work order.',
    );
  if (totals(t).artist < 0 || (t.deductionCents && !t.deductionReason.trim()))
    throw new Error('Explain each agreed deduction and check the amount.');
  for (const date of [t.saleDate, t.dueDate])
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      new Date(date).toISOString().slice(0, 10) !== date
    )
      throw new Error('Enter a valid sale date and payment deadline.');
  if (!['ach', 'stripe'].includes(t.method))
    throw new Error('Select an approved payment method.');
  if (t.agreement.length < 100 || t.agreement.length > 40000)
    throw new Error('Add the reviewed agreement text (100–40,000 characters).');
  if (/\[REPLACE|\[TODO|\bTBD\b|lorem ipsum/i.test(t.agreement))
    throw new Error('Replace all draft placeholders before signing.');
  if (
    Object.values(t).some(
      (v) =>
        typeof v === 'string' &&
        [...v].some((c) => {
          const n = c.charCodeAt(0);
          return (
            (n < 32 && ![9, 10, 13].includes(n)) ||
            (n >= 0x202a && n <= 0x202e) ||
            (n >= 0x2066 && n <= 0x2069)
          );
        }),
    )
  )
    throw new Error('Remove hidden control characters.');
}

export function agreementText(t: Terms) {
  const split = totals(t);
  return [
    'ARTWORK CONSIGNMENT AGREEMENT AND SALE SETTLEMENT / PAYMENT RECORD',
    `Artist: ${t.artistLegalName} (${t.artistName})\nCapacity: ${t.artistCapacity}\nAddress: ${t.artistAddress}\nEmail: ${t.artistEmail}`,
    `MCLIV legal party: ${t.mclivLegalName}\nAddress: ${t.mclivAddress}`,
    `Artwork: ${t.title}\n${t.description}\nShopify order: ${t.orderId}; line: ${t.lineId}\nSale date: ${t.saleDate}`,
    `Currency: USD\nArtwork after discounts, excluding tax and shipping: ${dollars(t.artworkCents)}\nAllocated sales tax: ${dollars(t.taxCents)}\nAllocated shipping: ${dollars(t.shippingCents)}\nTotal allocated to this line: ${dollars(t.totalCents)}\nMCLIV commission (20%): ${dollars(split.commission)}\nArtist share (80%, before agreed deductions): ${dollars(t.artworkCents - split.commission)}\nAgreed deductions: ${dollars(t.deductionCents)} — ${t.deductionReason || 'None'}\nArtist entitlement: ${dollars(split.artist)}\nPayment initiation deadline: ${t.dueDate}\nPayment method: ${t.method === 'ach' ? 'Direct bank / ACH' : 'Stripe'}\nFee allocation: ${t.feeTerms}`,
    t.agreement,
    'Signing records agreement, not receipt of funds. Payment confirmations are separate records. No bank account number or tax ID forms part of this document.',
    `Electronic signature consent\n${CONSENT}`,
  ].join('\n\n');
}

export function deadlineLabel(
  date: string,
  paid: boolean,
  issue: boolean,
  now = new Date(),
) {
  if (paid) return 'Paid';
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  if (today > date) return 'Overdue — contact required';
  // Escalate on the prior business day, including weekend deadlines.
  const prior = new Date(`${date}T12:00:00Z`);
  do {
    prior.setUTCDate(prior.getUTCDate() - 1);
  } while ([0, 6].includes(prior.getUTCDay()));
  if (today >= prior.toISOString().slice(0, 10)) return 'Due soon — review now';
  return issue ? 'Correction / assistance requested' : `Due ${date}`;
}
