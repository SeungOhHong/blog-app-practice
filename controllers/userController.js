const User = require("../models/User");

exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      // 이제 로그인도 이제 서버가 새로 만든 세션을 인식하고 로그인한 것과 동일한 URL로 리다이렉트하도록 만들어준다
      // req.session.user는 DB에 접근해서 업데이트 하는 함수이기 때문에 종료 시점을 알 수 없다
      req.session.user = { favColor: "blue", username: user.data.username };
      // 때문에 세션 데이터를 수동으로 저장하도록 명령한 후에 콜백함수로 res.redirect("/")를 호출한다
      // 이로서 새로운 데이터를 save하는 작업이 완료 되기 전까지 베이스 url로 redirect되지 않을 것이다
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (e) {
      res.send(e);
    });
};

exports.logout = function (req, res) {
  // session을 destroy() 메서드를 이용해서 파괴해준다
  // 그 후 베이스 url로 돌아가도록 콜백함수로 redirect 하도록 설정해준다
  // destroy 메서드는 DB에 접근해서 세션을 파괴하는 함수이기 때문에 비동기로 처리해야한다

  req.session.destroy(function () {
    res.redirect("/");
  });
};

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
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest");
  }
};
