import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {
  getCampAvailDatesDatail,
  getCampAvailDatesList,
  getCampSiteDetail,
  getCampSiteSimpleInfo,
} from "../controllers/camp_controller.ts";

const campRouter = new Router();

campRouter
  // 캠프 관련
  .get("/camp", getCampAvailDatesList)
  .get("/camp/:id", getCampAvailDatesDatail)
  .get("/info", getCampSiteSimpleInfo)
  .get("/info/:id", getCampSiteDetail)

export { campRouter };