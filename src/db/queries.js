import pool from './pool.js';

function testDbConnection() {
  pool
    .query('SELECT NOW()')
    .then(() => console.log('DB connected'))
    .catch((err) => console.error('DB connection failed', err));
}

export default {
  testDbConnection,
};
