// 유저가 제출한 데이터를 생성할 블루프린트인 생성자 함수 User를 임포트해준다(경로 설정 주의)
const User = require("../models/User");

exports.login = function () {};

exports.logout = function () {};

exports.register = function (req, res) {
  // models 에서 정의한 생성자 함수를 new키워드를 이용하여 req.body에 접근해서 유저가 FORM 에서 제출한 객체 데이터를 바탕으로 생성해준다. argument로 통과 시켜주는 것은 유저가 제출한 req.body
  let user = new User(req.body);
  user.register();
  res.send("Thanks for trying to register");
};

exports.home = function (req, res) {
  res.render("home-guest");
};
