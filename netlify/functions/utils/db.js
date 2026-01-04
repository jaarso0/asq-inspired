const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Render PostgreSQL
    }
});

// Test connection on startup
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

module.exports = { pool };
