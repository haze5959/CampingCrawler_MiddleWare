import { SiteSimpleInfo } from "../models/site.ts";
import { siteRepo } from "../repository/dbRepository.ts";

class Singleton {
  private static _instance = new Singleton();
  private constructor() {
  }

  static get instance() {
    return this._instance;
  }

  holidaysInFourMonth: { [key: string]: string } = {};

  siteSimpleInfo: SiteSimpleInfo[] = [];

  async updateHolidayInFourMonth() {
    this.holidaysInFourMonth = {};

    try {
      for (let i = 0; i < 4; i++) {
        const searchDate = new Date();
        searchDate.setMonth(searchDate.getMonth() + i);
        const month = String(searchDate.getMonth() + 1).padStart(2, "0");
        const year = searchDate.getFullYear();
        // console.log("year - " + year + "month - " + month)
        const res = await fetch(
          `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=Hn1zrxA4VzEINy0sxFra88Pznz3ZZeKyvzHA3G5ikHFfeLG2VYUmpoYcZGZ0Pn3CcwsQXhaRUJM7qbYwbMakkA%3D%3D&solYear=${year}&solMonth=${month}`,
        );
        const text = await res.text();

        const itemsRegex = /<item>(.*?)<\/item>/g;
        const dateNameRegex = /<dateName>(.*)<\/dateName>/;
        const locdateRegex = /<locdate>(.*)<\/locdate>/;
        const items = itemsRegex.exec(text);
        if (items != null) {
          for (const arg of items) {
            const dateNameResult = dateNameRegex.exec(arg);
            if (dateNameResult != null) {
              let dateName = dateNameResult[0];
              dateName = dateName.replace("<dateName>", "");
              dateName = dateName.replace("</dateName>", "");

              const locdateResults = locdateRegex.exec(arg);
              if (locdateResults != null) {
                let locdate = locdateResults[0];
                locdate = locdate.replace("<locdate>", "");
                locdate = locdate.replace("</locdate>", "");

                this.holidaysInFourMonth[locdate] = dateName;
              }
            }
          }
        }
      }

      console.log(this.holidaysInFourMonth);
    } catch (error) {
      console.error(error);
    }
  }

  async updatesiteSimpleInfo() {
    const data = await siteRepo.getAllSiteInfo();
    this.siteSimpleInfo = data.map((val) => {
      const siteInfoVal = val as Record<string, number | string>;
      return new SiteSimpleInfo(siteInfoVal);
    });
  }
}

const singleton = Singleton.instance;

export { singleton };

// reservation_open 규칙
// '1/2/3/4/5'
// 1 - (예약 오픈일) Y: 매년, M: 매월, W: 매주, D: 매일
// 2 - '1'에서 M의 경우에는 Day, '1'에서 W의 경우에는 요일, 그 외에는 안씀
// 3 - 시간
// 4 - (예약 오픈이 몇일 전에 열리는지) M: 매월, W: 매주
// 5 - '4'에 해당하는 날의 숫자

// "매일 (3개월 이후 자리 오픈)" => D///M/3
// "매주 일요일10시" => W/SUN/10//
// "매월 15일 14시" => M/15/14//
