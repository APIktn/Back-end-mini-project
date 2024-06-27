import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: "postgresql://postgres:P@ssw0rd@localhost:5432/Backend-API",
});

export default connectionPool;
