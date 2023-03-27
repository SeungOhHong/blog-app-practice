const bcrypt = require("bcryptjs");
// 우리는 usersCollection 변수를 만들고 재사용 가능한 DB 파일을 사용했다.
// 이 db.js파일은 이제 데이터베이스 대신 MongoDB 클라이언트(client)를 내보내고 있기 때문에 이  require 뒤에 .db() 를 추가해줘야한다.
// 이제 몽고DB로 가서 리프레쉬해보면 Session 컬렉션이 생성 되어있을 것이다
// 쿠키를 확인해볼 수 있다
// id는 유니크한 식별값이다

const usersCollection = require("../db").db().collection("users");
const validator = require("validator");

//웹 브라우저가 HTTP 요청을 보낼 때마다 현재 도메인에 대한 모든 쿠키를 함께 보낼 것이기 때문에 이제 서버가 브라우저 세션을 기억하거나 신뢰할 수 있게 된다.
let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  // get rid of any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("You must provide a username.");
  }
  if (
    this.data.username != "" &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push("Username can only contain letters and numbers.");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide a valid email address.");
  }
  if (this.data.password == "") {
    this.errors.push("You must provide a password.");
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("Password must be at least 12 characters.");
  }
  if (this.data.password.length > 50) {
    this.errors.push("Password cannot exceed 50 characters.");
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("Username must be at least 3 characters.");
  }
  if (this.data.username.length > 30) {
    this.errors.push("Username cannot exceed 30 characters.");
  }
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    usersCollection
      .findOne({ username: this.data.username })
      .then((attemptedUser) => {
        if (
          attemptedUser &&
          bcrypt.compareSync(this.data.password, attemptedUser.password)
        ) {
          resolve("Congrats!");
        } else {
          reject("Invalid username / password.");
        }
      })
      .catch(function () {
        reject("Please try again later.");
      });
  });
};

User.prototype.register = function () {
  // Step #1: Validate user data
  this.cleanUp();
  this.validate();

  // Step #2: Only if there are no validation errors
  // then save the user data into a database
  if (!this.errors.length) {
    // hash user password
    let salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    usersCollection.insertOne(this.data);
  }
};

module.exports = User;
