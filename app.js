import express from 'express';
import indexRouter from './src/routes/indexRouter.js';
import responseFactory from './src/utils/responseFactory.js';

const PORT = process.env.SERVER_PORT;

const app = express();

// ROUTES
app.use('/', indexRouter);

// ERROR HANDLER
app.use((err, req, res, next) => {
  // Immediate server log
  console.error(err);

  // Prepare the response parameters
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json(
    responseFactory.createJsonResponse(
      {
        message,
        statusCode,
      },
      err,
    ),
  );
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Listening on ${PORT}`);
});
