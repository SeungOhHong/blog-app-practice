// models 폴더를 생성 후 User.js 파일에서 User 가 제출한 데이터에 대한 생성자 함수를 정의한다
// 유저가 제출한 데이터를 data 라는 인자로 받아준다
// 그리고 생성된 객체는 this 키워드에 의해서 유저가 제출한 해당 데이터를 갖고 새롭게 생성된다
let User = function (data) {
  // this 키워드는 new 키워드로 생성자 함수가 호출되면서 새롭게 생성되는 객체 자기 자신을 가리키게 된다
  this.data = data;
};

// 이제 생성자 함수로 새롭게 생성되는 모든 객체가 이 하나의 동일한 register 함수를 가리키게 된다
User.prototype.register = function () {};

// 익스포트해준다 -> 컨트롤러 파일에 임포트해준다
module.exports = User;
