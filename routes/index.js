var express = require("express");
var router = express.Router();
var fs = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

const mysql = require("mysql");
const dbconfig = require("../config/database.js");
const connection = mysql.createConnection(dbconfig);

const upload = require("./upload");
var url = require("url");
var qs = require("querystring");

/* GET home page. */
router.get("/", function (req, res, next) {
  const query = "SELECT * FROM diary_table";
  connection.query(query, (err, rows) => {
    if (err) {
      throw err;
    }
    const query2 =
      "SELECT * FROM diary_table ORDER BY viewCnt DESC LIMIT 0, 5;";
    connection.query(query2, (err2, rows2) => {
      if (err2) {
        throw err2;
      }

      const query3 =
        "SELECT * FROM diary_table ORDER BY diary_date DESC LIMIT 0, 5;";
      connection.query(query3, (err3, rows3) => {
        if (err3) {
          throw err3;
        }

        res.render("index", {
          title: res.locals.title,
          notice: res.locals.notice,
          data: rows,
          data2: rows2,
          data3: rows3,
        });
      });
    });
  });
});

router.get("/diary", function (req, res, next) {
  const query = "SELECT * FROM diary_table";
  connection.query(query, (err, rows) => {
    if (err) {
      throw err;
    }
    const diary_id = req.query.diary_id;
    const query2 = `SELECT * FROM diary_table WHERE id=${diary_id}`;
    connection.query(query2, (err2, rows2) => {
      if (err2) {
        throw err2;
      }
      const imagePathfromdb = `${rows2[0].filepath}`;
      const imagePath = `${imagePathfromdb.replace("public", "")}`;
      const date = new Date(rows2[0].diary_date); // data2[0].diary_date는 날짜 데이터
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();

      const ndate = new Date(rows2[0].diary_date_updated); // data2[0].diary_date는 날짜 데이터
      const nyear = ndate.getFullYear();
      const nmonth = ndate.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
      const nday = ndate.getDate();
      const nhour = ndate.getHours();
      const nminute = ndate.getMinutes();

      const query3 = `UPDATE diary_table SET viewCnt = viewCnt + 1 WHERE id=${diary_id}`;
      connection.query(query3, (err3, rows3) => {
        if (err3) {
          throw err3;
        }

        res.render("diary", {
          title: res.locals.title,
          notice: res.locals.notice,
          data: rows,
          data2: rows2,
          date: date,
          year: year,
          month: month,
          day: day,
          hour: hour,
          minute: minute,

          ndate: ndate,
          nyear: nyear,
          nmonth: nmonth,
          nday: nday,
          nhour: nhour,
          nminute: nminute,

          imagePath: imagePath,
        });
      });
    });
  });
});

router.get("/create", function (req, res, next) {
  const query2 = `SELECT * FROM diary_table`;
  connection.query(query2, (err2, rows2) => {
    if (err2) {
      throw err2;
    }
    res.render("create_form", {
      title: res.locals.title,
      notice: res.locals.notice,
      data: rows2,
    });
  });
});

router.post(
  "/create_process",
  upload.single("create_fileupload"),
  function (req, res, next) {
    // Set up a route for file uploads
    // Handle the uploaded file
    if (req.file) {
      var filePath = req.file.path;
      var originalname = req.file.originalname;
    }
    console.log("File upload Successful!");

    const { create_title, create_text, create_category } = req.body; // 폼에서 전송된 데이터를 읽어옴

    // title 및 text를 이용하여 diary_table에 새로운 레코드를 삽입
    const query = `INSERT INTO diary_table (diary_title, diary_date, diary_text, diary_category, filename, filepath) 
  VALUES (?, NOW(),?,?,?,?)`;
    connection.query(
      query,
      [create_title, create_text, create_category, originalname, filePath],
      (err, rows) => {
        if (err) {
          throw err;
        } else {
          // 삽입이 성공하면 다른 페이지로 리다이렉트 또는 메시지를 표시
          res.redirect("/diary_list?category=전체보기"); // 홈페이지로 리다이렉트
        }
      }
    );
  }
);

router.post("/delete_process", function (req, res, next) {
  const diary_id = parseInt(req.body.diary_id); // req.body에서 diary_id를 추출
  const query2 = `SELECT * FROM diary_table WHERE id = ${diary_id}`;
  connection.query(query2, (err2, rows2) => {
    if (err2) {
      throw err2;
    }
    if (rows2[0].filepath != null) {
      var filePath = `public/images/${rows2[0].filepath.replace(
        "publicimages",
        ""
      )}`;
    }
    if (fs.existsSync(filePath)) {
      console.log("file exists");
      // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
      try {
        fs.unlinkSync(filePath);
        console.log("image delete");
      } catch (error) {
        console.log(error);
      }
    }
    const query = `DELETE FROM diary_table WHERE id = ${diary_id}`;
    connection.query(query, (err) => {
      if (err) {
        throw err;
      }

      // 삭제가 성공하면 다른 페이지로 리다이렉트 또는 메시지를 표시
      res.redirect("/diary_list?category=전체보기"); // 홈페이지로 리다이렉트
    });
  });
});

