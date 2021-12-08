import { Application } from "https://deno.land/x/oak/mod.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { delay } from 'https://deno.land/x/delay/mod.ts';
import { userRouter } from "../routers/user_router.ts";
import { testCheck } from "./test_utils.ts";

// s udodeno test --allow-all ./tests/user_test.ts
const app = new Application();
app.use(userRouter.routes(), userRouter.allowedMethods());
await delay(2000);

const token = "";

// Deno.test("GET /user/:token", async () => {
//   const request = await superoak(app);
//   await request.get(`/user/${token}`)
//     .expect(testCheck);
// });

// Deno.test("DELETE /user/:token", async () => {
//   const request = await superoak(app);
//   await request.delete(`/user/${token}`)
//     .expect(testCheck);
// });

// Deno.test("PUT /user/area", async () => {
//   const request = await superoak(app);
//   await request.put("/user/area")
//     .set("Content-Type", "application/json")
//     .send({ "area_bit": 1, "token": token })
//     .expect(testCheck);
// });

// Deno.test("PUT /user/nick", async () => {
//   const request = await superoak(app);
//   await request.put("/user/nick")
//     .set("Content-Type", "application/json")
//     .send({ "nick": "test2503", "token": token })
//     .expect(testCheck);
// });

// Deno.test("GET /user/push/:token", async () => {
//   const request = await superoak(app);
//   await request.get(`/user/push/${token}`)
//     .expect(testCheck);
// });

// Deno.test("GET /user/favorite/:token", async () => {
//   const request = await superoak(app);
//   await request.get(`/user/favorite/${token}`)
//     .expect(testCheck);
// });

// Deno.test("POST /user/favorite", async () => {
//   const request = await superoak(app);
//   await request.post("/user/favorite")
//     .set("Content-Type", "application/json")
//     .send({ "camp_id": "camp_tree", "token": token })
//     .expect(testCheck);
// });

// Deno.test("DELETE /user/favorite/:token", async () => {
//   const request = await superoak(app);
//   await request.delete(`/user/favorite/${token}?camp_id=camp_tree`)
//     .expect(testCheck);
// });

// Deno.test("POST /report", async () => {
//   const request = await superoak(app);
//   await request.post("/report")
//     .set("Content-Type", "application/json")
//     .send({ "id": "9999", "title": "TEST", "body": "THIS IS TEST!" })
//     .expect(testCheck);
// });

// Deno.test("PUT /report", async () => {
//   const request = await superoak(app);
//   await request.put("/report")
//     .set("Content-Type", "application/json")
//     .send({ "id": 1, "state": 2 })
//     .expect(testCheck);
// });

// Deno.test("DELETE /report", async () => {
//   const request = await superoak(app);
//   await request.delete("/report?id=1")
//     .expect(testCheck);
// });
