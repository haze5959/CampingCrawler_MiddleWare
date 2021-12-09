import { redisRepo } from "../repository/redisRepository.ts";
import { siteRepo } from "../repository/dbRepository.ts";
import { Context, helpers } from "https://deno.land/x/oak/mod.ts";
import { singleton } from "../utils/singleton.ts";

export async function getCampAvailDatesList(ctx: Context) {
  const params = helpers.getQuery(ctx);
  const areaBitStr = params["area_bit"]
  let areaBit = 0
  if (areaBitStr) {
    areaBit = Number(areaBitStr)
  }

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
    ctx.response.body = { result: false, msg: "server error" };
  }
}

// export async function getCampAvailDates(ctx: Context) {
//   const params = helpers.getQuery(ctx);
//   const campKey = params["id"];

//   if (campKey != undefined) {
//     try {
//       const info = await redisRepo.getCampAvailDates(campKey);
//       const json = {
//         "site": info.name,
//         "avail_dates": info.availDates,
//         "updated_date": info.updatedDate,
//       };

//       ctx.response.body = {
//         result: true,
//         msg: "",
//         data: { "camp": json, "holiday": singleton.holidaysInFourMonth },
//       };
//     } catch (error) {
//       ctx.response.body = { result: false, msg: "server error" };
//     }
//   } else {
//     ctx.response.body = { result: false, msg: "param fail" };
//   }
// }

export async function getCampAvailDatesDatail(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const campKey = params["id"];

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
      console.error(error);
      ctx.response.body = { result: false, msg: "server error" };
    }
  } else {
    ctx.response.body = { result: false, msg: "param fail" };
  }
}

export function getCampSiteSimpleInfo(ctx: Context) {
  ctx.response.body = { result: true, msg: "", data: singleton.siteSimpleInfo };
}

export async function getCampSiteDetail(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const campKey = params["id"];

  if (campKey != undefined) {
    const siteInfo = await siteRepo.getSiteInfo(campKey);
    ctx.response.body = { result: true, msg: "", data: siteInfo };
  } else {
    ctx.response.body = { result: false, msg: "param fail" };
  }
}
