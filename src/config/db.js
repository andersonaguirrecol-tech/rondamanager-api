require('dotenv').config();
const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }

  query(texto, parametros) {
    return this.pool.query(texto, parametros);
  }
}

module.exports = new Database();