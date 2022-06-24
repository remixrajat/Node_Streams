import request from "supertest";
const app = require("../app");

test("Async code demo", (done) => {
  setTimeout(() => {
    expect(1).toBe(1);
    done();
  }, 2000);
});
