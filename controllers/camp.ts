import { redisRepo } from "../repository/redisRepository.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { siteInfo } from "../repository/siteInfo.ts";

export const getCampList = async ({
  request,
  response,
}: RouterContext) => {
  const queryParams = request.url.searchParams.getAll("area");

  try {
    const infos = await redisRepo.getCampSpotInfoWithIn(queryParams);
    const infoJson = infos.map((value) => {
      const json = {
        "site": value.name,
        "availDates": value.availDates,
        "updatedDate": value.updatedDate,
      };

      return json;
    });

    response.body = { result: true, msg: "", data: infoJson };
  } catch (error) {
    console.error(error);
    response.body = { result: false, msg: error };
  }
};

export const getCamp = async ({
  response,
  params,
}: RouterContext) => {
  if (params && params.id) {
    const campKey: string = params.id;
    try {
      const info = await redisRepo.getCampSpotInfo(campKey);
      const json = {
        "site": info.name,
        "availDates": info.availDates,
        "updatedDate": info.updatedDate,
      };

      response.body = { result: true, msg: "", data: json };
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
