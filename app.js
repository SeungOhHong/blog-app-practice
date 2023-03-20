// npm install --save mysql2
const express = require("express");
// db 풀을 임포트해준다
const db = require("./util/database");
const app = express();

const router = require("./router");
// db.execute  mysql에서 테이블 내의 모든 쿼리를 불러온다
db.execute("SELECT * FROM products")
  .then((result) => {
    console.log(result[0], result[1]);
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", router);

module.exports = app;
