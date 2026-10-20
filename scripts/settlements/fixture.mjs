import {DatabaseSync} from 'node:sqlite';
import {readFileSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';

// Synthetic, local-only fixture. Never imported by application code.
export const dir = mkdtempSync(join(tmpdir(), 'mcliv-settlement-check-'));
await build({
  stdin: {
    contents: `export * from './app/lib/settlements/domain'; export * from './app/lib/settlements/security.server'; export * from './app/lib/settlements/store.server';`,
    resolveDir: process.cwd(),
  },
  outfile: join(dir, 'backend.mjs'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  plugins: [
    {
      name: 'font',
      setup(builder) {
        builder.onResolve({filter: /^virtual:settlement-font$/}, () => ({
          path: 'font',
          namespace: 'test-font',
        }));
        builder.onLoad({filter: /.*/, namespace: 'test-font'}, () => ({
          contents: `export default ${JSON.stringify(readFileSync('app/assets/settlement-inter-regular.ttf').toString('base64'))}`,
        }));
      },
    },
  ],
});
export const api = await import(pathToFileURL(join(dir, 'backend.mjs')));
export const sqlite = new DatabaseSync(':memory:');
sqlite.exec(readFileSync('migrations/0002_artist_settlements.sql', 'utf8'));
class Statement {
  constructor(sql, values = []) {
    this.sql = sql;
    this.values = values;
  }
  bind(...values) {
    return new Statement(this.sql, values);
  }
  first() {
    return Promise.resolve(
      sqlite.prepare(this.sql).get(...this.values) || null,
    );
  }
  all() {
    return Promise.resolve({
      results: sqlite.prepare(this.sql).all(...this.values),
    });
  }
  run() {
    const result = sqlite.prepare(this.sql).run(...this.values);
    return Promise.resolve({meta: {changes: Number(result.changes)}});
  }
}
const database = {
  prepare: (sql) => new Statement(sql),
  async batch(statements) {
    sqlite.exec('BEGIN IMMEDIATE');
    try {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      sqlite.exec('COMMIT');
      return results;
    } catch (error) {
      sqlite.exec('ROLLBACK');
      throw error;
    }
  },
};
export const env = {
  ARTIST_SETTLEMENTS_ENABLED: 'true',
  ARTIST_SUBMISSIONS_DB: database,
  SETTLEMENT_PAYOUT_HOSTS: 'payments.example.com',
};
export const form = new URLSearchParams({
  artistSlug: 'lola-jiblazee',
  artistLegalName: 'Example Artist',
  artistEmail: 'artist@example.com',
  artistAddress: 'Example address',
  artistCapacity: 'Artist personally',
  mclivLegalName: 'Example Gallery Legal Party',
  mclivAddress: 'Example gallery address',
  title: 'Test artwork — not a live sale',
  description:
    'TEST ONLY. Acrylic on canvas, 16 × 20 inches; no frame; condition verified in test fixture.',
  orderId: 'gid://shopify/Order/900000001',
  lineId: 'gid://shopify/LineItem/900000001',
  saleDate: '2026-09-19',
  dueDate: '2026-09-25',
  artworkAmount: '950.00',
  taxAmount: '84.31',
  shippingAmount: '0.00',
  totalAmount: '1034.31',
  deductionAmount: '0.00',
  deductionReason: 'None',
  method: 'ach',
  payoutUrl: 'https://payments.example.com/test-recipient',
  feeTerms:
    'TEST ONLY: Gallery covers fees; artist receives the stated amount.',
  agreement:
    'TEST AGREEMENT ONLY. This synthetic record verifies the signing and payment software. It is not a contract with Lola or any other artist. The gallery handles delivery and insurance in this fixture. Copyright stays with the artist. Payment confirmation is a separate record.',
  mclivSigner: 'Example Gallery Signer',
  legalReviewed: 'on',
  saleVerified: 'on',
  contactVerified: 'on',
  noPriorPayment: 'on',
  mclivConsent: 'on',
});
