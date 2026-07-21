import { PDFParse } from 'pdf-parse';
import { createWorker } from 'tesseract.js';

const NUM_CHARS_OCR_THRESHOLD = 150; // Referenced from netdocuments ocr service.
// pdf.js (underlying library used to display the pdf contents by pdf-parse defaults to 72dpi
// Scaling by 4.17 should make the image 300 dpi to improve OCR results.
const SCALE_MULTIPLIER_TO_300_DPI = 4.17;
const TESSERACT_WORKER_ENGLISH_PARAM = 'eng';

/**
 * Takes in a buffer of the pdf file. Returns the text as a concatenated string.
 * @param {*} buffer
 */
export async function extractTextFromPdf(buffer) {
  let parsedText = '';

  const tesseractWorker = await createWorker(TESSERACT_WORKER_ENGLISH_PARAM);

  // Assume entire buffer is text glyph. Parse the entire buffer using getText first.
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText({ pageJoiner: '' });

  // result.pages is an array of {text, num (page number)}
  // Iterate through these to see if a page's text is below char threshold i.e. use OCR to extract text.
  for (let i = 0; i < result.pages.length; i++) {
    const { text, num: pageNum } = result.pages[i];
    const numCharsOnPage = text.trim().length;
    let textOfPage = text;

    // Reassign textOfPage value to OCR parsed text if numChars below threshold.
    if (numCharsOnPage <= NUM_CHARS_OCR_THRESHOLD) {
      console.log(
        `Num chars on page ${pageNum} (${numCharsOnPage}) lesser than threshold ${NUM_CHARS_OCR_THRESHOLD}. Could be image page. Use OCR.`,
      );
      // getScreenshot of this page
      const screenshot = await parser.getScreenshot({
        scale: SCALE_MULTIPLIER_TO_300_DPI,
        partial: [pageNum],
      });
      const pngBuffer = Buffer.from(screenshot.pages[0].data);
      // Use tesseract
      const {
        data: { text },
      } = await tesseractWorker.recognize(pngBuffer);
      textOfPage = text;
    }

    parsedText += `${textOfPage}\n`;
  }

  await parser.destroy();
  await tesseractWorker.terminate();

  return parsedText;
}
