const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

async function getAllTheCoolMessages() {
  try {
    const result = await pool.query('SELECT * FROM messages');
    console.log(result.rows);
  } catch (err) {
    throw err
  }
};

module.exports = {
  getAllTheCoolMessages
};