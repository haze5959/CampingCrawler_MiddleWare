import { connect } from "https://deno.land/x/redis/mod.ts";
import { RedisAccount } from "./redisAccount.ts";

const redis = await connect({
  hostname: RedisAccount.host,
  port: RedisAccount.port,
  password: RedisAccount.pw,
});

const campSiteKeys = ["camp_munsoo"];

class CampInfo {
  name: string;
  availDates: string[] | undefined;
  updatedDate: string | undefined;

  constructor(
    name: string,
    availDates: string[] | undefined,
    updatedDate: string | undefined,
  ) {
    this.name = name;
    this.availDates = availDates;
    this.updatedDate = updatedDate;
  }
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

  async getCampSpotInfo(site: string): Promise<CampInfo> {
    const availDatesStr = await redis.hget(site, "availDates");
    const updateTime = await redis.hget(site, "updateTime");

    const availDates = availDatesStr?.split(",")

    return new CampInfo(site, availDates, updateTime);
  }
}

export { RedisRepository };