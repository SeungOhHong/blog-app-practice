const postsCollection = require("../db").db().collection("posts");
// 몽고 DB 패키지에서는 ID값을 다루기 위해서 ObjectId 함수를 제공한다
const ObjectId = require("mongodb").ObjectId;

// 두번째 파라미터로 userid를 넘겨준다
let Post = function (data, userid) {
  this.data = data;
  this.errors = [];
  // 남겨받은 userid를 참조한다
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
    // 현재 세션에 저장된 사용자 id를 참조한다. 몽고DB 패키지에서 제공하는 메서드를 활용한다. 메서드는 ID 객체를 리턴한다
    author: new ObjectId(this.userid),
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

module.exports = Post;
