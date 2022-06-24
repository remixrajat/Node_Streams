// const express = require("express");
import express from "express";
import todosRouter from "./routes/apis";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(todosRouter);
app.use("/", (req, res) => {
  const stream = fs.createReadStream(`${__dirname}/data.txt`);
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
