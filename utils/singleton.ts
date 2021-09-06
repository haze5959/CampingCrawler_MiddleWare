import { parse, stringify } from "https://deno.land/x/xml/mod.ts";

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

class Singleton {
  private static _instance = new Singleton();
  private constructor() {
  }

  static get instance() {
    return this._instance;
  }

  holidaysInFourMonth: { [key: string]: string } = {};

  async updateHolidayInFourMonth() {
    this.holidaysInFourMonth = {};
    
    try {
      for (let i = 0; i < 4; i++) {
        const searchDate = new Date()
        searchDate.setMonth(searchDate.getMonth() + i);
        const month = String(searchDate.getMonth() + 1).padStart(2, "0");
        const year = searchDate.getFullYear();
        console.log("year - " + year + "month - " + month)
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
}

const singleton = Singleton.instance;

export { singleton };
