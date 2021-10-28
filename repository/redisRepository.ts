import "https://deno.land/x/dotenv/load.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";
import { CampAvailDates, campSiteWithAreaBit } from "../models/campInfo.ts";
import { campAreaAllBit } from "../models/campInfo.ts";

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
    const campSiteArr = campSiteWithAreaBit(campAreaAllBit);
    var compInfoArr = Array<CampAvailDates>();
    try {
      for (const site in campSiteArr) {
        const campAvailDates = await this.getCampAvailDates(site);
        compInfoArr.push(campAvailDates);
      }
    } catch (error) {
      console.error(error);
    }

    return compInfoArr;
  }

  async getCampAvailDatesWithIn(
    areaBit: number,
  ): Promise<Array<CampAvailDates>> {
    if (areaBit == 0) {
      return this.getAllCampAvailDates();
    }

    const campSiteArr = campSiteWithAreaBit(areaBit);
    var compInfoArr = Array<CampAvailDates>();
    try {
      for (const site of campSiteArr) {
        const campInfo = await this.getCampAvailDates(site);
        compInfoArr.push(campInfo);
      }
    } catch (error) {
      console.error(error);
    }

    return compInfoArr;
  }

  async getCampAvailDates(site: string): Promise<CampAvailDates> {
    const availDatesStr = await redis.hget(site, "availDates");
    const updateTime = await redis.hget(site, "updateTime");

    const availDates = availDatesStr?.split(",");

    return new CampAvailDates(site, availDates, updateTime);
  }

  async getCampAvailDatesDatail(site: string): Promise<CampAvailDates> {
    const availDatesStr = await redis.hget(site, "availDetailDates");
    const updateTime = await redis.hget(site, "updateTime");

    const availDates = availDatesStr?.split(",");

    return new CampAvailDates(site, availDates, updateTime);
  }
}

const redisRepo = RedisRepository.instance;

export { redisRepo };
