const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
// 포스트 컨트롤러를 임포트해준다
const postController = require("./controllers/postController");

// 유저와 관련된 라우터
router.get("/", userController.home);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// 포스트와 관련된 라우터

// express 에서는 특정 라우터에 대해서 여러개의 함수로 응답할 수 있도록 할 수 있다
// 현재 /create-post 라우터에 대해서  userController.mustBeLoggedIn, postController.viewCreateScreen
// 이 두 가지 함수가 실행되도록 정의하였다
router.get(
  "/create-post",
  // 이 함수의 역할은 현재 세션에 user 객체가 있는지 확인하는 것이다
  // 확인한 후 user 객체가 존재한다면 next() 함수를 통해서 다음 함수를 실행할 수 있다
  // 즉, 로그인 된 사용자만이 해당 라우터(/create-post)에 접근할 수 있게 되는 것이다
  // (왜냐하면   res.render("create-post") 가 next 함수인 viewCreateScreen에 정의 돼있으니까)
  userController.mustBeLoggedIn,
  // 포스트컨트롤러에서 정의할 viewCreateScreen 함수를 참조한다
  postController.viewCreateScreen
);

module.exports = router;
