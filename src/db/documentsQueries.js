import AppError from '../utils/AppError.js';
import pool from './pool.js';

/**
 *
 * @returns All documents in the DB.
 */
export async function getAllDocumentsDb() {
  try {
    const res = await pool.query(`SELECT * FROM documents`);
    return res.rows;
  } catch (error) {
    throw new AppError(
      `Failed to fetch documents from DB: ${error.message}`,
      500,
      error,
    );
  }
}

/**
 * Deletes ONE document based on id provided.
 * @param {string} id
 * @returns Properties of the deleted document.
 */
export async function deleteDocumentDb(id) {
  let res;
  try {
    res = await pool.query(`DELETE FROM documents WHERE id = $1 RETURNING id`, [
      id,
    ]);
  } catch (err) {
    throw new AppError(`Failed to delete document: ${err.message}`, 500, err);
  }

  if (res.rowCount === 0) {
    throw new AppError(`Document with id ${id} not found`, 404, null);
  }

  return res.rows[0].id;
}

/**
 * Takes in the document's filename. Makes a new record in DB. Returns the corresponding id.
 * @param {string} name
 * @returns id of the record
 */
export async function insertDocumentDb(name) {
  try {
    const res = await pool.query(
      'INSERT INTO documents (name) VALUES ($1) RETURNING id',
      [name],
    );
    return res.rows[0].id;
  } catch (error) {
    throw new AppError(
      `Failed to insert document into DB: ${error.message}`,
      500,
      error,
    );
  }
}
