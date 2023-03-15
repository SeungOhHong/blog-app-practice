const User = require("../models/User");

exports.login = function () {};

exports.logout = function () {};

exports.register = function (req, res) {
  let user = new User(req.body);
  user.register();
  // 만약 에러 배열이 존재한다면
  if (user.errors.length) {
    // 유저에게 에러 메세지를 보낸다
    res.send(user.errors);
    // 에러 배열의 길이가 0이라면(없다면) 에러가 없다고 표시해준다
  } else {
    res.send("Congrats, there are no errors.");
  }
};

exports.home = function (req, res) {
  res.render("home-guest");
};
