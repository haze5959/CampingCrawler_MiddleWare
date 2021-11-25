import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {
  deleteFavorite,
  deleteUser,
  getFavorite,
  getPushInfo,
  getUser,
  postFavorite,
  putUserArea,
  putUserNick,
  createReport,
  changeReportState,
  deleteReport,
} from "../controllers/user_controller.ts";

const userRouter = new Router();
userRouter
  // 유저 관련
  .get("/user/:token", getUser)
  .put("/user/area", putUserArea)
  .put("/user/nick", putUserNick)
  .get("/user/push/:token", getPushInfo)
  .get("/user/favorite/:token", getFavorite)
  .post("/user/favorite", postFavorite)
  .delete("/user/favorite/:token", deleteFavorite)
  .delete("/user/:token", deleteUser)
  .post("/report", createReport)
  .put("/report", changeReportState)
  .delete("/report", deleteReport);

export { userRouter };