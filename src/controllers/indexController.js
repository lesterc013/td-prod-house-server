/** @type {import("express").RequestHandler} */
function getIndex(req, res, next) {
  res.json({
    data: { message: 'Hello World' },
  });
}

export default {
  getIndex,
};
