const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const app = express();

let sessionOptions = session({
  secret: "JavaScript is sooooooooo coool",
  store: MongoStore.create({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

app.use(sessionOptions);
app.use(flash());

// 라우팅 이전에 세션 데이터를 한번 불러오고 시작하기 때문에 따로 userController 와 postController의 파라미터로 넘겨줄 필요가 없어진다
// 모든 요청에 대해서 아래의 app.use 함수가 가장 먼저 실행되기 때문이다
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

const router = require("./router");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", router);

module.exports = app;
