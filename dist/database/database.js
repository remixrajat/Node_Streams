"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.PASSWORD, typeof process.env.USER);
var connection = mysql_1.default.createConnection({
    host: "localhost",
    port: 3307,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "todos",
});
connection.connect((err) => {
    if (!err) {
        console.log("Connected to the database.");
    }
    else {
        console.log(err);
    }
});
exports.default = connection;
