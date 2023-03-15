// npm install express
// let은 재할당이 가능하기 때문에 에러를 피하기 위해서 const를 사용한다
// 변수에 대한 예측성이 증가한다
const express = require("express");
const app = express();

// public 폴더를 views에서 사용할 수 있도록 app.use 로 불러와준다
app.use(express.static("public"));
// view를 설정해준다
// 첫번째 views 는 express 옵션이고 두번째 views 는 우리가 정한 폴더 이름이다
app.set("views", "views");
// 어떤 템플릿 언어를 이용할 것인지 특정해준다(ejs, pug등등이 있다)
// npm install ejs
// 이제 view와 템플릿 엔진의 설정이 끝났다
app.set("view engine", "ejs");

// base url
app.get("/", function (req, res) {
  // view 파일을 렌더링 하도록 해준다
  // 렌더링할 템플릿을 적어준다. (ejs는 적을 필요없다.)
  res.render("home-guest");
});

app.listen(3000);

// npm install nodemon
// 패키지에. watch 라인을 추가해준다. 메인 서버 파일로 app.js 를 사용하고 있기 떄문에 nodemon app이라고 써준다. 
// "watch": "nodemon app",
// .js를 적을 필요는 없다

// 이제 npm run watch를 하면 서버를 재가동할 필요없이 변경사항이 자동으로 변경된다