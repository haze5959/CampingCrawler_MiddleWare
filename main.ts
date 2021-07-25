import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { monthly } from "https://deno.land/x/deno_cron/cron.ts";
import { singleton } from "./utils/singleton.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import {
  getCampAvailDatesDatail,
  getCampAvailDatesList,
  getCampSiteInfo,
} from "./controllers/camp.ts";
import {
  deleteFavorite,
  deleteUser,
  getFavorite,
  getPushInfo,
  getUser,
  postFavorite,
  putUserArea,
  putUserNick,
  reportMail,
} from "./controllers/user.ts";
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
  .get("/camp/:id", getCampAvailDatesDatail)
  .get("/info", getCampSiteInfo)
  // 포스트 관련
  .get("/home", getHomePosts)
  .get("/post/:id", getPosts)
  .get("/post/list/:page", getPostsPage)
  .post("/post", postPosts)
  .post("/comment", postComment)
  .delete("/post/:token", deletePosts)
  .delete("/comment/:token", deleteComment)
  // 유저 관련
  .get("/user/:token", getUser)
  .put("/user/area", putUserArea)
  .put("/user/nick", putUserNick)
  .get("/user/push/:token", getPushInfo)
  .get("/user/favorite/:token", getFavorite)
  .post("/user/favorite", postFavorite)
  .delete("/user/favorite/:token", deleteFavorite)
  .delete("/user/:token", deleteUser)
  .post("/report", reportMail);

const app = new Application();
app.use(oakCors({ origin: "*" }));
app.use(router.routes());
app.use(router.allowedMethods());

// 서버 시작할때랑 월마다 공휴일 업데이트
singleton.updateHolidayInFourMonth();
monthly(() => {
  singleton.updateHolidayInFourMonth();
}, 1);

console.info("CAMP_MIDDLEWARE Start!!");

await app.listen({ port: 8000 });
