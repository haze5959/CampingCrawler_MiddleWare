import { connect } from "https://deno.land/x/redis/mod.ts";
import { RedisAccount } from "./redisAccount.ts";
import { CampInfo } from "./CampInfoModel.ts";

const redis = await connect({
  hostname: RedisAccount.host,
  port: RedisAccount.port,
  password: RedisAccount.pw,
});

// const campSiteKeys = ["camp_munsoo"];

const campSiteKeys = {
  "CampArea.seoul": [],
  "CampArea.gyeonggi": ["camp_munsoo"],
  "CampArea.inchoen": ["camp_namu"],
  "CampArea.chungnam": [],
  "CampArea.chungbuk": [],
  "CampArea.gangwon": [],
  "CampArea.etc": []
}

class RedisRepository {
  constructor() {
  }

  async getAllCampSpotInfo(): Promise<Array<CampInfo>> {
    var compInfoArr = Array<CampInfo>();
    for (const site of campSiteKeys) {
      try {
        const campInfo = await this.getCampSpotInfo(site);
        compInfoArr.push(campInfo);
      } catch (error) {
        console.error(error);
      }
    }

    return compInfoArr;
  }

  async getCampSpotInfoWith(area: Array<string>): Promise<Array<CampInfo>> {
    const availDatesStr = await redis.hget(site, "availDates");
    const updateTime = await redis.hget(site, "updateTime");

    const availDates = availDatesStr?.split(",")

    return new CampInfo(site, availDates, updateTime);
  }

  async getCampSpotInfo(site: string): Promise<CampInfo> {
    const availDatesStr = await redis.hget(site, "availDates");
    const updateTime = await redis.hget(site, "updateTime");

    const availDates = availDatesStr?.split(",")

    return new CampInfo(site, availDates, updateTime);
  }
}

export { RedisRepository };