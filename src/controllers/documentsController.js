// Utils
import { uploadToMemory } from '../middleware/upload.js';
import responseFactory from '../utils/responseFactory.js';

// Services
import { extractTextFromPdfBuffer } from '../services/pdfProcessor.js';
import { chunkText } from '../services/textChunker.js';
import { requestEmbedding } from '../services/llm.js';

// DB Queries
import { insertDocumentDb } from '../db/documentsQueries.js';
import { insertChunkDb } from '../db/chunksQueries.js';

// After multer processing:
// req.file.originalname → 'rsn_wiki.pdf'
// req.file.mimetype → 'application/pdf'
// req.file.buffer → the raw file bytes, ~16.9MB — this is what pdf-parse will consume in step 2

const uploadDocumentsPost = [
  uploadToMemory.single('uploaded_file'),
  async (req, res, next) => {
    console.log('--- PDF Uploaded. Commence parsing ---');
    // TODO: Need validate file type is pdf else throw error. Ref: upload.js
    // TODO: How to provide some form of loading percentage UI?

    // Assume can parse out text:
    const buffer = req.file.buffer;
    const parsedText = await extractTextFromPdfBuffer(buffer);
    const textChunks = await chunkText(parsedText);

    // Build up the arr of [textChunk, embedding]
    const chunksDbEntries = [];
    for (const text of textChunks) {
      const embedding = await requestEmbedding(text);
      chunksDbEntries.push([text, embedding]);
    }

    // Once all the textChunks have been embedded and their text stored,
    // Upload the document name to DB so we can get the document_id for chunks fk reference.
    const docId = await insertDocumentDb(req.file.originalname);

    // Then upload each chunkDbEntry to chunks DB.
    for (const chunksDbEntry of chunksDbEntries) {
      await insertChunkDb(docId, chunksDbEntry[0], chunksDbEntry[1]);
    }

    const filename = req.file.originalname;
    console.log(
      `Name: ${filename} inserted with id: ${docId}. Chunks inserted ${chunksDbEntries.length}`,
    );

    res.json(
      responseFactory.createJsonResponse({
        message: `Uploaded ${filename} successfully`,
      }),
    );
  },
];

export default {
  uploadDocumentsPost,
};
