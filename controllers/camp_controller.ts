import { redisRepo } from "../repository/redisRepository.ts";
import { siteRepo } from "../repository/dbRepository.ts";
import { RouterContext } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { singleton } from "../utils/singleton.ts";

export const getCampAvailDatesList = async ({
  request,
  response,
}: RouterContext) => {
  const areaBit = Number(request.url.searchParams.get("area_bit")) ?? 0;

  try {
    const infos = await redisRepo.getCampAvailDatesWithIn(areaBit);
    const infoJson = infos.map((value) => {
      const json = {
        "site": value.name,
        "availDates": value.availDates,
        "updatedDate": value.updatedDate,
      };

      return json;
    });

    response.body = {
      result: true,
      msg: "",
      data: { "camps": infoJson, "holiday": singleton.holidaysInFourMonth },
    };
  } catch (error) {
    console.error(error);
    response.body = { result: false, msg: error };
  }
};

export const getCampAvailDates = async ({
  response,
  params,
}: RouterContext) => {
  if (params && params.id) {
    const campKey: string = params.id;
    try {
      const info = await redisRepo.getCampAvailDates(campKey);
      const json = {
        "site": info.name,
        "availDates": info.availDates,
        "updatedDate": info.updatedDate,
      };

      response.body = {
        result: true,
        msg: "",
        data: { "camp": json, "holiday": singleton.holidaysInFourMonth },
      };
    } catch (error) {
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};

export const getCampAvailDatesDatail = async ({
  response,
  params,
}: RouterContext) => {
  if (params && params.id) {
    const campKey: string = params.id;
    try {
      const info = await redisRepo.getCampAvailDatesDatail(campKey);
      const siteInfo = await siteRepo.getSiteInfo(campKey);
      const json = {
        "site": info.name,
        "availDates": info.availDates,
        "updatedDate": info.updatedDate,
      };

      response.body = {
        result: true,
        msg: "",
        data: {
          "camp": json,
          "holiday": singleton.holidaysInFourMonth,
          "info": siteInfo
        },
      };
    } catch (error) {
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};

export const getCampSiteSimpleInfo = ({
  response,
}: RouterContext) => {
  response.body = { result: true, msg: "", data: singleton.siteSimpleInfo };
};

export const getCampSiteDetail = async ({
  response,
  params,
}: RouterContext) => {
  if (params && params.id) {
    const campId: string = params.id;
    const siteInfo = await siteRepo.getSiteInfo(campId);
    response.body = { result: true, msg: "", data: siteInfo };
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};
