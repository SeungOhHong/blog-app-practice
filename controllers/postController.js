const Post = require("../models/Post");

exports.viewCreateScreen = function (req, res) {
  res.render("create-post");
};

exports.create = function (req, res) {
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

// 유저가 생성한 게시물에 view 요청에 대한 응답 함수이다
// post 모델로 가서 DB에 저장된 데이터를 찾아와야한다
// post 모델이 프로미스를 리턴할 때까지 얼마나 걸릴지 모르기 때문에 비동기로 동작해야한다
exports.viewSingle = async function (req, res) {
  // try & catch 구문을 이용하여 비동기로 처리한다
  try {
    // 현재 우리가 하려는 일은 단일 게시물을 ID로 찾아서 반환하는 것이다.
    // findSingleById() 라는 메서드를 정의해준다 . () 안에는 라우터에서 셋업한 해당 게시물 id가 전달될 것이다
    // 해당 함수는 프로미스를 리턴하도록 모델의 Post.js 정의할 것이다
    let post = await Post.findSingleById(req.params.id);
    // 유저가 해당 게시물 id의 url 에 접근하면 single-post-screen EJS 템플릿을 렌더한다
    // 두번째 파라미터에 위에서 정의한, DB에서 id로 불러온 객체 데이터(post)를 post 프로퍼티(HTML 템플릿)에 전달해준다
    res.render("single-post-screen", { post: post });
  } catch {
    // 프로미스가 해결되지 않았을 경우 에러메세지
    res.send("404 template will go here.");
  }
};
