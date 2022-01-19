import { DataTypes, Model } from "https://deno.land/x/denodb@v1.0.40/mod.ts";

export class Good extends Model {
  static table = "good";

  static fields = {
    id: DataTypes.INTEGER,
    type: DataTypes.INTEGER,  // 0 - 게시물 / 1 - 댓글
    type_id: DataTypes.INTEGER,
    user_id: DataTypes.string(30)
  };

  id!: number;
  type!: number;
  type_id!: number;
  user_id!: string;
}
