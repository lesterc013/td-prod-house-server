import { Pool } from 'pg';
import pgvector from 'pgvector/pg';

export default new Pool({
  connectionString: process.env.DATABASE_URL,
  onConnect: async (client) => await pgvector.registerTypes(client),
});
