// npm install validator
// validator 를 임포트 해준다. 이 모듈은 정규식 처럼 유효성 검사를 도와준다
const validator = require("validator");

let User = function (data) {
  this.data = data;
  // 에러 객체를 초기화 한다
  this.errors = [];
};

User.prototype.validate = function () {
  // 만약 유저 이름이 공백이라면
  if (this.data.username == "") {
    // user 객체 내의 errors 배열에 해당 메세지를 푸시한다
    // 유저 컨트롤러로 가서 에러 유무에 따른 상태를 정의해준다
    this.errors.push("You must provide a username.");
  }
  // 만약 문자 혹은 숫자가 아닐 경우에
  if (
    this.data.username != "" &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    // 에러 메세지를 푸시한다
    this.errors.push("Username can only contain letters and numbers.");
  }
  // 만약 validator.isEmail 가 false를 리턴할 경우
  if (!validator.isEmail(this.data.email)) {
    // 에러를 푸시한다
    this.errors.push("You must provide a valid email address.");
  }
  // 패스워드 공백일 경우
  if (this.data.password == "") {
    // 등록 할 수 없다는 에러를 표시한다
    this.errors.push("You must provide a password.");
  }

  // 최소 패스워드 : 만약 패스워드가 0보다 크고 12자 보다 작을 경우에
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    // 등록할 수 없다는 에러를 표시한다
    this.errors.push("Password must be at least 12 characters.");
  }
  // 최대 패스워드 : 패스워드가 100자를 넘는다면
  if (this.data.password.length > 100) {
    // 등록할 수 없다는 에러를 표시한다
    this.errors.push("Password cannot exceed 100 characters.");
  }

  // 최소 이름 자수 : 만약 유저 이름이 0보다 크고 3보다 작다면
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    // 등록 할 수 없다는 에러를 표시한다
    this.errors.push("Username must be at least 3 characters.");
  }
  // 최대 이름 자수 : 만약 유저 이름이 30자를 넘어가면
  if (this.data.username.length > 30) {
    // 등록 할 수 없다는 에러를 표시한다
    this.errors.push("Username cannot exceed 30 characters.");
  }
};

User.prototype.register = function () {
  // 1단계: 유저 데이터 유효성 검사하기
  // 2단계: 유효성에 문제가 없다면 (에러가 없다면) DB에 유저 데이터 저장하기

  // 여기서 this 키워드가 가리키는 것은 유저가 제출한 데이터로 생성되는 user 객체이다
  this.validate();
};

module.exports = User;
