import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { RedisRepository } from "./redisRepository.ts";

const router = new Router();
const repository = new RedisRepository();

router
  .get("/", (context) => {
    context.response.body = "hi~";
  })
  .get("/camp", async (context) => {
    const infos = await repository.getAllCampSpotInfo();
    const infoJson = infos.map((value, index) => {
      const json = {
        "site": value.name,
        "availDates": value.availDates,
        "updatedDate": value.updatedDate,
      };

      return json;
    });

    context.response.body = infoJson;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.info("CAMP_MIDDLEWARE Start!!");

await app.listen({ port: 8000 });