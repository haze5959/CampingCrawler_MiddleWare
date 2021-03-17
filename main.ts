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
    const queryParams = request.url.searchParams.getAll("area");
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
      const info = await redisRepo.getCampSpotInfo(campKey);
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
  .get("/post/:id", async ({ request, response, params }) => {
    if (params && params.id) {
      const page = Number(params.id);
      try {
        const info = await dbRepo.getPosts(page);
        if (info.posts["type"] == 3) {
          const secretKey = request.url.searchParams.get("key");
          console.log(secretKey);
          if (info.posts["secret_key"] == secretKey) {
            response.body = info;
            return;
          }
          response.body = { result: false, msg: "잘못된 비밀번호입니다." };
          return;
        }

        response.body = info;
      } catch (error) {
        console.error(error);
        response.body = { result: false, msg: error };
      }
    }
  })
  .get("/post/list/:page", async ({ request, response, params }) => {
    if (params && params.page) {
      const page = Number(params.page);
      try {
        const info = await dbRepo.getPostsWith(page);

        response.body = info;
      } catch (error) {
        console.error(error);
        response.body = { result: false, msg: error };
      }
    }
  })
  .post("/post", async ({ request, response, params }) => {
    if (request.hasBody) {
      try {
        const body = await request.body({ type: "json" }).value;
        const type = body["type"] as number;
        const title = body["title"] as string;
        const bodyVal = body["body"] as string;
        const nick = body["nick"] as string;
        const secretKey = body["secret_key"] as string | null;

        const result = await dbRepo.createPosts(
          type,
          title,
          bodyVal,
          nick,
          secretKey,
        );
        if (result.affectedRows != null) {
          response.body = { result: true, msg: "" };
        } else {
          response.body = { result: false, msg: "not excuted" };
        }
      } catch (error) {
        console.error(error);
        response.body = { result: false, msg: error };
      }
    } else {
      response.body = { result: false, msg: "no params." };
    }
  })
  .post("/comment", async ({ request, response, params }) => {
    if (request.hasBody) {
      try {
        const body = await request.body({ type: "json" }).value;
        const postId = body["postId"] as number;
        const nick = body["nick"] as string;
        const comment = body["comment"] as string;

        const result = await dbRepo.createComment(postId, nick, comment);
        if (result.affectedRows != null) {
          response.body = { result: true, msg: "" };
        } else {
          response.body = { result: false, msg: "not excuted" };
        }
      } catch (error) {
        console.error(error);
        response.body = { result: false, msg: error };
      }
    } else {
      response.body = { result: false, msg: "no params." };
    }
  })
  .delete("/post", async ({ request, response, params }) => {
    if (request.hasBody) {
      try {
        const body = await request.body({ type: "json" }).value;
        const id = body["id"] as number;

        const result = await dbRepo.deletePosts(id);
        if (result.affectedRows != null) {
          response.body = { result: true, msg: "" };
        } else {
          response.body = { result: false, msg: "not excuted" };
        }
      } catch (error) {
        console.error(error);
        response.body = { result: false, msg: error };
      }
    } else {
      response.body = { result: false, msg: "no params." };
    }
  })
  .delete("/comment", async ({ request, response, params }) => {
    if (request.hasBody) {
      try {
        const body = await request.body({ type: "json" }).value;
        const id = body["id"] as number;

        const result = await dbRepo.deleteComment(id);
        if (result.affectedRows != null) {
          response.body = { result: true, msg: "" };
        } else {
          response.body = { result: false, msg: "not excuted" };
        }
      } catch (error) {
        console.error(error);
        response.body = { result: false, msg: error };
      }
    } else {
      response.body = { result: false, msg: "no params." };
    }
  });

const app = new Application();
app.use(oakCors({ origin: "*" }));
app.use(router.routes());
app.use(router.allowedMethods());

console.info("CAMP_MIDDLEWARE Start!!");

await app.listen({ port: 8000 });
