import { singleton } from "../utils/singleton.ts";

export class CampAvailDates {
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

export enum CampArea {
  seoul = 1,
  gyeonggi = 2,
  inchoen = 4,
  chungnam = 8,
  chungbuk = 16,
  gangwon = 32,
  etc = 64,
}

export const campAreaAllBit = CampArea.seoul + CampArea.gyeonggi +
  CampArea.inchoen +
  CampArea.chungnam + CampArea.chungbuk + CampArea.gangwon + CampArea.etc;

export function campSiteWithAreaBit(bit: number): string[] {
  let searchAreaArr: CampArea[] = [];

  while (bit > 0) {
    if (bit >= CampArea.gangwon) {
      bit -= CampArea.gangwon;
      searchAreaArr.push(CampArea.gangwon);
    } else if (bit >= CampArea.chungbuk) {
      bit -= CampArea.chungbuk;
      searchAreaArr.push(CampArea.chungbuk);
    } else if (bit >= CampArea.chungnam) {
      bit -= CampArea.chungnam;
      searchAreaArr.push(CampArea.chungnam);
    } else if (bit >= CampArea.inchoen) {
      bit -= CampArea.inchoen;
      searchAreaArr.push(CampArea.inchoen);
    } else if (bit >= CampArea.gyeonggi) {
      bit -= CampArea.gyeonggi;
      searchAreaArr.push(CampArea.gyeonggi);
    } else if (bit >= CampArea.seoul) {
      bit -= CampArea.seoul;
      searchAreaArr.push(CampArea.seoul);
    }
  }

  const siteIdArr: string[] = singleton.siteSimpleInfo
    .filter((element) => {
      return searchAreaArr.includes(element.area_bit);
    })
    .map((value) => value.key);

  return siteIdArr;
}
