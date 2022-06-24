"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const apis_1 = __importDefault(require("./routes/apis"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(apis_1.default);
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
