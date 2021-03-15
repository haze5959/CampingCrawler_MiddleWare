import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { RedisRepository } from "./redisRepository.ts";
import { DBRepository } from "./dbRepository.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { siteInfo } from "./SiteInfo.ts";

const router = new Router();
const redisRepo = new RedisRepository();
const dbRepo = new DBRepository();

router
  .get("/", (context) => {
    context.response.body = "hi~";
  })
  .get("/camp", async ({ request, response, params }) => {
    const queryParams = request.url.searchParams.getAll('area')
    const infos = await redisRepo.getCampSpotInfoWithIn(queryParams);
    const infoJson = infos.map((value, index) => {
      const json = {
        "site": value.name,
        "availDates": value.availDates,
        "updatedDate": value.updatedDate,
      };

      return json;
    });

    response.body = infoJson;
  })
  .get("/camp/:id", async ({ request, response, params }) => {
    if (params && params.id) {
      const campKey: string = params.id;
      const info = await redisRepo.getCampSpotInfo(campKey)
      const json = {
        "site": info.name,
        "availDates": info.availDates,
        "updatedDate": info.updatedDate,
      };

      response.body = json;
    }
  })
  .get("/info", (context) => {
    context.response.body = siteInfo;
  })
  .get("/post/:page", async ({ request, response, params }) => {
    if (params && params.page) {
      const page = Number(params.page);
      try {
        const info = await dbRepo.getAllPosts();
      // const json = {
      //   "site": info.name,
      //   "availDates": info.availDates,
      //   "updatedDate": info.updatedDate,
      // };

      response.body = info;
      } catch (error) {
        console.error(error);
      }
    }
  })

const app = new Application();
app.use(oakCors({ origin: "*" }));
app.use(router.routes());
app.use(router.allowedMethods());

console.info("CAMP_MIDDLEWARE Start!!");

await app.listen({ port: 8000 });