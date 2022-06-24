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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const zlib = require("zlib");
const es = require("event-stream");
const node_stream_1 = require("node:stream");
const node_stream_2 = require("node:stream");
const router = (0, express_1.Router)();
router.get("/readMultiple", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stream = fs_1.default.createReadStream(`.././Node_Streams/data.json`, {
            highWaterMark: 30,
        });
        // stream.pipe(res);
        let data = "";
        stream.on("data", (chunk) => {
            data += chunk;
        });
        const getDataValue = new Promise((resolve) => {
            stream.on("end", function () {
                resolve(data);
            });
        });
        let finalData = yield getDataValue;
        let parsedObj = JSON.parse(finalData);
        function getKey(key) {
            return `${key}`;
        }
        function* run() {
            for (const item in parsedObj) {
                let sendableIte = {
                    [getKey(item)]: parsedObj[item],
                };
                yield sendableIte;
            }
        }
        const readableStream = new node_stream_1.Readable({
            read() {
                for (const data of run()) {
                    this.push(JSON.stringify(data).concat("\n"));
                }
                // just saying that the stream has finished!
                this.push(null);
            },
        });
        readableStream.pipe(res);
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
        (0, axios_1.default)({
            method: "get",
            url: "http://localhost:8000/readMultiple",
            responseType: "stream",
        }).then(function (response) {
            // let i = 1;
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
                    // console.log(chunk);
                    d += chunk.toString();
                    const writeStream = fs_1.default.createWriteStream(`.././Node_Streams/email${i}.txt`, {
                        flags: "a",
                    });
                    if (count >= 5) {
                        writeStream.write(d);
                        i++;
                        count = 0;
                        d = "";
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
