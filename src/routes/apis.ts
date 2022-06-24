import { Router } from "express";
import fs from "fs";
import axios from "axios";
const zlib = require("zlib");
const es = require("event-stream");
const readline = require("readline");
import { Readable } from "node:stream";
import { Transform, Writable } from "node:stream";
const router = Router();

router.get("/readMultiple", async (req: any, res: any, next) => {
  try {
    const fileStream = new Readable({
      read() {},
    });
    async function processLineByLine() {
      const newfileStream = fs.createReadStream(`.././Node_Streams/data.json`);
      const rl = readline.createInterface({
        input: newfileStream,
        crlfDelay: Infinity,
      });
      for await (const line of rl) {
        // console.log(`Line from file: ${line}`);
        fileStream.push(line);
      }

      fileStream.push(null);
    }

    processLineByLine();
    fileStream.pipe(res);

    // const stream = fs.createReadStream(`.././Node_Streams/data.json`, {
    //   highWaterMark: 30,
    // });
    // // stream.pipe(res);
    // let data = "";
    // stream.on("data", (chunk) => {
    //   data += chunk;
    // });
    // const getDataValue = new Promise((resolve) => {
    //   stream.on("end", function () {
    //     resolve(data);
    //   });
    // });
    // let finalData: any = await getDataValue;
    // let parsedObj = JSON.parse(finalData);
    // function getKey(key: any) {
    //   return `${key}`;
    // }
    // function* run() {
    //   for (const item in parsedObj) {
    //     let sendableIte = {
    //       [getKey(item)]: parsedObj[item],
    //     };
    //     yield sendableIte;
    //   }
    // }
    // const readableStream = new Readable({
    //   read() {
    //     for (const data of run()) {
    //       this.push(JSON.stringify(data).concat("\n"));
    //     }
    //     this.push(null);
    //   },
    // });
    // readableStream.pipe(res);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/writeMultiple", async (req: any, res: any, next) => {
  try {
    let i = 1;
    let d = "";
    let count = 0;
    let new_count = 5;
    axios({
      method: "get",
      url: "http://localhost:8000/readMultiple",
      responseType: "stream",
    }).then(function (response) {
      response.data
        .pipe(
          new Transform({
            objectMode: true,
            transform(chunk, enc, cb) {
              cb(null, chunk);
            },
          })
        )
        .pipe(
          new Writable({
            objectMode: true,
            write(chunk, enc, cb) {
              count++;
              // console.log(chunk.toString(), "uuuuuuuuuuuuuuu");
              if (!chunk.toString().startsWith("{")) {
                d += chunk.toString();
              } else {
                new_count = 6;
              }

              const writeStream = fs.createWriteStream(
                `.././Node_Streams/email${i}.txt`,
                {
                  flags: "a",
                }
              );
              if (count >= new_count) {
                writeStream.write(d);
                i++;
                count = 0;
                d = "";
                new_count = 5;
              }

              return cb();
            },
          })
        );
    });

    res.status(200).json({ result: "Success." });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});
export default router;
