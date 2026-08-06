import express from 'express';
import cors from 'cors';
import indexRouter from './src/routes/indexRouter.js';
import responseFactory from './src/utils/responseFactory.js';
import documentsRouter from './src/routes/documentsRouter.js';
import { requestLogger } from './src/middleware/requestLogger.js';

const PORT = process.env.SERVER_PORT;

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ROUTES
app.use('/', indexRouter);
app.use('/documents', documentsRouter);

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
  //TODO: Add a check if "db online/connected" line and throw error if not.
  if (error) {
    throw error;
  }

  console.log(`Listening on ${PORT}`);
});
