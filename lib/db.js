import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 21294,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false // Mengizinkan SSL Aiven tanpa validasi strict sertifikat lokal
      },
      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 5,
      idleTimeout: 60000,
    });
  }
  return pool;
}