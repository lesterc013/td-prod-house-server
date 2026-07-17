import AppError from '../utils/AppError.js';
import responseFactory from '../utils/responseFactory.js';

/** @type {import("express").RequestHandler} */
function getIndex(req, res, next) {
  try {
    res.json(responseFactory.createJsonResponse({ message: 'Hello World' }));
  } catch (error) {
    next(new AppError(error.message, error.statusCode, error));
  }
}

export default {
  getIndex,
};
