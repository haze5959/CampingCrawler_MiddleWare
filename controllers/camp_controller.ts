import { redisRepo } from "../repository/redisRepository.ts";
import { postsRepo, siteRepo } from "../repository/dbRepository.ts";
import { Context, helpers } from "https://deno.land/x/oak/mod.ts";
import { singleton } from "../utils/singleton.ts";
import { ErrorMessage } from "../utils/error_msg.ts";

export async function getHomeInfo(ctx: Context) {
  const params = helpers.getQuery(ctx);
  const areaBitStr = params["area_bit"];
  let areaBit = 0;
  if (areaBitStr) {
    areaBit = Number(areaBitStr);
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

    const community = await postsRepo.getHomePosts();
    ctx.response.body = {
      result: true,
      msg: "",
      data: {
        "camps": infoJson,
        "community": community,
      },
    };
  } catch (error) {
    console.error(error);
    ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
  }
}

export async function getCampAvailDatesList(ctx: Context) {
  const params = helpers.getQuery(ctx);
  const areaBitStr = params["area_bit"];
  let areaBit = 0;
  if (areaBitStr) {
    areaBit = Number(areaBitStr);
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
      data: { "camps": infoJson },
    };
  } catch (error) {
    console.error(error);
    ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
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
//         data: { "camp": json },
//       };
//     } catch (error) {
//       ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
//     }
//   } else {
//     ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
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
          "info": siteInfo,
        },
      };
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

export function getCampSiteSimpleInfo(ctx: Context) {
  ctx.response.body = { result: true, msg: "", data: {
    "site_info_list": singleton.siteSimpleInfo,
    "holiday": singleton.holidaysInFourMonth
  } };
}

export async function getCampSiteDetail(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const campKey = params["id"];

  if (campKey != undefined) {
    const siteInfo = await siteRepo.getSiteInfo(campKey);
    ctx.response.body = { result: true, msg: "", data: siteInfo };
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}
