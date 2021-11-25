import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

export class Report extends Model {
  static table = "report";
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      length: 30,
    },
    title: {
      type: DataTypes.STRING,
      length: 45,
    },
    body: DataTypes.TEXT,

    /*
    0: New
    1: Ing
    2: Clear
    3: Hold
    */
    state: DataTypes.INTEGER,
  };

  static defaults = {
    state: 0,
  };
}
