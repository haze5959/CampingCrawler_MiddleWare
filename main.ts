import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { getCamp, getCampList, getCampSiteInfo } from "./controllers/camp.ts";
import { reportMail } from "./controllers/user.ts";
import {
  deleteComment,
  deletePosts,
  getHomePosts,
  getPosts,
  getPostsPage,
  postComment,
  postPosts,
} from "./controllers/posts.ts";

const router = new Router();

router
  .get("/", (context) => {
    context.response.body = "hi~";
  })
  .get("/camp", getCampList)
  .get("/camp/:id", getCamp)
  .get("/info", getCampSiteInfo)
  .get("/home", getHomePosts)
  .get("/post/:id", getPosts)
  .get("/post/list/:page", getPostsPage)
  .post("/post", postPosts)
  .post("/comment", postComment)
  .post("/report", reportMail)
  .delete("/post", deletePosts)
  .delete("/comment", deleteComment);

const app = new Application();
app.use(oakCors({ origin: "*" }));
app.use(router.routes());
app.use(router.allowedMethods());

console.info("CAMP_MIDDLEWARE Start!!");

await app.listen({ port: 8000 });
