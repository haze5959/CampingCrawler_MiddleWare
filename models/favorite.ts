// import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";
import { DataTypes, Model } from "../utils/denodb-update-deps/mod.ts";

export class Favorite extends Model {
  static table = "my_favorite";

  static fields = {
    id: {
      type: DataTypes.STRING,
      length: 30,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      length: 30,
    },
    camp_id: {
      type: DataTypes.STRING,
      length: 20,
    },
  };

  id!: string;
  user_id!: string;
  camp_id!: string;
}
