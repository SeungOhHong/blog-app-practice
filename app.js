const express = require("express");
// 세션 패키지 익스포트하기
const session = require("express-session");
const app = express();

// 어떻게 요청을 신뢰할 수 있을까?
// 1. 세션 2. 토큰
// npm install express-session
// session() 안에 객체로 설정해준다
// 보일러플레이트 코드이다(외울필요없음)
let sessionOptions = session({
  secret: "JavaScript 굳~",
  resave: false,
  saveUninitialized: false,
  // maxAge : 얼마동안 valid 할 것인가(밀리세컨드 단위이다)
  // 1000 = 1초 / 60 : 1분 /  60 : 1시간 / 24 : 하루    => 1일 후에 expire되는 세션쿠키 발행
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

// 개발자 도구의 Application 탭에 들어가보면 쿠키를 확인할 수 있다.

// 미들웨어 연결해주기
app.use(sessionOptions);

const router = require("./router");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", router);

module.exports = app;
