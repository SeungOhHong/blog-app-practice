const express = require("express");
const app = express();

// 라우터를 불러와준다 (현재 경로를 적어준다)
// require 함수는 해당 파일이 module.exports 하고 있는 것을 리턴해준다
// 라우터에서 정의된 함수를 app.js 파일에서도 사용할 수 있게 된다
const router = require("./router");

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

// 모든 라우터를 파일로 만들어서 관리한다 (router.js)
// app.use 함수를 이용하여 base URL과 파일에서 임포트한 변수명을 b에 적어준다
app.use("/", router);

app.listen(3000);
