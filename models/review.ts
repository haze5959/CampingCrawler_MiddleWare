import { DataTypes, Model } from "https://deno.land/x/denodb@v1.0.40/mod.ts";

export class Review extends Model {
  static table = "review";
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    camp_id: DataTypes.INTEGER,
    user_id: DataTypes.string(30),
    body: DataTypes.TEXT,
    star: DataTypes.INTEGER,
  };

  id!: number;
  camp_id!: number;
  user_id!: string;
  body!: string;
  star!: number;
}
