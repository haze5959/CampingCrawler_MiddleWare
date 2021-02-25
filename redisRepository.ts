import { connect } from "https://deno.land/x/redis/mod.ts";
import { RedisAccount } from "./redisAccount.ts";
import { CampInfo } from "./CampInfoModel.ts";

const redis = await connect({
  hostname: RedisAccount.host,
  port: RedisAccount.port,
  password: RedisAccount.pw,
});

const campSiteKeys = {
  "CampArea.seoul": <string[]>[],
  "CampArea.gyeonggi": ["camp_munsoo"],
  "CampArea.inchoen": ["camp_tree"],
  "CampArea.chungnam": <string[]>[],
  "CampArea.chungbuk": <string[]>[],
  "CampArea.gangwon": <string[]>[],
  "CampArea.etc": <string[]>[]
}

class RedisRepository {
  constructor() {
  }

  async getAllCampSpotInfo(): Promise<Array<CampInfo>> {
    var compInfoArr = Array<CampInfo>();
    for (const area in campSiteKeys) {
      try {
        for (const site of campSiteKeys[area as keyof typeof campSiteKeys]) {
          console.info("site0: " + site);
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
    if (areaArr.length == 0) {
      return this.getAllCampSpotInfo()
    }

    var compInfoArr = Array<CampInfo>();
    for (const area in areaArr) {
      try {
        for (const site of campSiteKeys[area as keyof typeof campSiteKeys]) {
          console.info("site1: " + site);
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