const DOCLING_API = 'http://localhost:5001/v1/convert/file';
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

  const res = await fetch(DOCLING_API, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Docling error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.document.md_content;
}
