import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

export class Site extends Model {
  static table = "site";

  static fields = {
    id: {
      type: DataTypes.string(24),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.string(20),
      allowNull: false,
    },
    addr: {
      type: DataTypes.string(40),
      allowNull: false,
    },
    desc: {
      type: DataTypes.string(45),
      allowNull: false,
    },
    phone: {
      type: DataTypes.string(14),
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
      type: DataTypes.string(120),
      allowNull: false,
    },
    reservation_url: {
      type: DataTypes.string(120),
      allowNull: false,
    },
    reservation_open: {
      type: DataTypes.string(15),
      allowNull: false,
    },
  };
}
