import { Application } from "https://deno.land/x/oak/mod.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { delay } from 'https://deno.land/x/delay/mod.ts';
import { campRouter } from "../routers/camp_router.ts";
import { testCheck } from "./test_utils.ts";
import { singleton } from "../utils/singleton.ts";

// sudo deno test --allow-all ./tests/camp_test.ts
const app = new Application();
app.use(campRouter.routes(), campRouter.allowedMethods());
await singleton.updateHolidayInFourMonth();
await singleton.updatesiteSimpleInfo();
await delay(1000);

Deno.test("GET /camp", async () => {
  const request = await superoak(app);
  await request.get("/camp?area_bit=1")
    .expect(testCheck);
});

Deno.test("GET /camp/:id", async () => {
  const request = await superoak(app);
  await request.get("/camp/camp_tree")
    .expect(testCheck);
});

Deno.test("GET /info", async () => {
  const request = await superoak(app);
  await request.get("/info")
    .expect(testCheck);
});

Deno.test("GET /info/:id", async () => {
  const request = await superoak(app);
  await request.get("/info/camp_tree")
    .expect(testCheck);
});
