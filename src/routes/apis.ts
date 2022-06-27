import { Router } from "express";
import fs from "fs";
import axios from "axios";
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
      const newfileStream = fs.createReadStream(`.././Node_Streams/data.jsonl`);
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
    let response = await axios({
      method: "get",
      url: "http://localhost:8000/readMultiple",
      responseType: "stream",
    });

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
            d += chunk.toString() + ",";
            console.log(d);

            const writeStream = fs.createWriteStream(
              `.././Node_Streams/email${i}.json`,
              {
                flags: "a",
              }
            );
            if (count >= new_count && chunk) {
              if (d.slice(-1) === ",") {
                d = d.slice(0, d.length - 1);
              }
              console.log(d);
              writeStream.write(`[${d}]`);
              i++;
              count = 0;
              d = "";
            }

            return cb();
          },
        })
      );

    res.status(200).json({ result: "Success." });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});
export default router;
