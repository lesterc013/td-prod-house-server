import { PDFParse } from 'pdf-parse';

const IS_TEXT_PARSABLE_NUM_CHARS_THRESHOLD = 150; // Referenced from netdocuments ocr service.
// pdf.js (underlying library used to display the pdf contents by pdf-parse defaults to 72dpi
// Scaling by 4.17 should make the image 300 dpi to improve OCR results.
const SCALE_MULTIPLIER_TO_300_DPI = 4.17;

/**
 * Takes in a buffer of the pdf file. Returns the text as a concatenated string.
 * @param {*} buffer
 */
export async function extractTextFromPdf(buffer) {
  let parsedText = '';

  // Assume entire buffer is text glyph. Parse the entire buffer first.
  const parser = new PDFParse({ data: buffer });
  const parseResult = await parser.getText({ pageJoiner: '' });
  await parser.destroy();
  parsedText = parseResult.text;

  const totalChars = parseResult.text.trim().length;
  const totalPages = parseResult.total;
  const avgCharsPerPage = Math.floor(totalChars / totalPages);

  // Check if the pdf was indeed text-glyph or image-based
  // Use OCR if the pdf did not have text glyphs ie no text parsed out.
  if (avgCharsPerPage <= IS_TEXT_PARSABLE_NUM_CHARS_THRESHOLD) {
    console.log(
      `Avg chars per pg: ${avgCharsPerPage}. Should be image based pdf. Use OCR.`,
    );
    // TODO: [improve ocr results] Include binarization, noise reduction as improvements

    console.log('Converting pdf pages to pngs..');
    const pngParser = new PDFParse({ data: buffer });
    // .pages is a Screenshot[]
    const pngs = await pngParser.getScreenshot({
      scale: SCALE_MULTIPLIER_TO_300_DPI,
    });
    await pngParser.destroy();

    console.log('Extracting text from pngs..');
    for (let i = 0; i < pngs.pages.length; i++) {
      const pngBuffer = Buffer.from(pngs.pages[i].data);
      // Using Tesseract.js to extract text from images.
      const worker = await createWorker('eng');
      const {
        data: { text },
      } = await worker.recognize(pngBuffer);

      // Append every page's OCR-ed text to parsedText.
      parsedText += text + '\n';
      await worker.terminate();
    }
  }

  return parsedText;
}
