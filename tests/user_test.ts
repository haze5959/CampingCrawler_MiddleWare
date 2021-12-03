import { Application } from "https://deno.land/x/oak/mod.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { userRouter } from "../routers/user_router.ts";
import { testLogger } from "./test_utils.ts";

// deno test --allow-net ./tests/user_test.ts
const app = new Application();
app.use(userRouter.routes(), userRouter.allowedMethods());

Deno.test("GET /user/:token", async () => {
    const request = await superoak(app);
    await request.get("/user/1")
        .expect(200)
        .end(testLogger);
});

Deno.test("DELETE /user/:token", async () => {
    const request = await superoak(app);
    await request.delete("/user/1")
        .expect(200)
        .end(testLogger);
});

Deno.test("PUT /user/area", async () => {
    const request = await superoak(app);
    await request.put("/user/area")
        .set("Content-Type", "application/json")
        .send({ "area_bit": 1, "token": "" })
        .expect(200)
        .end(testLogger);
});

Deno.test("PUT /user/nick", async () => {
    const request = await superoak(app);
    await request.put("/user/nick")
        .set("Content-Type", "application/json")
        .send({ "nick": "test2503", "token": "" })
        .expect(200)
        .end(testLogger);
});

Deno.test("GET /user/push/:token", async () => {
    const request = await superoak(app);
    await request.get("/user/push/1")
        .expect(200)
        .end(testLogger);
});

Deno.test("GET /user/favorite/:token", async () => {
    const request = await superoak(app);
    await request.get("/user/favorite/1")
        .expect(200)
        .end(testLogger);
});

Deno.test("POST /user/favorite", async () => {
    const request = await superoak(app);
    await request.post("/user/favorite")
        .set("Content-Type", "application/json")
        .send({ "camp_id": "", "token": "" })
        .expect(200)
        .end(testLogger);
});

Deno.test("DELETE /user/favorite/:token", async () => {
    const request = await superoak(app);
    await request.delete("/user/favorite/1?camp_id=")
        .expect(200)
        .end(testLogger);
});

Deno.test("POST /report", async () => {
    const request = await superoak(app);
    await request.post("/report")
        .set("Content-Type", "application/json")
        .send({ "id": "", "title": "", "body": "" })
        .expect(200)
        .end(testLogger);
});

Deno.test("PUT /report", async () => {
    const request = await superoak(app);
    await request.put("/report")
        .set("Content-Type", "application/json")
        .send({ "id": "", "state": 0 })
        .expect(200)
        .end(testLogger);
});

Deno.test("DELETE /report", async () => {
    const request = await superoak(app);
    await request.delete("/report?id=999")
        .expect(200)
        .end(testLogger);
});