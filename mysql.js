const { env } = require("node:process");
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: env.DBHOST,
  user: env.DBUSER,
  password: env.DBPASS,
  database: env.DBNAME,
});

module.exports = pool.promise();
