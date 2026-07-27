import pool from './pool.js';
import pgvector from 'pgvector/pg';

export async function insertChunkDb(documentId, content, embedding) {
  const res = await pool.query(
    'INSERT INTO chunks (document_id, content, embedding) VALUES ($1, $2, $3) RETURNING id',
    [documentId, content, pgvector.toSql(embedding)],
  );
  return res.rows[0].id;
}

/**
 * Searches DB for the k most cosine-similar chunks to the query.
 * @param {number[]} queryEmbedding
 * @param {number} k
 * @returns ?
 */
export async function getSimilarChunksDb(queryEmbedding, k = 5) {
  const res = await pool.query(
    `SELECT content, 1 - (embedding <=> $1) AS similarity 
    FROM chunks 
    ORDER BY embedding <=> $1 
    LIMIT $2`,
    [pgvector.toSql(queryEmbedding), k],
  );

  return res.rows;
}
