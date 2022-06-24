import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.PASSWORD, typeof process.env.USER);
var connection: any = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "todos",
});

connection.connect((err: any) => {
  if (!err) {
    console.log("Connected to the database.");
  } else {
    console.log(err);
  }
});

export default connection;
