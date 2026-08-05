import responseFactory from '../utils/responseFactory.js';

import { getAllDocumentsDb } from '../db/documentsQueries.js';

/**
 * Fills response with the data required to populate '/' path:
 * - List of documents uploaded so far
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getIndex(req, res, next) {
  const docs = await getAllDocumentsDb();
  res.json(
    responseFactory.createJsonResponse({
      message: {
        docs,
      },
    }),
  );
}

export default {
  getIndex,
};
