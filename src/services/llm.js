import AppError from '../utils/AppError.js';

/**
 * Takes in a chunk as a string, makes a call to ollama embedding endpoint, returns the number[] containing the embeddings of that chunk.
 * @param {string} input
 * @returns number[] that contains the required embeddings.
 */
export async function requestEmbedding(input) {
  const res = await fetch(process.env.EMBEDDING_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      model: process.env.EMBEDDING_MODEL_NAME,
      input,
    }),
  });

  // Need a res.ok check cos with fetch, status codes like 404 or 500 dont throw errors,
  // as the promise is still considered resolved.
  if (!res.ok) {
    throw new AppError(
      `Embedding request failed. Response original text: ${res.statusText} — is ngrok running?`,
      res.status,
      null,
    );
  }

  const data = await res.json();
  return data.embeddings[0];
}
