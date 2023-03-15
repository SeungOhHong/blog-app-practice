const express = require("express");
const router = express.Router();
// 컨트롤러를 require 함수로 임포트해서 컨트롤러에서 정의한 함수들을 모두 불러온다
const userController = require("./controllers/userController");

// 해당 a URL로 요청이 들어오면 b가 실행된다
// 라우터가 실제 함수를 포함하지 않고 action에 관한 함수를 파일로 따로 관리한다
// 그것이 컨트롤러가 하는 일이다.
// 라우터는 단순히 경로들을 리스팅하는 역할만 하도록 한다
// controllers 폴더를 생성한 후 파일 3개를 생성한다.

// userController 변수가 반환하는 객체 중 home 함수를 가져온다
router.get("/", userController.home);
router.post("/register", userController.register);

module.exports = router;

// MVC 패턴
// Model = 데이터
// View = html 뷰파일
// Controller = 들어온 요청에 따라서 적절한 model 을 불러온 후 view에 해당 다이나믹 데이터들을 통과 시켜준다
