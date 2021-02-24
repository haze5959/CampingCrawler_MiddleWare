import { connect } from "https://deno.land/x/redis/mod.ts";
import { RedisAccount } from "./redisAccount.ts";
import { CampInfo } from "./CampInfoModel.ts";

const redis = await connect({
  hostname: RedisAccount.host,
  port: RedisAccount.port,
  password: RedisAccount.pw,
});

const campSiteKeys = {
  "CampArea.seoul": [],
  "CampArea.gyeonggi": ["camp_munsoo"],
  "CampArea.inchoen": ["camp_tree"],
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
    for (const area in campSiteKeys) {
      try {
        for (const site in campSiteKeys[area]) {
          const campInfo = await this.getCampSpotInfo(site);
          compInfoArr.push(campInfo);
        }
      } catch (error) {
        console.error(error);
      }
    }

    return compInfoArr;
  }

  async getCampSpotInfoWithIn(areaArr: Array<string>): Promise<Array<CampInfo>> {
    var compInfoArr = Array<CampInfo>();
    for (const area in areaArr) {
      try {
        for (const site in campSiteKeys[area]) {
          const campInfo = await this.getCampSpotInfo(site);
          compInfoArr.push(campInfo);
        }
      } catch (error) {
        console.error(error);
      }
    }

    return compInfoArr;
  }

  async getCampSpotInfo(site: string): Promise<CampInfo> {
    const availDatesStr = await redis.hget(site, "availDates");
    const updateTime = await redis.hget(site, "updateTime");

    const availDates = availDatesStr?.split(",")

    return new CampInfo(site, availDates, updateTime);
  }
}

export { RedisRepository };