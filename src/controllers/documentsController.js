import { uploadToMemory } from '../middleware/upload.js';
import responseFactory from '../utils/responseFactory.js';

// Services
import { extractTextFromPdf } from '../services/pdfProcessor.js';
import { chunkText } from '../services/textChunker.js';
import { requestEmbedding } from '../services/llm.js';

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
    const chunks = await chunkText(parsedText);

    // Chunk the text
    // For each chunk, get an embedding
    for (const chunk of chunks) {
      const embedding = await requestEmbedding(chunk);
      console.log(embedding);
      // Upload this record to the "chunks" table along with the correct fk
    }
    // TODO: Make a fetch to the ollama embedding api
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
