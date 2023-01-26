const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

function addMessage(msg) {
  pool.query('INSERT INTO messages (msg) VALUES ($1)', [msg],
    (error) => {
      if (error) {
        throw error;
      }
    }
  );
};

module.exports = {
  addMessage
};