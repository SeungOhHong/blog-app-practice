const express = require("express");
const app = express();

const router = require("./router");

// 보일러플레이트 코드이다
// express 가 user가 제출한 데이터를 request 객체 안에 저장하도록 명령하는 코드
// 추후에 request.body로 제출한 데이터에 접근할 수 있다.

// 1. HTML FORM 제출에 대한 설정 코드
app.use(express.urlencoded({ extended: false }));
// 2. JSON 데이터를 전송하기 위한 설정 코드
app.use(express.json());

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", router);

app.listen(3000);
