// 이제 sql 데이터베이스를 연결해준다

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "dev-cal",
  password: "0201lkmi@@",
});

module.exports = pool.promise();
