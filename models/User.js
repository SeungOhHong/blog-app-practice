const bcrypt = require("bcryptjs");
const usersCollection = require("../db").db().collection("users");
const validator = require("validator");
// md5 패키지를 임포트해준다
const md5 = require("md5");

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

    // Only if username is valid then check to see if it's already taken
    if (
      this.data.username.length > 2 &&
      this.data.username.length < 31 &&
      validator.isAlphanumeric(this.data.username)
    ) {
      let usernameExists = await usersCollection.findOne({
        username: this.data.username,
      });
      if (usernameExists) {
        this.errors.push("That username is already taken.");
      }
    }

    // Only if email is valid then check to see if it's already taken
    if (validator.isEmail(this.data.email)) {
      let emailExists = await usersCollection.findOne({
        email: this.data.email,
      });
      if (emailExists) {
        this.errors.push("That email is already being used.");
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
          // 아바타는 이메일과 연동 돼있기 때문에 이메일을 가져와야한다
          // 사용자가 로그인할 사용자 이름과 암호만 입력하고 메일 주소는 입력하지 않았기 때문에 getAvatar 함수를 호출하기 전에 사용자의 메일 주소가 객체에 있는지 확인해야한다. 데이터베이스에서 해당 사용자 계정과 관련된 메일을 가져와야 합니다.
          this.data = attemptedUser;
          // 로그인에 성공할 경우에 객체 내부에 avatar 프로퍼티가 추가된다
          this.getAvatar();
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
  return new Promise(async (resolve, reject) => {
    // Step #1: Validate user data
    this.cleanUp();
    await this.validate();

    // Step #2: Only if there are no validation errors
    // then save the user data into a database
    if (!this.errors.length) {
      // hash user password
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      await usersCollection.insertOne(this.data);
      // 회원가입에 성공할 경우에도 유저 객체 안에 avatar 프로퍼티가 추가된다
      // 해당 라인을 DB에 데이터를 저장한 이후에 넣는 이유는
      // 아바타 url을 DB에 영구적으로 저장할 것이 아니기 때문이다
      // 만약 아타바를 제공하는 사이트의 url이 변경되면 곤란해지기 때문이다
      // 때문에 필요할 때에 url을 바로 생성하도록 하는 것이 좋다
      // 이제 DB에 영구저장 되는 것이 아니라 메모리 상의 user 객체에 저장된다
      this.getAvatar();
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

// 아바타를 가져오는 새로운 함수를 생성한다
User.prototype.getAvatar = function () {
  // 객체에 새로운 avatar 프로퍼티를 추가한다
  // `https://gravatar.com/avatar/email?s=128`;
  // 이 기본 형식에서 email을 md5 라이브러리를 이용해서 해싱한 후에
  // 현재 사용자의 이메일로 바꿔주는 것이다
  // npm install md5
  // md5(현재 사용자)
  this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`;
};

module.exports = User;
