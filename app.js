const express = require("express");
const app = express();

const router = require("./router");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", router);

// 이제 포트를 직접 열지 않고 익스포트해준다 그 후 db.js 에서 불러온다
module.exports = app;
