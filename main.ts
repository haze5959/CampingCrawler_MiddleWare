import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import {
  getCampAvailDates,
  getCampAvailDatesList,
  getCampSiteInfo,
} from "./controllers/camp.ts";
<<<<<<< HEAD
import { getUser, putUser, getFavorite, deleteUser, reportMail } from "./controllers/user.ts";
=======
import { getUser, getPushInfo, getFavorite, deleteUser, reportMail, putUserNick } from "./controllers/user.ts";
>>>>>>> 9bd7adeb0ad3b3469b3db4ab80c90a3dce237be6
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
  // 캠프 관련
  .get("/camp", getCampAvailDatesList)
  .get("/camp/:id", getCampAvailDates)
  .get("/info", getCampSiteInfo)
  // 포스트 관련
  .get("/home", getHomePosts)
  .get("/post/:id/:token", getPosts)
  .get("/post/list/:page", getPostsPage)
  .post("/post", postPosts)
  .post("/comment", postComment)
  .delete("/post", deletePosts)
  .delete("/comment", deleteComment)
  // 유저 관련
  .get("/user/:token", getUser)
  .put("/user", putUser)
  .put("/user/nick", putUserNick)
  .get("/user/push/:token", getPushInfo)
  .get("/user/favorite:token", getFavorite)
  .delete("/user/:token", deleteUser)
  .post("/report", reportMail);

const app = new Application();
app.use(oakCors({ origin: "*" }));
app.use(router.routes());
app.use(router.allowedMethods());

console.info("CAMP_MIDDLEWARE Start!!");

await app.listen({ port: 8000 });
