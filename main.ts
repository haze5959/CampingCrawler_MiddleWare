import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { RedisRepository } from "./redisRepository.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const router = new Router();
const repository = new RedisRepository();

router
  .get("/", (context) => {
    context.response.body = "hi~";
  })
  .get("/camp", async ({ request, response, params }) => {
    const queryParams = request.url.searchParams.getAll('area[]')
    
    const infos = await repository.getCampSpotInfoWithIn(queryParams);
    const infoJson = infos.map((value, index) => {
      const json = {
        "site": value.name,
        "availDates": value.availDates,
        "updatedDate": value.updatedDate,
      };

      return json;
    });

    response.body = infoJson;
  });

const app = new Application();
app.use(oakCors({ origin: "*" }));
app.use(router.routes());
app.use(router.allowedMethods());

console.info("CAMP_MIDDLEWARE Start!!");

await app.listen({ port: 8000 });

// 읽어보기!!
// https://ichi.pro/ko/deno-oak-mich-mysqleul-sayonghayeo-blogging-api-guchug-mich-dockerize-267065037401964