/* 세션 데이터를 서버의 메모리에 저장하고 있었기 때문에 서버가 종료되거나 재시작될 때마다 해당 세션 데이터가 모두 손실됩니다.
세션 데이터를 MongoDB 데이터베이스에 저장하도록 설정해 보겠습니다.
이를 통해 세션 데이터를 손실하지 않고 노드 서버를 다시 시작할 수 있습니다. */

const express = require("express");
const session = require("express-session");
// npm install connect-mongo
// 세션옵션을 사용하기 위한 connect-mongo 패키지를 임포트한다
const MongoStore = require("connect-mongo");
const app = express();

let sessionOptions = session({
  secret: "JavaScript is sooooooooo coool",
  // 기본적으로 세션 데이터는 서버 메모리에 저장되는 것이 디폴트이지만
  // 해당 데이터를 몽고DB에 저장하기 위해서 store 프로퍼티를 추가해준다
  // 우리는 이미 DB에 연동하는 파일을 생성하였기 때문에
  // MongoStore.create() 안에 {}객체 임포트 해주면 된다

  // 하지만 현재 MongoDB 클라이언트가 아닌 데이터베이스를 내보내도록 설정되어 있기 떄문에
  // 이제 db.js 파일로 가서 픽스해준다
  store: MongoStore.create({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

app.use(sessionOptions);

const router = require("./router");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", router);

module.exports = app;
