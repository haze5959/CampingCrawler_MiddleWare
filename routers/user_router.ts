import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  deleteFavorite,
  deleteUser,
  getFavorite,
  getPushInfo,
  getUser,
  postFavorite,
  putUserArea,
  putUserNick,
  putUserProfile,
  createReport,
  changeReportState,
  deleteReport,
} from "../controllers/user_controller.ts";

const userRouter = new Router();
userRouter
  // 유저 관련
  .get("/user/:token", getUser)
  .delete("/user/:token", deleteUser)
  .put("/user/area", putUserArea)
  .put("/user/nick", putUserNick)
  .put("/user/profile", putUserProfile)
  .get("/user/push/:token", getPushInfo)
  .get("/user/favorite/:token", getFavorite)
  .post("/user/favorite", postFavorite)
  .delete("/user/favorite/:token", deleteFavorite)
  .post("/report", createReport)
  .put("/report", changeReportState)
  .delete("/report", deleteReport);

export { userRouter };