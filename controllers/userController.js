// 이제 회원가입 시에 에러 플레시 메세지를 띄우는 기능을 추가해보자
// 서버 사이드 유효성 검사 - 보안 측면
// 클라이언트 사이드 유효성 검사 - 사용자 경험 측면
const User = require("../models/User");

exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      req.session.user = { favColor: "blue", username: user.data.username };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (e) {
      req.flash("errors", e);
      req.session.save(function () {
        res.redirect("/");
      });
    });
};

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/");
  });
};

exports.register = function (req, res) {
  let user = new User(req.body);
  user
    .register()
    .then(() => {
      req.session.user = { username: user.data.username };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch((regErrors) => {
      // 만약 회원가입 시 에러가 있을 경우에는
      regErrors.forEach(function (error) {
        // 현재 에러를 'regErrors' 배열에 푸시해준다
        req.flash("regErrors", error);
      });
      // 위의 DB 작업이 완료 때까지 리다이렉트 되면 안되기 때문에 수동으로 세션을 저장해준다
      req.session.save(function () {
        // 저장 후 리다이렉트 된다
        res.redirect("/");
      });
    });
};

exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      // regError를 추가해준다.
      regErrors: req.flash("regErrors"),
    });
  }
};
