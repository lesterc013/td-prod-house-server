import fs from 'node:fs/promises';

/**
 * Takes in the file path. Returns the extracted text as a string.
 * @param {string} filePath
 * @returns string: Extracted text from the file
 */
export async function extractMarkdownFromFile(filePath) {
  const buffer = await fs.readFile(filePath);
  return await extractMarkdownFromBuffer(buffer);
}

/**
 * Takes in a file's buffer and returns the text as markdown. To help with a structured chunking strategy.
 * @param {Buffer<ArrayBufferLike>} buffer
 * @param {string} filename
 * @returns {string} Parsed text in markdown format.
 */
export async function extractMarkdownFromBuffer(buffer, filename) {
  const form = new FormData();
  // Note: Blob is the new MDN standard when trying to send buffers via fetch
  const blob = new Blob([buffer]);
  form.append('files', blob, filename);
  form.append('to_formats', 'md');

  const res = await fetch(process.env.DOCLING_SERVE_ENDPOINT, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Docling error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.document.md_content;
}
