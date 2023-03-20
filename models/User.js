// 이제 유저가 로그인 창에 입력한 정보가 DB에 저장된 정보와 일치 하는지 검사를 해야한다
// 새로운 라우트를 추가한다
const usersCollection = require("../db").collection("users");
const validator = require("validator");

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
  if (this.data.password.length > 100) {
    this.errors.push("Password cannot exceed 100 characters.");
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("Username must be at least 3 characters.");
  }
  if (this.data.username.length > 30) {
    this.errors.push("Username cannot exceed 30 characters.");
  }
};

// login 메서드를 정의해준다
User.prototype.login = async function (callback) {
  // 입력된 값이 string인지 확인
  this.cleanUp();
  // userCollection 은 우리가 CRUD 작업을 할 몽고 DB 내의 DB 컬렉션이다
  // findOne({a})  a 에 우리가 몽고 DB에서 찾는 객체 데이터를 정의해준다.
  // 이 데이터를 찾는데 얼마나 거릴지 모르기 때문에 비동기로 처리해준다

  const attemptedUser = await usersCollection.findOne({
    username: this.data.username,
  });
  // 만약 매칭되는 유저 네임과 그에 해당하는 비밀번호를 찾았을 경우
  if (attemptedUser && attemptedUser.password == this.data.password) {
    // 축하합니다!
    callback("Congrats!");
  } else {
    // 유효하지 않음!
    callback("Invalid username / password.");
  }
};

// 이제 로그인 성공여부에 따라서 브라우저에서 해당 메세지를 콜백해준다
User.prototype.register = function () {
  // Step #1: Validate user data
  this.cleanUp();
  this.validate();

  // Step #2: Only if there are no validation errors
  // then save the user data into a database
  if (!this.errors.length) {
    usersCollection.insertOne(this.data);
  }
};

module.exports = User;
