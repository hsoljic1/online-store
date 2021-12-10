const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "D1v4lYVGTG",
  connectionLimit: 2,
});

const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      connection.query(sql, params, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
        connection.release();
      });
    });
  });
};

module.exports = {
  query,
};
