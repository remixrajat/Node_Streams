"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const zlib = require("zlib");
const es = require("event-stream");
const readline = require("readline");
const node_stream_1 = require("node:stream");
const node_stream_2 = require("node:stream");
const router = (0, express_1.Router)();
router.get("/readMultiple", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileStream = new node_stream_1.Readable({
            read() { },
        });
        function processLineByLine() {
            var e_1, _a;
            return __awaiter(this, void 0, void 0, function* () {
                const newfileStream = fs_1.default.createReadStream(`.././Node_Streams/data.json`);
                const rl = readline.createInterface({
                    input: newfileStream,
                    crlfDelay: Infinity,
                });
                try {
                    for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                        const line = rl_1_1.value;
                        // console.log(`Line from file: ${line}`);
                        fileStream.push(line);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (rl_1_1 && !rl_1_1.done && (_a = rl_1.return)) yield _a.call(rl_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                fileStream.push(null);
            });
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
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}));
router.get("/writeMultiple", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let i = 1;
        let d = "";
        let count = 0;
        let new_count = 5;
        (0, axios_1.default)({
            method: "get",
            url: "http://localhost:8000/readMultiple",
            responseType: "stream",
        }).then(function (response) {
            response.data
                .pipe(new node_stream_2.Transform({
                objectMode: true,
                transform(chunk, enc, cb) {
                    cb(null, chunk);
                },
            }))
                .pipe(new node_stream_2.Writable({
                objectMode: true,
                write(chunk, enc, cb) {
                    count++;
                    // console.log(chunk.toString(), "uuuuuuuuuuuuuuu");
                    if (!chunk.toString().startsWith("{")) {
                        d += chunk.toString();
                    }
                    else {
                        new_count = 6;
                    }
                    const writeStream = fs_1.default.createWriteStream(`.././Node_Streams/email${i}.txt`, {
                        flags: "a",
                    });
                    if (count >= new_count) {
                        writeStream.write(d);
                        i++;
                        count = 0;
                        d = "";
                        new_count = 5;
                    }
                    return cb();
                },
            }));
        });
        res.status(200).json({ result: "Success." });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
