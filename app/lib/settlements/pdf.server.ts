import {PDFDocument, rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
// Resolved by the build-time font plugin; no runtime font request.
// eslint-disable-next-line import/no-unresolved
import fontBase64 from 'virtual:settlement-font';

export async function signedPdf(
  document: string,
  documentHash: string,
  mclivSigner: string,
  mclivSignedAt: string,
  artistSigner: string,
  signedAt: string,
  revision: number,
  preview = false,
) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(
    Uint8Array.from(atob(fontBase64), (c) => c.charCodeAt(0)),
    {subset: true},
  );
  pdf.setTitle(
    preview
      ? 'MCLIV — Test walkthrough, not a signed agreement'
      : 'MCLIV — Artwork Consignment Agreement and Sale Settlement',
  );
  pdf.setCreationDate(new Date(signedAt));
  pdf.setModificationDate(new Date(signedAt));
  let page = pdf.addPage([612, 792]);
  let y = 737;
  function newPage() {
    page = pdf.addPage([612, 792]);
    y = 737;
  }
  function line(text: string, size = 10) {
    if (y < 62) newPage();
    page.drawText(text, {x: 48, y, size, font, color: rgb(0.04, 0.04, 0.04)});
    y -= size * 1.6;
  }
  function paragraph(text: string) {
    let buffer = '';
    for (const word of text.split(/\s+/)) {
      if (
        font.widthOfTextAtSize(buffer ? `${buffer} ${word}` : word, 10) > 510 &&
        buffer
      ) {
        line(buffer);
        buffer = '';
      }
      if (font.widthOfTextAtSize(word, 10) > 510) {
        for (const char of word) {
          if (font.widthOfTextAtSize(buffer + char, 10) > 510) {
            line(buffer);
            buffer = '';
          }
          buffer += char;
        }
      } else buffer += `${buffer ? ' ' : ''}${word}`;
    }
    if (buffer) line(buffer);
    y -= 6;
  }
  line(
    preview
      ? 'MCLIV / TEST ONLY — NOT A SIGNED AGREEMENT'
      : 'MCLIV / SIGNED AGREEMENT',
    14,
  );
  for (const para of document.split('\n')) {
    if (para === 'Electronic signature consent' && y < 160) newPage();
    paragraph(para);
  }
  if (y < 360) newPage();
  else y -= 24;
  line(preview ? 'TEST COMPLETION RECORD' : 'SIGNATURE RECORD', 14);
  for (const para of preview
    ? [
        'This is a test walkthrough. No legal signature, sale, bank details, or payment was recorded.',
        `Test name: ${artistSigner}\nTest completed: ${signedAt}`,
        'The displayed artwork price is catalogue information only. It does not confirm an actual sale or amount owed. Real agreement terms and payment setup must be approved separately.',
      ]
    : [
        `Agreement revision: ${revision}`,
        `Agreement SHA-256: ${documentHash}`,
        `MCLIV signature: ${mclivSigner}\nSigned electronically: ${mclivSignedAt}`,
        `Artist signature: ${artistSigner}\nSigned electronically: ${signedAt}`,
        'Both signatures apply to the exact agreement reproduced in this file, including its sale statement and electronic-signature consent. The artist used the private invitation issued to the verified contact for this agreement.',
        'PAYMENT IS NOT CONFIRMED BY THIS SIGNATURE. See the separate payment ledger for amounts actually sent, confirmed, or returned.',
      ])
    for (const text of para.split('\n')) paragraph(text);
  pdf
    .getPages()
    .forEach((p, index) =>
      p.drawText(
        `${preview ? 'TEST ONLY — NOT SIGNED' : 'MCLIV'}  |  Revision ${revision}  |  ${index + 1} / ${pdf.getPageCount()}`,
        {x: 48, y: 32, font, size: 8},
      ),
    );
  const bytes = await pdf.save();
  if (bytes.length > 1000000)
    throw new Error('Agreement file is too large. Contact MCLIV.');
  return bytes;
}
