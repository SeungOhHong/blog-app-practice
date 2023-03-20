// dotenv 패키지를 임포트해준다
const dotenv = require("dotenv");
// config 메서드를 호출하면 .env 파일에서 정의한 값들을 불러온다
dotenv.config();
const { MongoClient } = require("mongodb");

// 기술적으로 커넥션 스트링을 db.js 에 하드코딩해도 작동은하지만
// 깃헙 같은 곳에 올리면 보안상으로 문제가 생긴다
//  앱이 실행 중인 환경에 따라 다른 데이터베이스에 연결하도록 해준다
// 바로 여기서 환경 변수라고 불리는 것을 사용한다.
// .env 파일을 생성해준다
// npm install dotenv
// 노드 js 환경에서 환경변수에 접근하는 방법은 process.env.환경변수명 이다
const client = new MongoClient(process.env.CONNECTIONSTRING);

async function start() {
  await client.connect();
  module.exports = client.db();
  const app = require("./app");
  // 포트번호도 환경변수로 관리해준다. 포트번호를 환경변수로 관리하는 이유는
  // 왜냐하면 로컬환경에서는 포트번호를 여기서 관리해도 되지만 실제 환경에서는 다른 포트 번호를 리스닝 해야할 수 있기 때문이다.
  // 또한 보안면에서도 좋다.  .env 파일은 깃레퍼지토리에 업로드 하지 않는다
  // process.env.PORT 로 접근한다
  app.listen(process.env.PORT);
}

start();

// 환경변수를 이용하는 것의 장점?
/* 
이렇게 하면 실제 코드를 변경할 필요 없이 개별 환경 변수를 관리할 수 있습니다.
이렇게 하면 중요한 값이 하드 코딩되지 않습니다.
이제 ENV 파일에 모든 종류의 것을 보관할 수 있습니다.
예를 들어, 타사 앱에 연결하는 데 사용하는 비밀 API 키가 같은 것들이다
 Heroku와 같은 실제 호스팅 환경으로 앱을 푸시할 때 이러한 환경 변수를 수동으로 추가하면 Heroku의 대시보드 내에서 또는 간단한 명령줄 명령을 사용하여 설정할 수 있습니다.

*/
