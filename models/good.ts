import { DataTypes, Model } from "https://deno.land/x/denodb@v1.0.40/mod.ts";

export class Good extends Model {
  static table = "good";

  static fields = {
    type: DataTypes.INTEGER,
    type_id: DataTypes.INTEGER,
    user_id: DataTypes.string(30),
  };

  type!: number;
  type_id!: number;
  user_id!: string;
}
