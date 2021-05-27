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
  seoul = "seoul",
  gyeonggi = "gyeonggi",
  inchoen = "inchoen",
  chungnam = "chungnam",
  chungbuk = "chungbuk",
  gangwon = "gangwon",
  etc = "etc",
}

// 강원 충북  충남  인천  경기  서울
// 32  16   8    4    2    1
function campAreatoBit(area: CampArea): number {
  switch (area) {
    case CampArea.seoul:
      return 1;
    case CampArea.gyeonggi:
      return 2;
    case CampArea.inchoen:
      return 4;
    case CampArea.chungnam:
      return 8;
    case CampArea.chungbuk:
      return 16;
    case CampArea.gangwon:
      return 32;
    default:
      return 0;
  }
}

export function numToCampArea(bit: number): CampArea[] {
  var areaArr: CampArea[] = [];

  while (bit > 0) {
    if (bit >= campAreatoBit(CampArea.gangwon)) {
      bit -= campAreatoBit(CampArea.gangwon);
      areaArr.push(CampArea.gangwon);
    } else if (bit >= campAreatoBit(CampArea.chungbuk)) {
      bit -= campAreatoBit(CampArea.chungbuk);
      areaArr.push(CampArea.chungbuk);
    } else if (bit >= campAreatoBit(CampArea.chungnam)) {
      bit -= campAreatoBit(CampArea.chungnam);
      areaArr.push(CampArea.chungnam);
    } else if (bit >= campAreatoBit(CampArea.inchoen)) {
      bit -= campAreatoBit(CampArea.inchoen);
      areaArr.push(CampArea.inchoen);
    } else if (bit >= campAreatoBit(CampArea.gyeonggi)) {
      bit -= campAreatoBit(CampArea.gyeonggi);
      areaArr.push(CampArea.gyeonggi);
    } else if (bit >= campAreatoBit(CampArea.seoul)) {
      bit -= campAreatoBit(CampArea.seoul);
      areaArr.push(CampArea.seoul);
    }
  }

  return areaArr;
}
