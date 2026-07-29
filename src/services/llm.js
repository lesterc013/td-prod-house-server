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

/**
 *
 * @param {string} query
 * @param {chunks[]} kChunks
 * @returns {string} Model's response to the query and the chunks provided.
 *
 * @type {Response}
 */
export async function generateAnswer(query, kChunks) {
  // Create the prompt
  let listOfChunks = '';
  let totalConfidenceScore = 0;

  kChunks.forEach((chunk, index) => {
    listOfChunks += `Chunk ${index + 1}, Similarity Score ${chunk.similarity}: ${chunk.content}\n`;
    totalConfidenceScore += chunk.similarity;
  });

  const avgConfidenceScore = totalConfidenceScore / kChunks.length;

  const prompt =
    process.env.SYSTEM_PROMPT +
    `Question: ${query}\n` +
    `Document excerpts (average confidence score: ${avgConfidenceScore})\n` +
    listOfChunks;

  // Send to /api/generate
  const res = await fetch(process.env.GENERATE_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      model: process.env.GENERATE_MODEL_NAME,
      prompt,
      stream: false,
    }),
  });

  // Need a res.ok check cos with fetch, status codes like 404 or 500 dont throw errors,
  // as the promise is still considered resolved.
  if (!res.ok) {
    throw new AppError(
      `Generate request failed. Response original text: ${res.statusText}`,
      res.status,
      null,
    );
  }

  const data = await res.json();
  return data.response;
}
