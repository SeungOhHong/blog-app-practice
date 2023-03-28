// DB에 접근하기 위해서 DB연동파일을 임포트해준다. collection("posts") 우리가 저장한 컬렉션 이름은 posts 이다
const postsCollection = require("../db").db().collection("posts");
const ObjectId = require("mongodb").ObjectId;

// 컨트롤러는 객체를 생성하기 위해서 이 생성자 함수를 이용할 것이다
// 그리고 유저가 제출한 폼 데이터인 req.body를 전달받고 있다. 이것을 data 파라미터로 받아준다
// data = req.body
let Post = function (data, userid) {
  // 이제 유저가 제출한 데이터를 바탕으로 post 가 생성된다
  this.data = data;
  this.errors = [];
  this.userid = userid;
};

// 1. 클린업 메서드
Post.prototype.cleanUp = function () {
  // 문자열만 입력값으로 받는다
  if (typeof this.data.title != "string") {
    this.data.title = "";
  }
  if (typeof this.data.body != "string") {
    this.data.body = "";
  }

  // get rid of any bogus properties
  this.data = {
    // trim 으로 앞 뒤 불필요한 공백 제거
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    // 생성일자
    createdDate: new Date(),
    author: new ObjectId(this.userid),
  };
};

// 2. 유효성 검사 메서드
Post.prototype.validate = function () {
  // 제목이 공백일 경우
  if (this.data.title == "") {
    // errors 배열에 에러 푸시
    this.errors.push("제목 입력은 필수입니다");
  }
  if (this.data.body == "") {
    this.errors.push("내용 입력은 필수입니다");
  }
};

// 3. create 메서드를 정의해준다
Post.prototype.create = function () {
  // post 컨트롤러에서 사용하기 위해서 프로미스를 리턴하도록 정의한다
  // new Promise((a,b)=>{}) 의 형태이다
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      // 에러가 없다면
      // DB에 포스트의 데이터를 저장한다 insertOne()
      postsCollection
        .insertOne(this.data)
        // 하지만 DB에 연결해서 데이터가 저장되는 데에 얼마나 걸릴지 모르기 때문에 비동기로 처리해준다
        // then / catch 문법으로 비동기 처리!
        // 이제 제출 버튼을 누르면 DB에 post 컬렉션이 생성되고 유저가 제출한 내용이 저장된다
        .then(() => {
          resolve();
        })
        .catch(() => {
          this.errors.push("Please try again later.");
          reject(this.errors);
        });
    }
    // 에러가 있다면
    else {
      reject(this.errors);
    }
  });
};

// 모듈을 익스포트 해준다
module.exports = Post;
