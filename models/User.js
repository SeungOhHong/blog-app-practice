const validator = require("validator");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

// cleanUp 함수를 상속 시켜준다(유효성 검사 전에 미리 정돈)
User.prototype.cleanUp = function () {
  // typeof 함수는 해당 값의 타입을 반환한다
  // 만약 문자열이 아니라면
  if (typeof this.data.username != "string") {
    // 유효성 검사 이전에 문자열이 아닌 값을 미리 공백으로 대체해서 무시해준다
    // validation 함수가 불필요하게 체크하는 것을 방지
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  // 만약 모두 문자열이라면
  // get rid of any bogus properties (data 속성을 덮어씌워서 제거해버린다)
  this.data = {
    // 만약 color : red 와 같은 속성이 있다면 제거해버린다
    // 동시에 불필요한 공백을 트림하고 소문자로 바꿔준다
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

User.prototype.register = function () {
  // cleanup 메서드를 추가해준다
  // Step #1: Validate user data
  this.cleanUp();
  this.validate();

  // Step #2: Only if there are no validation errors
  // then save the user data into a database
};

module.exports = User;
