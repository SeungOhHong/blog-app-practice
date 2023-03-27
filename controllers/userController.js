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
  // 이제 user.register 함수는 비동기 함수이기 때문에
  // register 함수의 에러 여부에 따라서 다음 라인 실행 여부를 then catch로 처리해줘야한다
  // 이 말은 User.js에서 register함수가 Promise를 리턴하도록 해줘야한다는 의미이다
  user
    .register()
    // user.register() 함수는 Promise를 리턴한다 .then().catch 문을 이용한다
    // user.register().then().catch()
    // 복잡해보이지만 user.register().then(()=>{}).catch(()=>{}) 이런 형태이다
    // promise 가 reject 됐을 경우에는 catch 객체를 반환한다
    .then(() => {
      // Promise가 해결 됐을 때
      // 세션 데이터를 로그인 상태로 업데이트 한 후
      req.session.user = { username: user.data.username };
      req.session.save(function () {
        // 로그인 상태인 베이스 url로 리다이렉트
        res.redirect("/");
      });
    })
    // Promise 가 미해결 됐을 때
    .catch((regErrors) => {
      // Promise로 리턴되어 들어온 regErrors 배열을 참조한다
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
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    });
  }
};
