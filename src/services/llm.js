export async function requestEmbedding(input) {
  const res = await fetch(process.env.EMBEDDING_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      model: process.env.EMBEDDING_MODEL_NAME,
      input,
    }),
  });
  const data = await res.json();
  return data.embeddings[0];
}
