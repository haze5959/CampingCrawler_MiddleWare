import { redisRepo } from "../repository/redisRepository.ts";
import { siteRepo } from "../repository/dbRepository.ts";
import { helpers, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { singleton } from "../utils/singleton.ts";

export const getCampAvailDatesList = async (ctx: RouterContext) => {
  const params = helpers.getQuery(ctx);
  const areaBit = Number(params["area_bit"]) ?? 0;

  try {
    const infos = await redisRepo.getCampAvailDatesWithIn(areaBit);
    const infoJson = infos.map((value) => {
      const json = {
        "site": value.name,
        "avail_dates": value.availDates,
        "updated_date": value.updatedDate,
      };

      return json;
    });

    ctx.response.body = {
      result: true,
      msg: "",
      data: { "camps": infoJson, "holiday": singleton.holidaysInFourMonth },
    };
  } catch (error) {
    console.error(error);
    ctx.response.body = { result: false, msg: error };
  }
};

export const getCampAvailDates = async (ctx: RouterContext) => {
  const params = helpers.getQuery(ctx);
  const campKey = params['id'];
  
  if (campKey != undefined) {
    try {
      const info = await redisRepo.getCampAvailDates(campKey);
      const json = {
        "site": info.name,
        "avail_dates": info.availDates,
        "updated_date": info.updatedDate,
      };

      ctx.response.body = {
        result: true,
        msg: "",
        data: { "camp": json, "holiday": singleton.holidaysInFourMonth },
      };
    } catch (error) {
      ctx.response.body = { result: false, msg: error };
    }
  } else {
    ctx.response.body = { result: false, msg: "param fail" };
  }
};

export const getCampAvailDatesDatail = async (ctx: RouterContext) => {
  const params = helpers.getQuery(ctx);
  const campKey = params['id'];

  if (campKey != undefined) {
    const campKey: string = params.id;
    try {
      const info = await redisRepo.getCampAvailDatesDatail(campKey);
      const siteInfo = await siteRepo.getSiteInfo(campKey);
      const json = {
        "site": info.name,
        "avail_dates": info.availDates,
        "updated_date": info.updatedDate,
      };

      ctx.response.body = {
        result: true,
        msg: "",
        data: {
          "camp": json,
          "holiday": singleton.holidaysInFourMonth,
          "info": siteInfo,
        },
      };
    } catch (error) {
      ctx.response.body = { result: false, msg: error };
    }
  } else {
    ctx.response.body = { result: false, msg: "param fail" };
  }
};

export const getCampSiteSimpleInfo = (ctx: RouterContext) => {
  ctx.response.body = { result: true, msg: "", data: singleton.siteSimpleInfo };
};

export const getCampSiteDetail = async (ctx: RouterContext) => {
  const params = helpers.getQuery(ctx);
  const campKey = params['id'];

  if (campKey != undefined) {
    const siteInfo = await siteRepo.getSiteInfo(campKey);
    ctx.response.body = { result: true, msg: "", data: siteInfo };
  } else {
    ctx.response.body = { result: false, msg: "param fail" };
  }
};
