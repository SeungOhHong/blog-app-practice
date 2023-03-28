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

// /create-post 경로에 대한 post 요청 라우터이다
router.post(
  "/create-post",
  userController.mustBeLoggedIn,
  // postController 에서 정의해준ㄷ
  postController.create
);

module.exports = router;
