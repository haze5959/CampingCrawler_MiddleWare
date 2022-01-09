import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getHomeInfo,
  getCampAvailDatesDatail,
  getCampAvailDatesList,
  getCampSiteDetail,
  getCampSiteSimpleInfo,
} from "../controllers/camp_controller.ts";

const campRouter = new Router();

campRouter
  // 캠프 관련
  .get("/home", getHomeInfo)
  .get("/camp", getCampAvailDatesList)
  .get("/camp/:id", getCampAvailDatesDatail)
  .get("/info", getCampSiteSimpleInfo)
  .get("/info/:id", getCampSiteDetail)

export { campRouter };