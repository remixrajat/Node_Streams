"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const todos_1 = __importDefault(require("./routes/todos"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(todos_1.default);
app.use("/", (req, res) => {
    const stream = fs_1.default.createReadStream(`${__dirname}/data.txt`);
    stream.pipe(res);
    console.log(res);
});
const port = 8000;
app.listen(port, () => {
    console.log("Server started");
});
// function getKey(key: string) {
//   return `new key ${key}`;
// }
// const data = {
//   id: 1,
//   name: "Hello",
// };
// data[getKey("math")] = true;
