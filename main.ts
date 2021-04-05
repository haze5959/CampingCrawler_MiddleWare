import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { RedisRepository } from "./redisRepository.ts";
import { DBRepository } from "./dbRepository.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { siteInfo } from "./SiteInfo.ts";
import { mailerObj } from "./smtpClient.ts";

const router = new Router();
const redisRepo = new RedisRepository();
const dbRepo = new DBRepository();

router
  .get("/", (context) => {
    context.response.body = "hi~";
  })
  .get("/camp", async ({ request, response, params }) => {
    const queryParams = request.url.searchParams.getAll("area");

    try {
      const infos = await redisRepo.getCampSpotInfoWithIn(queryParams);
      const infoJson = infos.map((value, index) => {
        const json = {
          "site": value.name,
          "availDates": value.availDates,
          "updatedDate": value.updatedDate,
        };

        return json;
      });

      response.body = { result: true, msg: "", data: infoJson };
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  })
  .get("/camp/:id", async ({ request, response, params }) => {
    if (params && params.id) {
      const campKey: string = params.id;
      try {
        const info = await redisRepo.getCampSpotInfo(campKey);
        const json = {
          "site": info.name,
          "availDates": info.availDates,
          "updatedDate": info.updatedDate,
        };

        response.body = { result: true, msg: "", data: json };
      } catch (error) {
        response.body = { result: false, msg: error };
      }
    } else {
      response.body = { result: false, msg: "param fail" };
    }
  })
  .get("/info", (context) => {
    context.response.body = { result: true, msg: "", data: siteInfo };
  })
  .get("/home", async ({ request, response, params }) => {
    try {
      const data = await dbRepo.getHomePosts();
      response.body = { result: true, msg: "", data: data };
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  })
  .get("/post/:id", async ({ request, response, params }) => {
    if (params && params.id) {
      const page = Number(params.id);
      try {
        const info = await dbRepo.getPosts(page);
        if (info != null && info.posts["type"] == 3) {
          const secretKey = request.url.searchParams.get("key");
          
          if (info.posts["secret_key"] == secretKey) {
            response.body = { result: true, msg: "", data: info };
          } else {
            response.body = { result: false, msg: "잘못된 비밀번호입니다." };
          }
          return;
        }

        response.body = { result: true, msg: "", data: info };
      } catch (error) {
        console.error(error);
        response.body = { result: false, msg: error };
      }
    } else {
      response.body = { result: false, msg: "param fail" };
    }
  })
  .get("/post/list/:page", async ({ request, response, params }) => {
    if (params && params.page) {
      const page = Number(params.page);
      const typeArr: string[] = request.url.searchParams.getAll("type");
      
      try {
        const info = await dbRepo.getPostsWith(page, typeArr);
        response.body = { result: true, msg: "", data: info };
      } catch (error) {
        console.error(error);
        response.body = { result: false, msg: error };
      }
    } else {
      response.body = { result: false, msg: "param fail" };
    }
  })
  .post("/post", async ({ request, response, params }) => {
    if (request.hasBody) {
      try {
        const body = await request.body({ type: "json" }).value;
        const type = body["type"] as number;
        const title = body["title"] as string;
        const bodyVal = body["body"] as string;
        var nick = body["nick"] as string;
        const secretKey = body["secret_key"] as string | null;

        if (type == 0) {  // 공지사항이라면
          const id = body["id"] as string;
          const pw = body["pw"] as string;
          const userResult = await dbRepo.getUser(id, pw);
          if (userResult == null) {
            response.body = { result: false, msg: "auth fail" };
            return;
          }

          nick = userResult["nick"] as string;
        }

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
        const postId = body["post_id"] as number;
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
  .post("/report", async ({ request, response, params }) => {
    if (request.hasBody) {
      try {
        const body = await request.body({ type: "json" }).value;
        const id = body["id"] as string;
        const bodyStr = body["body"] as string;

        await mailerObj("[명당캠핑] 🤬 신고 - " + id, bodyStr);
        response.body = { result: true, msg: "" };
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
