"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = require("../app");
test("Async code demo", (done) => {
    setTimeout(() => {
        expect(1).toBe(1);
        done();
    }, 2000);
});
