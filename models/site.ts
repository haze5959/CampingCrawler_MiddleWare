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
      allowNull: false,
    },
    addr: {
      type: DataTypes.STRING,
      length: 40,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      length: 45,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      length: 14,
      allowNull: false,
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    lon: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    area: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    homepage_url: {
      type: DataTypes.STRING,
      length: 120,
      allowNull: false,
    },
    reservation_url: {
      type: DataTypes.STRING,
      length: 120,
      allowNull: false,
    },
    reservation_open: {
      type: DataTypes.STRING,
      length: 15,
      allowNull: false,
    },
  };
}

export class SiteSimpleInfo {
  id: string;
  name: string;
  addr: string;
  area: CampArea;
  reservationOpen: string;

  constructor(json: Record<string, number | string>) {
    this.id = json["id"] as string;
    this.name = json["name"] as string;
    this.addr = json["addr"] as string;
    this.area = json["area"] as number;
    this.reservationOpen = json["reservation_open"] as string;
  }
}
