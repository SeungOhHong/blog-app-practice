const express = require("express");
const router = express.Router();

// base URL
router.get("/", function (req, res) {
  // 홈페이지 템플릿을 렌더링 해준다
  res.render("home-guest");
});

router.get("/about", function (req, res) {
  // 이제 /about 페이지에 get요청을 보내면 아래의 메세지를 응답한다
  res.send("This is our about page");
});

// 파일 간에 코드를 공유하기 위해서 라우터를 export 해준다
// 객체를 export 해 줄 수도 있다
module.exports = router;
