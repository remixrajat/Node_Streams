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
                const newfileStream = fs_1.default.createReadStream(`.././Node_Streams/data.jsonl`);
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
        let response = yield (0, axios_1.default)({
            method: "get",
            url: "http://localhost:8000/readMultiple",
            responseType: "stream",
        });
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
                d += chunk.toString().slice(1, chunk.toString().length - 1) + ",";
                console.log(d);
                const writeStream = fs_1.default.createWriteStream(`.././Node_Streams/email${i}.json`, {
                    flags: "a",
                });
                if (count >= new_count && chunk) {
                    if (d.slice(-1) === ",") {
                        d = d.slice(0, d.length - 1);
                    }
                    console.log(d);
                    writeStream.write(`{${d}}`);
                    i++;
                    count = 0;
                    d = "";
                }
                return cb();
            },
        }));
        res.status(200).json({ result: "Success." });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
