import pool from './pool.js';

/**
 * Takes in the document's filename. Makes a new record in DB. Returns the corresponding id.
 * @param {string} name
 * @returns id of the record
 */
export async function insertDocumentDb(name) {
  // Insert if not exists??
  const res = await pool.query(
    'INSERT INTO documents (name) VALUES ($1) RETURNING id',
    [name],
  );
  return res.rows[0].id;
}
