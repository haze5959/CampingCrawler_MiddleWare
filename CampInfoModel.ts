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

export { CampInfo };