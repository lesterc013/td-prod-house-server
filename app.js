import express from 'express';

const PORT = process.env.SERVER_PORT;

const app = express();

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Listening on ${PORT}`);
});
