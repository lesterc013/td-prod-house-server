import { MarkdownTextSplitter } from '@langchain/textsplitters';

// Note: chunk related params are for num of chars per langchain docs.
const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;

const markdownSplitter = new MarkdownTextSplitter({
  chunkSize: CHUNK_SIZE,
  chunkOverlap: CHUNK_OVERLAP,
  keepSeparator: true,
});

/**
 *
 * @param {string} markdown - a string of the file parsed as markdown format.
 * @returns {string[]} Array of chunks by markdown i.e. section headers then the chunk size.
 */
export async function splitMarkdown(markdown) {
  const chunks = await markdownSplitter.splitText(markdown);
  // Only leave chunks that have > 100 chars
  // This is due to noise like <--image--> or image captions that are unnecessary
  return chunks.filter((chunk) => chunk.trim().length > 100);
}
