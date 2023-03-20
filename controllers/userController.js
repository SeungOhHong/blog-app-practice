const User = require("../models/User");

// /login POST 요청에 대한 로그인 컨트롤러 함수
exports.login = function (req, res) {
  let user = new User(req.body);
  // 이제 user 모델 파일로 가서 login 이라는 메서드를 만든다
  // 데이터에 대한 비지니스 로직을 다루는 곳은 컨트롤러가 아니다
  // 모델에서 정의를 하는 것이 best practice 이다

  // 문제는 현재 우리는 login 메서드가 언제 완료될지 그 시점을 모른다는 것이다
  // 때문에 함수로 정의하고 모델의 User.js에서 콜백으로 비동기로 처리해줘야한다
  // 그래야 올바른 시기에 해당 result를 콜백해준다
  user.login(function (result) {
    res.send(result);
  });
};

exports.logout = function () {};

exports.register = function (req, res) {
  let user = new User(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("Congrats, there are no errors.");
  }
};

exports.home = function (req, res) {
  res.render("home-guest");
};
