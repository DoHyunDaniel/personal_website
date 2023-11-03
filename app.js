var createError = require("http-errors");
var express = require("express");
var http = require("http");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var expressSession = require("express-session");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// 미들웨어 설정 부분(다른 곳에 넣으면 실행이 안 됨!!)
app.use(function (req, res, next) {
  res.locals.title = "Daniel's Personal Blog";
  next();
});
// 공통으로 사용할 title 변수를 res.locals에 저장
const mysql = require("mysql");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig);

app.use(function (req, res, next) {
  const query = "SELECT notice FROM diary_table WHERE id = 19"; // 원하는 쿼리 작성
  connection.query(query, (err, rows) => {
    if (err) {
      // 오류 처리
      console.error(err);
      next(err);
    } else {
      // 쿼리 결과에서 notice 값을 res.locals.notice에 저장
      res.locals.notice = rows[0].notice;
      next();
    }
  });
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// 세션세팅
app.use(
  expressSession({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge : 18000000/*secure: true*/ }
  })
);

app.get("/users/login_process", (req, res) => {
  if (req.session.user) {
    // 세션에 유저가 존재한다면
    res.redirect("/"); // 예시로
  } else {
    res.redirect("/login/modal"); // 로그인으로
  }
});

app.post("/users/login_process", (req, res) => {
  console.log("로그인 함수가 실행됩니다.");

  const { username, password } = req.body;
  console.log(username);
  console.log(password);
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}';`;
  connection.query(query, (err, rows) => {
    if (err) {
      const failMessage = "An error occured transporting information.";
      res.json({ message: failMessage, login: false });
      console.log(failMessage);
      throw err;
    } else if (req.session.user) {
      // 세션에 유저가 존재한다면
      const failMessage = "You have been already logged in.";
      console.log("이미 로그인 돼있습니다~");
      res.json({ message: failMessage, login: false });
    } else if (rows.length === 0) {
      const failMessage = "There's no user data.";
      res.json({ message: failMessage, login: false });
      console.log(failMessage);
    } else {
      const successMessage = "Login success";
      console.log(username)
      req.session.user = {
        id: username,
        pw: password,
        email: rows[0].email,
        authorized: true,
      };
      console.log(req.session.user)
      res.json({
        message: successMessage,
        data: req.session.user,
        login: true,
      });
    }
  });
});

app.get("/users/logout", (req, res) => {
  console.log("로그아웃");
  if (req.session.user) {
    console.log("로그아웃중입니다!");
    req.session.destroy((err) => {
      if (err) {
        const failMessage = "Error occured deleting session."
        console.log("세션 삭제시에 에러가 발생했습니다.");
        res.json({message:failMessage})
        return;
      }
      console.log("세션이 삭제됐습니다.");
      const successMessage ="Logout Success.";
      res.json({message:successMessage});
    });
  } else {
    console.log("로그인해 주세요.");
    const failMessage = "You need to login.";
    res.json({message:failMessage})
    res.redirect("/login/modal");
  }
});


app.get('/api/getSessionUser', (req, res) => {
  if (req.session.user) {
    // 세션에 사용자 정보가 있는 경우
    const user = req.session.user.id;
    console.log("api based user data is : "+user);
    res.json({ user });
  } else {
    // 세션에 사용자 정보가 없는 경우
    res.json({ user: null });
  }
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
