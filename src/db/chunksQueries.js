import pool from './pool.js';
import pgvector from 'pgvector/pg';

export async function insertChunkDb(documentId, content, embedding) {
  const res = await pool.query(
    'INSERT INTO chunks (document_id, content, embedding) VALUES ($1, $2, $3) RETURNING id',
    [documentId, content, pgvector.toSql(embedding)],
  );
  return res.rows[0].id;
}
