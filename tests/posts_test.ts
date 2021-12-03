import { Application } from "https://deno.land/x/oak/mod.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { postsRouter } from "../routers/posts_router.ts";
import { testLogger } from "./test_utils.ts";

// deno test --allow-net ./tests/posts_test.ts
const app = new Application();
app.use(postsRouter.routes(), postsRouter.allowedMethods());

Deno.test("GET /home", async () => {
    const request = await superoak(app);
    await request.get("/home")
        .expect(200)
        .end(testLogger);
});

Deno.test("GET /post/:id", async () => {
    const request = await superoak(app);
    await request.get("/post/1")
        .expect(200)
        .end(testLogger);
});

Deno.test("GET /post/list/:page", async () => {
    const request = await superoak(app);
    await request.get("/post/list/1")
        .expect(200)
        .end(testLogger);
});

Deno.test("POST /post", async () => {
    const request = await superoak(app);
    await request.post("/post")
        .set("Content-Type", "application/json")
        .send({"type":"", "title":"", "body":"", "token":""})   // JSON.stringify({ url: "foo" })
        .expect(200)
        .end(testLogger);
});


Deno.test("POST /comment", async () => {
    const request = await superoak(app);
    await request.post("/comment")
        .set("Content-Type", "application/json")
        .send('{"post_id":"", "comment":"", "token":""}')
        .expect(200)
        .end(testLogger);
});


Deno.test("DELETE /post/:token", async () => {
    const request = await superoak(app);
    await request.delete("/post/1?id=999")
        .expect(200)
        .end(testLogger);
});

Deno.test("DELETE /comment/:token", async () => {
    const request = await superoak(app);
    await request.delete("/comment/1?id=999")
        .expect(200)
        .end(testLogger);
});