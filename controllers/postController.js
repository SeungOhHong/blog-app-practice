// 게시물 생성 로직에서 중요한 것이 있다. 유저 개개인 마다 게시물을 관리해야하기 때문에
// 유저의 id 도 저장을 해야한다. 그래야 구분이 가능해지니까
const Post = require("../models/Post");

exports.viewCreateScreen = function (req, res) {
  res.render("create-post");
};

exports.create = function (req, res) {
  // post 생성자 함수에 a 사용자 제출 데이터 , b 세션에 저장된 유저의 id 값을 파라미터로 넘겨준다
  let post = new Post(req.body, req.session.user._id);
  post
    .create()
    .then(function () {
      res.send("New post created.");
    })
    .catch(function (errors) {
      res.send(errors);
    });
};
