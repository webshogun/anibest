import { Pool } from "pg";

export const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'anibest',
	password: '2580',
	port: 5432,
});
