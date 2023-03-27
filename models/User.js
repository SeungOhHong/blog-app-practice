const bcrypt = require("bcryptjs");
const usersCollection = require("../db").db().collection("users");
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
  // DB 관련 로직을 비동기로 처리하기 위해서 async 키워드를 이용한다
  return new Promise(async (resolve, reject) => {
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

    // 사용자 이름이 valid 할 때에만 DB상에 이미 존재하는 이름인지 체크한다
    if (
      // 이 세가지의 조건을 만족할 떄에만
      this.data.username.length > 2 &&
      this.data.username.length < 31 &&
      validator.isAlphanumeric(this.data.username)
    ) {
      // DB로 이미 존재하는지 체크한다 (findOne() 메서드)
      // DB에 접근하는 작업은 비동기로 처리해야한다. findOne 메서드는 promise를 리턴한다. await 키워드를 이용한다
      let usernameExists = await usersCollection.findOne({
        // 컬렉션 안에 해당 username이 존재하는지 findOne 한다
        username: this.data.username,
      });
      // 만약 존재할 경우 errors 배열에 에러 메세지를 추가한다
      if (usernameExists) {
        this.errors.push("이미 존재하는 사용자명입니다.");
      }
    }

    // valid한 이메일에 한해서만 DB에 접근해서 중복체크를 한다
    if (validator.isEmail(this.data.email)) {
      // await 키워드로 비동기 처리
      let emailExists = await usersCollection.findOne({
        email: this.data.email,
      });
      if (emailExists) {
        this.errors.push("이미 존재하는 이메일입니다");
      }
    }
    resolve();
  });
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
  // async 키워드
  return new Promise(async (resolve, reject) => {
    // Step #1: Validate user data
    this.cleanUp();
    // validate 함수를 비동기 처리했기 때문에 await 키워드를 추가해준다
    await this.validate();

    // Step #2: Only if there are no validation errors
    // then save the user data into a database
    if (!this.errors.length) {
      // hash user password
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      await usersCollection.insertOne(this.data);
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

module.exports = User;
