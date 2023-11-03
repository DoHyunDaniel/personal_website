var express = require("express");
var router = express.Router();
var fs = require("fs");

const app = express();

const mysql = require("mysql");
const dbconfig = require("../config/database.js");
const connection = mysql.createConnection(dbconfig);

router.post("/register_process", function (req, res, next) {
  const { username, password, email } = req.body; // 폼에서 전송된 데이터를 읽어옴

  // title 및 text를 이용하여 diary_table에 새로운 레코드를 삽입
  const query = `INSERT INTO users (username, password, email) 
    VALUES ("${username}","${password}","${email}")`;
  connection.query(query, [username, password, email], (err, result) => {
    if (err) {
      const failMessage = "Your ID or email value is duplicated."
      res.json({ message: failMessage, login: false });
    } else {
      // 삽입이 성공하면 다른 페이지로 리다이렉트 또는 메시지를 표시
      const successMessage = "Registration complete.";
      res.json({ message: successMessage, login:true });
    }
  });
});

module.exports = router;
