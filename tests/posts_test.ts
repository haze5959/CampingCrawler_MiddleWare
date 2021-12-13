import { Application } from "https://deno.land/x/oak/mod.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { delay } from 'https://deno.land/x/delay/mod.ts';
import { postsRouter } from "../routers/posts_router.ts";
import { testCheck } from "./test_utils.ts";
import { singleton } from "../utils/singleton.ts";

// sudo deno test --allow-all ./tests/posts_test.ts
const app = new Application();
app.use(postsRouter.routes(), postsRouter.allowedMethods());
await singleton.updateHolidayInFourMonth();
await singleton.updatesiteSimpleInfo();
await delay(1000);

// Deno.test("GET /home", async () => {
//   const request = await superoak(app);
//   await request.get("/home")
//     .expect(testCheck);
// });

// Deno.test("GET /post/:id", async () => {
//   const request = await superoak(app);
//   await request.get("/post/1")
//     .expect(testCheck);
// });

// Deno.test("GET /post/:id/:token", async () => {
//   const request = await superoak(app);
//   await request.get("/post/1")
//     .expect(testCheck);
// });

// Deno.test("GET /post/list/:page", async () => {
//   const request = await superoak(app);
//   await request.get("/post/list/1?is_notice=true")
//     .expect(testCheck)
//     .on("response", (res) => { console.log(res.body); })
// });

// Deno.test("POST /post", async () => {
//   const request = await superoak(app);
//   await request.post("/post")
//     .set("Content-Type", "application/json")
//     .send({ "type": "", "title": "", "body": "", "token": "" }) // JSON.stringify({ url: "foo" })
//     .expect(testCheck);
// });

Deno.test("POST /comment", async () => {
  const request = await superoak(app);
  await request.post("/comment")
    .set("Content-Type", "application/json")
    .send('{"post_id":1, "comment":"12/13 TEST 입니다!!"}')
    .expect(testCheck);
});

// Deno.test("DELETE /post/:token", async () => {
//   const request = await superoak(app);
//   await request.delete("/post/1?id=999")
//     .expect(testCheck);
// });

// Deno.test("DELETE /comment/:token", async () => {
//   const request = await superoak(app);
//   await request.delete("/comment/1?id=999")
//     .expect(testCheck);
// });
