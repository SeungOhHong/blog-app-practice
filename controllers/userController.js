const User = require("../models/User");

exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      req.session.user = { favColor: "blue", username: user.data.username };
      res.send(result);
    })
    .catch(function (e) {
      res.send(e);
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
  if (req.session.user) {
    // 이제 세션 데이터가 있을 경우(로그인 상태) 다른 페이지를 보여주도록 한다
    // 하지만 유저에 따라서 플레이스홀더에 다른 이름이 보여야 하기 때문에
    // render(a,b)  a = 렌더하고자 하는 템플릿 , b = 템플릿에 전달하고 싶은 데이터 객체
    // 세션에 저장된 유저 이름을 가져온다
    // 템플릿에 하드코딩된 부분을 <%= username %> 으로 동적인 데이터로 변경해준다
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest");
  }
};
