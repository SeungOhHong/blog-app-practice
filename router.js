const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");

router.get("/", userController.home);
router.post("/register", userController.register);
// 이제 /login 라우터에 post 요청이 들어오면userController.login 함수가 호출된다
router.post("/login", userController.login);

module.exports = router;
