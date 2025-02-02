import pgPromise from "pg-promise";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pgp = pgPromise();

const cn = {
  host: DB_HOST,
  port: 5432,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
};

const db = pgp(cn);

export default db;
