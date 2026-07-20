import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

// Note: chunk related params are for num of chars per langchain docs.
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: CHUNK_SIZE,
  chunkOverlap: CHUNK_OVERLAP,
});

/**
 * Returns a string[] containing each of the chunks.
 * @param {string} text
 */
export async function chunkText(text) {
  const chunks = await splitter.splitText(text);
  return chunks;
}
