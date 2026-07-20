import { uploadToMemory } from '../middleware/upload.js';
import responseFactory from '../utils/responseFactory.js';

import { PDFParse } from 'pdf-parse';
import { createWorker } from 'tesseract.js';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { extractTextFromPdf } from '../services/pdfProcessor.js';

const IS_TEXT_PARSABLE_NUM_CHARS_THRESHOLD = 150; // Referenced from netdocuments ocr service.
// pdf.js (underlying library used to display the pdf contents by pdf-parse defaults to 72dpi
// Scaling by 4.17 should make the image 300 dpi to improve OCR results.
const SCALE_MULTIPLIER_TO_300_DPI = 4.17;
// Note: chunk related params are for num of chars per langchain docs.
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: CHUNK_SIZE,
  chunkOverlap: CHUNK_OVERLAP,
});

// After multer processing:
// req.file.originalname → 'rsn_wiki.pdf'
// req.file.mimetype → 'application/pdf'
// req.file.buffer → the raw file bytes, ~16.9MB — this is what pdf-parse will consume in step 2

const uploadDocumentsPost = [
  uploadToMemory.single('uploaded_file'),
  async (req, res, next) => {
    console.log('--- PDF Uploaded. Commence parsing ---');
    // TODO: Need validate file type is pdf else throw error. Ref: upload.js

    // Assuming all good with the file,
    // Store it in "documents" first to get back the id.
    // This will be used as the fk for each record in "chunks" for this document.

    // TODO: How to provide some form of loading percentage UI?
    // TODO: Refactor all the business logic after all main functionality is done.

    // Assume can parse out text:
    const buffer = req.file.buffer;
    const parsedText = await extractTextFromPdf(buffer);
    // const parser = new PDFParse({ data: buffer });
    // const parseResult = await parser.getText({ pageJoiner: '' });
    // await parser.destroy();

    // const totalChars = parseResult.text.trim().length;
    // const totalPages = parseResult.total;
    // const avgCharsPerPage = Math.floor(totalChars / totalPages);

    // let parsedText = '';

    // // Use OCR if the pdf did not have text glyphs ie no text parsed out.
    // if (avgCharsPerPage <= IS_TEXT_PARSABLE_NUM_CHARS_THRESHOLD) {
    //   console.log(
    //     `Avg chars per pg: ${avgCharsPerPage}. Should be image based pdf. Use OCR.`,
    //   );
    //   // TODO: [improve ocr results] Include binarization, noise reduction as improvements

    //   console.log('Converting pdf pages to pngs..');
    //   const pngParser = new PDFParse({ data: buffer });
    //   // .pages is a Screenshot[]
    //   const pngs = await pngParser.getScreenshot({
    //     scale: SCALE_MULTIPLIER_TO_300_DPI,
    //   });
    //   await pngParser.destroy();

    //   console.log('Extracting text from pngs..');
    //   for (let i = 0; i < pngs.pages.length; i++) {
    //     const pngBuffer = Buffer.from(pngs.pages[i].data);
    //     // Using Tesseract.js to extract text from images.
    //     const worker = await createWorker('eng');
    //     const {
    //       data: { text },
    //     } = await worker.recognize(pngBuffer);

    //     // Append every page's OCR-ed text to parsedText.
    //     parsedText += text + '\n';
    //     await worker.terminate();
    //   }
    // } else {
    //   parsedText = parseResult.text;
    // }

    // console.log(`Final parsed text: ${parsedText}`);

    // Chunk the text
    const chunks = await splitter.splitText(parsedText);
    // console.log(`Total chunks: ${chunks.length}`);
    // chunks.forEach((chunk, i) => {
    //   console.log(`\n--- Chunk ${i} (${chunk.length} chars) ---`);
    //   console.log(chunk);
    // });
    // For each chunk, get an embedding
    // TODO: Make a fetch to the ollama embedding api
    // Upload this record to the "chunks" table along with the correct fk
    res.json(
      responseFactory.createJsonResponse({
        message: 'Uploaded <filename> how to get?',
      }),
    );
  },
];

export default {
  uploadDocumentsPost,
};
