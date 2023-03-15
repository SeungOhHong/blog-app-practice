// user에 관련된 함수들이다
// 모듈을 다른 파일에서 이용할 수 있도록 exports 해준다
// exports.프로퍼티명 = 함수 로 정의해주면 된다.

// login 함수
exports.login = function () {};

// logout 함수
exports.logout = function () {};

// register 함수
exports.register = function (req, res) {
  res.send("Thanks for trying to register");
};

// home 함수 : 대시보드에 접근했을 때 렌더링 된다
exports.home = function (req, res) {
  res.render("home-guest");
};
