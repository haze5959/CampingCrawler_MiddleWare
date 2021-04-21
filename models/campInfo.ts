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

enum CampArea {
  seoul = "CampArea.seoul",
  gyeonggi = "CampArea.gyeonggi",
  inchoen = "CampArea.inchoen",
  chungnam = "CampArea.chungnam",
  chungbuk = "CampArea.chungbuk",
  gangwon = "CampArea.gangwon",
  etc = "CampArea.etc",
}

export { CampInfo, CampArea };