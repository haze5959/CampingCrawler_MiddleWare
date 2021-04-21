import "https://deno.land/x/dotenv/load.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";
import { CampInfo, CampArea } from "../models/campInfo.ts";

const redis = await connect({
  hostname: Deno.env.get("REDIS_HOST") as string,
  port: Deno.env.get("REDIS_PORT"),
  password: Deno.env.get("REDIS_PW"),
});

const campSiteKeys = {
  [CampArea.seoul]: <string[]>[],
  [CampArea.gyeonggi]: ["camp_munsoo"],
  [CampArea.inchoen]: ["camp_tree"],
  [CampArea.chungnam]: <string[]>[],
  [CampArea.chungbuk]: <string[]>[],
  [CampArea.gangwon]: <string[]>[],
  [CampArea.etc]: <string[]>[]
}

class RedisRepository {
  constructor() {
  }

  async getAllCampSpotInfo(): Promise<Array<CampInfo>> {
    var compInfoArr = Array<CampInfo>();
    for (const area in campSiteKeys) {
      try {
        for (const site of campSiteKeys[area as keyof typeof campSiteKeys]) {
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
    for (const area of areaArr) {
      try {
        for (const site of campSiteKeys[area as keyof typeof campSiteKeys]) {
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

const redisRepo = new RedisRepository();

export { redisRepo };