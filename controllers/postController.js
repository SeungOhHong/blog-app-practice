// 이제 로그인한 유저가 포스트 생성 버튼을 누르면 포스트를 생성하는 url로 이동해서 생성하는
// 작업을 해보자

// 게시물 생성 버튼을 누르면 호출될 viewCreateScreen 함수이다. create-post 경로로 라우팅 된다

// 만약 로그인 하지 않은 상태에서 포스트를 생성하려한다면 빨간색 오류 메세지가 나오도록 해줘야한다.
exports.viewCreateScreen = function (req, res) {
  res.render("create-post", {
    // 동적으로 사용자 이름과 아바타가 바뀌도록 세션데이터의 username과 avatar를 객체로 전달해줘야한다
    username: req.session.user.username,
    avatar: req.session.user.avatar,
  });
};
