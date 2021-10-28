import { parse } from "https://deno.land/x/xml/mod.ts";
import { CampArea } from "../models/campInfo.ts";
import { siteRepo } from "../repository/dbRepository.ts";

interface Header {
  resultCode: number;
  resultMsg: string;
}

interface Item {
  dateKind: number;
  dateName: string;
  isHoliday: string;
  locdate: string;
  seq: number;
}

interface Items {
  item: [Item] | Item;
}

interface Body {
  items: Items | null;
  numOfRows: number;
  pageNo: number;
  totalCount: number;
}

interface RootObject {
  header: Header;
  body: Body;
}

interface HolidayResponse {
  response: RootObject;
}

class SiteInfo {
  id: string;
  name: string;
  addr: string;
  area: CampArea;
  reservationOpen: string

  constructor(json: Record<string, number | string>) {
    this.id = json["id"] as string;
    this.name = json["name"] as string;
    this.addr = json["addr"] as string;
    this.area = json["area"] as number;
    this.reservationOpen = json["reservation_open"] as string;
  }
}

class Singleton {
  private static _instance = new Singleton();
  private constructor() {
  }

  static get instance() {
    return this._instance;
  }

  holidaysInFourMonth: { [key: string]: string } = {};

  siteSimpleInfo: SiteInfo[] = [];

  async updateHolidayInFourMonth() {
    this.holidaysInFourMonth = {};
    
    try {
      for (let i = 0; i < 4; i++) {
        const searchDate = new Date()
        searchDate.setMonth(searchDate.getMonth() + i);
        const month = String(searchDate.getMonth() + 1).padStart(2, "0");
        const year = searchDate.getFullYear();
        // console.log("year - " + year + "month - " + month)
        const res = await fetch(
          `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=Hn1zrxA4VzEINy0sxFra88Pznz3ZZeKyvzHA3G5ikHFfeLG2VYUmpoYcZGZ0Pn3CcwsQXhaRUJM7qbYwbMakkA%3D%3D&solYear=${year}&solMonth=${month}`,
        );
        const text = await res.text();
        const result = parse(text) as HolidayResponse;
        const items = result.response.body.items;
        if (items != null) {
          const item = items.item;
          if (item instanceof Array) {
            for (const arg of item) {
              this.holidaysInFourMonth[arg.locdate] = arg.dateName;
            }
          } else {
            this.holidaysInFourMonth[item.locdate] = item.dateName;
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
    this.siteSimpleInfo = data.map(val => {
      return new SiteInfo(val);
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