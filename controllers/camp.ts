import { redisRepo } from "../repository/redisRepository.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { singleton } from "../utils/singleton.ts";
import { siteInfo } from "../repository/siteInfo.ts";

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
      data: infoJson,
      holiday: singleton.holidaysInFourMonth,
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
        data: json,
        holiday: singleton.holidaysInFourMonth,
      };
    } catch (error) {
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};

export const getCampSiteInfo = ({
  response,
}: RouterContext) => {
  response.body = { result: true, msg: "", data: siteInfo };
};
