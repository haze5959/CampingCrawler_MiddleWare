import { Application } from "https://deno.land/x/oak/mod.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { campRouter } from "../routers/camp_router.ts";
import { testLogger } from "./test_utils.ts";

// deno test --allow-net ./tests/camp_test.ts
const app = new Application();
app.use(campRouter.routes(), campRouter.allowedMethods());

Deno.test("GET /camp", async () => {
    const request = await superoak(app);
    await request.get("/camp?area_bit=1")
        .expect(200)
        .end(testLogger);
});

Deno.test("GET /camp/:id", async () => {
    const request = await superoak(app);
    await request.get("/camp/1")
        .expect(200)
        .end(testLogger);
});

Deno.test("GET /info", async () => {
    const request = await superoak(app);
    await request.get("/info")
        .expect(200)
        .end(testLogger);
});

Deno.test("GET /info/:id", async () => {
    const request = await superoak(app);
    await request.get("/info/camp_id")
        .expect(200)
        .end(testLogger);
});