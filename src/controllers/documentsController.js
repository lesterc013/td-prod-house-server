import { uploadToMemory } from '../middleware/upload.js';
import { PDFParse } from 'pdf-parse';
import responseFactory from '../utils/responseFactory.js';

// After multer processing:
// req.file.originalname → 'rsn_wiki.pdf'
// req.file.mimetype → 'application/pdf'
// req.file.buffer → the raw file bytes, ~16.9MB — this is what pdf-parse will consume in step 2

const uploadDocumentsPost = [
  uploadToMemory.single('uploaded_file'),
  async (req, res, next) => {
    // TODO: Need validate file type is pdf else throw error. Ref: upload.js

    // Assuming all good with the file,
    // Store it in "documents" first to get back the id.
    // This will be used as the fk for each record in "chunks" for this document.

    // TODO: Theres an issue where if the pdf file is not saved with text glyphs,
    // parsing will result in whitespace. How to fix this?
    // Parse the text
    const parser = new PDFParse({ data: req.file.buffer });
    const parseResult = await parser.getText({ pageJoiner: '' });
    await parser.destroy();
    console.log(parseResult.text);
    // Chunk the text
    // For each chunk, get an embedding
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
