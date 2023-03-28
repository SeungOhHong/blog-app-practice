const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");

// user related routes
router.get("/", userController.home);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// post related routes
router.get(
  "/create-post",
  userController.mustBeLoggedIn,
  postController.viewCreateScreen
);
router.post(
  "/create-post",
  userController.mustBeLoggedIn,
  postController.create
);
// 생성한 포스트에 대한 url이다. 생성된 게시물 id를 참조해서 라우팅된다
// 해당 요청에 대한 응답으로 postController에서 정의한 viewSingle 함수가 실행된다
router.get("/post/:id", postController.viewSingle);

module.exports = router;
