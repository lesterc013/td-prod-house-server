import express from 'express';
import indexRouter from './src/routes/indexRouter.js';

const PORT = process.env.SERVER_PORT;

const app = express();

app.use('/', indexRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Listening on ${PORT}`);
});
