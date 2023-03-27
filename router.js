const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");

router.get("/", userController.home);
router.post("/register", userController.register);
router.post("/login", userController.login);
// /logout 라우터를 추가해준다
// 또한 logout 컨트롤러를 만들어준다
router.post("/logout", userController.logout);

module.exports = router;