router.get("/update_form", function (req, res, next) {
  const diary_id = req.query.diary_id;
  const query2 = `SELECT * FROM diary_table WHERE id=${diary_id}`;
  connection.query(query2, (err2, rows2) => {
    if (err2) {
      throw err2;
    }
    const query = `SELECT * FROM diary_table`;
    connection.query(query, (err, rows) => {
      if (err) {
        throw err;
      }
      res.render("update_form", {
        title: res.locals.title,
        notice: res.locals.notice,
        data: rows,
        data2: rows2,
      });
    });
  });
});

router.post(
  "/update_process",
  upload.single("create_fileupload"),
  function (req, res, next) {
    const {
      update_title,
      update_textarea,
      update_id,
      update_category,
      update_filename,
      update_filepath,
    } = req.body; // 폼에서 전송된 데이터를 읽어옴
    const update_IntId = parseInt(update_id);
    // Set up a route for file uploads
    var filePathFromDB = update_filepath.replace("publicimages", "");
    var filePath = `public/images/${update_filepath.replace(
      "publicimages",
      ""
    )}`;
    var originalname = update_filename;
    console.log(req.file);
    // Handle the uploaded file
    if (req.file != undefined) {
      var newFilePath = req.file.path;
      var newOriginalname = req.file.originalname;
      console.log("File upload Successfully!");
    } else {
      newFilePath = filePathFromDB;
      newOriginalname = originalname;
    }
    // update_title과 update_text 내의 작은 따옴표를 이스케이프
    const escapedUpdateTitle = update_title.replace(/'/g, "''");
    const escapedUpdateText = update_textarea.replace(/'/g, "''");

    const query = `
  UPDATE diary_table
  SET diary_title = ?, diary_text = ?, diary_category = ?,
  diary_date_updated = NOW(), filename = ?, filepath = ?
  WHERE id = ?;`;
    connection.query(
      query,
      [
        escapedUpdateTitle,
        escapedUpdateText,
        update_category,
        newOriginalname,
        newFilePath,
        update_IntId,
      ],
      (err, rows) => {
        if (err) {
          throw err;
        }
        if (
          fs.existsSync(filePath) &&
          req.file != undefined &&
          update_filepath.replace("publicimages", "") != null
        ) {
          // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
          try {
            fs.unlinkSync(filePath);
            console.log("image delete");
          } catch (error) {
            console.log(error);
          }
        }
        // 삽입이 성공하면 다른 페이지로 리다이렉트 또는 메시지를 표시
        res.redirect(`/diary?diary_id=${update_id}`); // 홈페이지로 리다이렉트
      }
    );
  }
);

/*관리자 전용 공지사항 페이지*/
router.get("/admin_update_form", function (req, res, next) {
  const diary_id = req.query.diary_id;
  const query2 = `SELECT * FROM diary_table WHERE id=19`;
  connection.query(query2, (err2, rows2) => {
    if (err2) {
      throw err2;
    }
    const query = `SELECT * FROM diary_table`;
    connection.query(query, (err, rows) => {
      if (err) {
        throw err;
      }
      res.render("admin_update_form", {
        title: res.locals.title,
        notice: res.locals.notice,
        data: rows,
        data2: rows2,
      });
    });
  });
});

router.post("/update_process_for_admin", function (req, res, next) {
  const { update_title, update_text, update_id, update_category, notice } =
    req.body; // 폼에서 전송된 데이터를 읽어옴

  const query = `
  UPDATE diary_table
  SET diary_title = '${update_title}', diary_text='${update_text}', diary_category = '${update_category}',
  diary_date_updated = NOW(), notice='${notice}'
  WHERE id = 19;`;
  connection.query(query, (err, rows) => {
    if (err) {
      throw err;
    }
    // 삽입이 성공하면 다른 페이지로 리다이렉트 또는 메시지를 표시
    res.redirect(`/diary?diary_id=${update_id}`); // 홈페이지로 리다이렉트
  });
});

router.get("/diary_list", function (req, res, next) {
  const category_selector = req.query.category;
  const query2 = `SELECT * FROM diary_table`;
  connection.query(query2, (err2, rows2) => {
    if (err2) {
      throw err2;
    }

    if (category_selector === "전체보기") {
      var getAllIndex = `SELECT COUNT(*) as totalcount FROM diary_table;`;
    } else {
      getAllIndex = `SELECT COUNT(*) as totalcount FROM diary_table WHERE diary_category='${category_selector}';`;
    }
    connection.query(getAllIndex, (err3, rows3) => {
      if (err3) {
        throw err3;
      }
      const totalCount = rows3[0].totalcount;

      var curindex = parseInt(req.query.page);
      const pageSize = 5;
      const DEFAULT_START_INDEX = 1;

      if (!curindex || curindex <= 0) {
        curindex = DEFAULT_START_INDEX;
      }
      if (!pageSize || pageSize <= 0) {
        pageSize = DEFAULT_PAGE_SIZE;
      }
      const startIndex = (curindex - 1) * pageSize;

      if (category_selector === "전체보기") {
        var query4 = `SELECT * FROM diary_table ORDER BY diary_date DESC
        LIMIT ${startIndex},${pageSize}`;
      } else {
        query4 = `SELECT * FROM diary_table WHERE diary_category='${category_selector}' ORDER BY diary_date DESC
      LIMIT ${startIndex},${pageSize}`;
      }
      connection.query(query4, (err4, rows4) => {
        if (err4) {
          throw err4;
        }
        res.render("diary_list", {
          title: res.locals.title,
          notice: res.locals.notice,
          data2: rows2,
          data4: rows4,
          AllIndex: totalCount,
          pageSize: pageSize,
          curindex: curindex,
          category: category_selector,
        });
      });
    });
  });
});

app.get("/diary_list_endpoint", function (req, res) {
  const category_selector = req.query.category;
  if (category_selector === "전체보기") {
    var query = `SELECT * FROM diary_table ORDER BY diary_date DESC
    LIMIT ${startIndex},${pageSize}`;
  } else {
    query = `SELECT * FROM diary_table WHERE diary_category='${category_selector}' ORDER BY diary_date DESC
  LIMIT ${startIndex},${pageSize}`;
  }
  connection.query(query, (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

router.get("/profile", function (req, res, next) {
  if (req.session.user) {
    const { id, password, email } = req.session.user; // 폼에서 전송된 데이터를 읽어옴
    console.log(req.session.user);
    res.render("profile", { id: id, password: password, email: email });
  } else if (!req.session.user) {
    const failMessage = "You need to login.";
    res.json({ message: failMessage, login: false });
  }
});

router.get("/profile_update", function (req, res, next) {
  if (req.session.user) {
    const { id, password, email } = req.session.user; // 폼에서 전송된 데이터를 읽어옴

    res.render("profile_update_form", {
      id: id,
      password: password,
      email: email,
    });
  } else if (!req.session.user) {
    const failMessage = "You need to login.";
    res.json({ message: failMessage, login: false });
  }
});

router.post("/profile_update_process", function (req, res, next) {
  const { update_profile_id, update_profile_password, update_profile_email } =
    req.body; // 폼에서 전송된 데이터를 읽어옴

  bcrypt.hash(update_profile_password, saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
      return;
    }
    const query = `
    UPDATE users
    SET password = '${hash}', email='${update_profile_email}'
    WHERE username = '${update_profile_id}';`;
    connection.query(query, (err, rows) => {
      if (err) {
        throw err;
      }
      // 삽입이 성공하면 다른 페이지로 리다이렉트 또는 메시지를 표시
      res.redirect(`/`); // 홈페이지로 리다이렉트
    });
  });
});

router.get("/visitors_book", function (req, res, next) {
  var getAllIndex = `SELECT COUNT(*) as totalCount FROM visitor_table`;
  if (req.session.user) {
    var userId = req.session.user.id;
    console.log(userId);
  } else {
    userId = null;
  }
  connection.query(getAllIndex, (err2, rows2) => {
    if (err2) {
      throw err2;
    }
    const totalCount = rows2[0].totalCount;
    console.log(totalCount);
    var curindex = parseInt(req.query.page);
    const pageSize = 10;
    const DEFAULT_START_INDEX = 1;
    console.log(curindex);
    if (!curindex || curindex <= 0) {
      curindex = DEFAULT_START_INDEX;
    }
    if (!pageSize || pageSize <= 0) {
      pageSize = DEFAULT_PAGE_SIZE;
    }
    const startIndex = (curindex - 1) * pageSize;
    const query = `SELECT * FROM visitor_table ORDER BY date DESC
    LIMIT ${startIndex}, ${pageSize}`;
    connection.query(query, (err, rows) => {
      if (err) {
        throw err;
      }
      res.render("visitors_book", {
        userId: userId,
        data: rows,
        data2: rows2,
        AllIndex: totalCount,
        pageSize: pageSize,
        curindex: curindex,
      });
    });
  });
});

router.post("/visitors_book_upload_process", function (req, res, next) {
  if (req.session.user) {
    var user = req.session.user.id;
    const text = req.body.visitors_book_upload_text;
    const query = `INSERT INTO visitor_table(writer, text, date) VALUES(?, ? ,NOW())`;
    console.log(text)
    console.log(typeof text)
    connection.query(query, [user, text], (err, rows) => {
      if (err) {
        throw err;
      }
      res.redirect(`/visitors_book?page=1`); // 홈페이지로 리다이렉트
    });
  } else {
    const message = "You need to login.";
    res.json({ message: message, login: false });
  }
});

router.post("/visitors_book_delete_process", function (req, res, next) {
  const visitors_book_id = parseInt(req.body.visitors_book_id); // req.body에서 diary_id를 추출
  console.log(visitors_book_id)
    const query = `DELETE FROM visitor_table WHERE id = ${visitors_book_id}`;
    connection.query(query, (err) => {
      if (err) {
        throw err;
      }

      // 삭제가 성공하면 다른 페이지로 리다이렉트 또는 메시지를 표시
      res.redirect("/visitors_book??page=1"); // 홈페이지로 리다이렉트
    });
  });

module.exports = router;
