const express = require('express');
const mysql = require('mysql');
const app = express();
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);


connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

app.get('/data', (req, res) => {
  const query = 'SELECT * FROM your_table_name';
  connection.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.send(results);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = router;