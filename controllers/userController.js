const User = require("../models/User");

exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      // 세션 객체에 user라는 객체 프로퍼티를 추가한다
      // HTTP 요청은 stateless하기 때문에 이전 요청에 대한 기억을 가지고 있지 않다
      // 그래서 세션이라는 개념으로 데이터가 지속성을 가지도록 만들어주는 것이다
      // 이제 이 세션 데이터를 URL들과 라우터에서 확인할 수 있다
      req.session.user = { favColor: "blue", username: user.data.username };
      /* 
      방문자가 올바른 사용자 이름과 비밀번호 값을 입력했을 때, 즉 이 코드가 잘 실행되었다는 것을 의미합니다. 여기서 세션 객체를 활용했을 때, 두 가지 일이 발생한다.

첫째, 서버는 이 세션 데이터를 메모리에 저장한다.
둘째, 세션 패키지가 수행할 작업은 웹 브라우저가 쿠키를 만들도록 지시한다.
      
 이제 localhost를 방문할 때마다.
Google Chrome 웹 브라우저에서 이 쿠키와 값을 노드 서버로 다시 보냅니다.
우리의 서버는 쿠키에 저장된  고유한 식별자 값을 볼 것이고 우리의 서버는 "아하"라고 말할 것입니다.
그래서 서버는 이 세션 값이 사용자 또는 사용자가 올바른 사용자 이름과 암호를 입력한 동일한 사용자 또는 동일한 웹 브라우저라는 것을 의미한다고 말합니다
      */
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
  // 만약 현재 방문자 또는 브라우저에 세션 데이터(req.session.user)가 연결되어 있으면 응용 프로그램에 대해 안녕하세요 및 환영합니다라는 사용자 지정 메시지를 보냅니다.
  if (req.session.user) {
    res.send("환영합니다!");
  } else {
    // 세션 데이터가 없다면 게스트 홈페이지를 송출한다
    res.render("home-guest");
    // 즉, 로그인한 사용자와 게스트 사용자를 브라우저에서 세션 데이터로 구분할 수 있게 된다.
  }
};
