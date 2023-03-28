const User = require("../models/User");

// mustBeLoggedIn : 게시물 생성 전에 로그인 된 상태인지 세션을 확인하는 함수
// 3번째 파라미터로 next를 받는다
exports.mustBeLoggedIn = function (req, res, next) {
  if (req.session.user) {
    // 만약 세션 데이터에 user 객체가 있다면(로그인 상태) next() 함수가 실행된다
    next();
  } else {
    // 아니라면 에러를 표시하고 홈 URL로 리다이렉트한다
    // 리다이렉트 전에 세션을 save한다
    // 이제 비로그인 상태에서 /create-post 라우터로 이동하려한다면 에러플레시를 띄워준다
    req.flash("errors", "You must be logged in to perform that action.");
    req.session.save(function () {
      res.redirect("/");
    });
  }
};

exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      req.session.user = { avatar: user.avatar, username: user.data.username };
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
      req.session.user = { username: user.data.username, avatar: user.avatar };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch((regErrors) => {
      regErrors.forEach(function (error) {
        req.flash("regErrors", error);
      });
      req.session.save(function () {
        res.redirect("/");
      });
    });
};

exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-dashboard");
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    });
  }
};
