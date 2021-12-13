// import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";
import { DataTypes, Model } from "../utils/denodb-update-deps/mod.ts";
import { CampArea } from "../models/campInfo.ts";

export class Site extends Model {
  static table = "site";

  static fields = {
    id: {
      type: DataTypes.STRING,
      length: 24,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      length: 20,
    },
    addr: {
      type: DataTypes.STRING,
      length: 40,
    },
    desc: {
      type: DataTypes.STRING,
      length: 45,
    },
    phone: {
      type: DataTypes.STRING,
      length: 14,
    },
    lat: DataTypes.FLOAT,
    lon: DataTypes.FLOAT,
    area: DataTypes.INTEGER,
    homepage_url: {
      type: DataTypes.STRING,
      length: 120,
    },
    reservation_url: {
      type: DataTypes.STRING,
      length: 120,
    },
    reservation_open: {
      type: DataTypes.STRING,
      length: 15,
    },
  };
}

export class SiteSimpleInfo {
  key: string;
  name: string;
  addr: string;
  area_bit: CampArea;
  reservation_open: string;

  constructor(json: Record<string, number | string>) {
    this.key = json["id"] as string;
    this.name = json["name"] as string;
    this.addr = json["addr"] as string;
    this.area_bit = json["area"] as number;
    this.reservation_open = json["reservation_open"] as string;
  }
}
