var createError = require("http-errors");
var express = require("express");
var http = require("http");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var expressSession = require("express-session");
var logger = require("morgan");
const bcrypt = require("bcrypt");
const saltRounds = 10; // 솔트 라운드 수

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
    cookie: { maxAge: 18000000 /*secure: true*/ },
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

/* 로그인 */

app.post("/users/login_process", (req, res) => {
  const { username, password } = req.body;

  // 데이터베이스에서 해당 사용자의 해시된 비밀번호를 가져옵니다.
  const query = `SELECT * FROM users WHERE username = '${username}';`;
  connection.query(query, (err, rows) => {
    if (err) {
      const failMessage =
        "An error occurred while retrieving user information.";
      res.json({ message: failMessage, login: false });

      throw err;
    } else if (req.session.user) {
      // 세션에 사용자가 이미 로그인한 경우
      const failMessage = "You are already logged in.";

      res.json({ message: failMessage, login: false });
    } else if (rows.length === 0) {
      // 사용자 정보를 찾을 수 없는 경우
      const failMessage = "User not found.";
      res.json({ message: failMessage, login: false });
    } else {
      // 데이터베이스에서 가져온 해시된 비밀번호
      const storedHashedPassword = rows[0].password;
      const email = rows[0].email;
      // 저장된 해시된 비밀번호와 사용자가 입력한 비밀번호를 비교
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          const failMessage = "An error occurred during password comparison.";
          res.json({ message: failMessage, login: false });
        } else if (result) {
          // 비밀번호 일치
          const successMessage = "Login success";
          req.session.user = {
            id: username,
            password: storedHashedPassword,
            email: email, // 또는 원하는 기타 사용자 정보
            authorized: true,
          };

          res.json({
            message: successMessage,
            data: req.session.user,
            login: true,
          });
        } else {
          // 비밀번호 불일치
          const failMessage = "Incorrect password.";
          res.json({ message: failMessage, login: false });
        }
      });
    }
  });
});

/* 로그아웃 */

app.get("/users/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        const failMessage = "Error occured deleting session.";

        res.json({ message: failMessage });
        return;
      }

      const successMessage = "Logout Success.";
      res.json({ message: successMessage });
    });
  } else {
    const failMessage = "You need to login.";
    res.json({ message: failMessage });
    res.redirect("/login/modal");
  }
});

app.get("/api/getSessionUser", (req, res) => {
  if (req.session.user) {
    // 세션에 사용자 정보가 있는 경우
    const user = req.session.user.id;
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
