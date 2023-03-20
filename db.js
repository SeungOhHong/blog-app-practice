// 몽고 DB와 연결한다
// npm install mongodb

// 패키지 디스트럭쳐링
const { MongoClient } = require("mongodb");

const client = new MongoClient(
  // 커넥션 스트링(계정이랑 연결)
  "mongodb+srv://soba:soba@cluster0.ffsbwec.mongodb.net/ComplexApp?retryWrites=true&w=majority"
);

// 커넥션을 생성하는데에 얼마나 걸릴지 모르기 때문에 비동기로 처리해준다
async function start() {
  await client.connect();
  // DB에 연결된 객체를 반환한다 이제 이 파일을 다른 파일에서 임포트하면 그 객체를 반환한다
  module.exports = client.db();
  // app.js를 임포트해준다
  const app = require("./app");
  // 이제 package.json으로 가서 npm run watch 로 모니터하는 파일을 db.js 로 수정해준다
  app.listen(8080);
}

start();
