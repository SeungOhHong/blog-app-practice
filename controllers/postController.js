// Post 객체를 생성하는 블루프린트를 모델을 임포트해준다
const Post = require("../models/Post");

exports.viewCreateScreen = function (req, res) {
  res.render("create-post");
};

// 게시물 생성 post 요청에 대한 함수이다. 우리가 하고자 하는 것은 유저가 게시물에 입력한 내용을 DB에 저장하는 것이다
// DB에 관련된 로직은 컨트롤러가 아닌 model에서 관리한다. models 폴더의 post.js로 간다
exports.create = function (req, res) {
  // 포스트가 되어야하는 블루프린트를 정의한 Post를 new키워드로 불러온다
  // req.body 는 유저가 제출한 폼데이터이다  &
  let post = new Post(req.body, req.session.user._id);
  post
    //모델의 Post 블루프린트에서 정의한 create() 함수를 호출한다. 이 메서드는 프로미스를 리턴하도록 되어있다
    // 프로미스 해결 여부에 따라서 then / catch
    .create()
    .then(function () {
      res.send("New post created.");
    })
    .catch(function (errors) {
      res.send(errors);
    });
};
