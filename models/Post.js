const postsCollection = require("../db").db().collection("posts");
const ObjectID = require("mongodb").ObjectID;

let Post = function (data, userid) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
};

Post.prototype.cleanUp = function () {
  if (typeof this.data.title != "string") {
    this.data.title = "";
  }
  if (typeof this.data.body != "string") {
    this.data.body = "";
  }

  // get rid of any bogus properties
  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createdDate: new Date(),
    author: ObjectID(this.userid),
  };
};

Post.prototype.validate = function () {
  if (this.data.title == "") {
    this.errors.push("You must provide a title.");
  }
  if (this.data.body == "") {
    this.errors.push("You must provide post content.");
  }
};

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      // save post into database
      postsCollection
        .insertOne(this.data)
        .then(() => {
          resolve();
        })
        .catch(() => {
          this.errors.push("Please try again later.");
          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};

// Post 함수에 대한 메서드를 정의해준다
Post.findSingleById = function (id) {
  // findOne이 비동기로 처리돼야하므로 async
  return new Promise(async function (resolve, reject) {
    // 만약 id가 문자열이 아닐 경우 => 위협적인 접근을 차단 ex) 객체
    // 혹은  !ObjectID.isValid(id) 일 때
    // ObjectID 함수는 몽고DB에서 유저 게시물에 대한 id를 생성한다
    // isValid(id) 메서드는 요청으로 들어온 id가 유효한 id라면 true를 반환할 것이다
    // ! 이 붙었기 때문에 유효하지 않을 경우에
    if (typeof id != "string" || !ObjectID.isValid(id)) {
      // reject() 한다
      reject();
      // 또한 findSingleById 함수에 대한 연산을 종료한다(굳이 DB로 접근할 이유가 없기 때문에)
      return;
    }

    // 요청으로 들어온 id가 안전하고 유효한 한 id 라면 그제서야 DB로 접근한다
    // DB의 컬렉션(postsCollection)에 접근해서 해당 id의 도큐먼트 객체 를 findOne 해온다
    // postsCollection.findOne({찾는 id 객체})

    // 또한 아래의 조건절은 DB에서 id값으로 findOne 해오는 작업이 끝나기 전까지 실행되어서는 안되므로
    // post 함수가 프로미스를 반환하도록 await 키워드로 감싸준다(위에도 async로 감싸준다)
    let post = await postsCollection.findOne({ _id: new ObjectID(id) });

    // 만약 해당 id의 post를 찾았다면
    if (post) {
      // 해결
      resolve(post);
    }
    // post 변수가 empty한 상태라면 (찾지 못했다면)
    else {
      // 거절
      reject();
    }
  });
};

module.exports = Post;
