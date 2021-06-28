import "https://deno.land/x/dotenv/load.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";
import { CampAvailDates, numToCampArea } from "../models/campInfo.ts";
import { campSiteKeys } from "../repository/siteInfo.ts";

const redis = await connect({
  hostname: Deno.env.get("REDIS_HOST") as string,
  port: Deno.env.get("REDIS_PORT"),
  password: Deno.env.get("REDIS_PW"),
});

class RedisRepository {
  private static _instance = new RedisRepository();
  private constructor() {
  }

  static get instance() {
    return this._instance;
  }

  async getAllCampAvailDates(): Promise<Array<CampAvailDates>> {
    var compInfoArr = Array<CampAvailDates>();
    for (const area in campSiteKeys) {
      try {
        for (const site of campSiteKeys[area as keyof typeof campSiteKeys]) {
          const campAvailDates = await this.getCampAvailDates(site);
          compInfoArr.push(campAvailDates);
        }
      } catch (error) {
        console.error(error);
      }
    }

    return compInfoArr;
  }

  async getCampAvailDatesWithIn(
    areaBit: number,
  ): Promise<Array<CampAvailDates>> {
    if (areaBit == 0) {
      return this.getAllCampAvailDates();
    }

    const campAreaArr = numToCampArea(areaBit);
    var compInfoArr = Array<CampAvailDates>();
    for (const area of campAreaArr) {
      try {
        for (const site of campSiteKeys[area as keyof typeof campSiteKeys]) {
          const campInfo = await this.getCampAvailDates(site);
          compInfoArr.push(campInfo);
        }
      } catch (error) {
        console.error(error);
      }
    }

    return compInfoArr;
  }

  async getCampAvailDates(site: string): Promise<CampAvailDates> {
    const availDatesStr = await redis.hget(site, "availDates");
    const updateTime = await redis.hget(site, "updateTime");

    const availDates = availDatesStr?.split(",");

    return new CampAvailDates(site, availDates, updateTime);
  }
}

const redisRepo = RedisRepository.instance;

export { redisRepo };
