// import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";
import { DataTypes, Model } from "../utils/denodb-update-deps/mod.ts";

export class Posts extends Model {
  static table = "post";
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    type: DataTypes.INTEGER,
    title: DataTypes.string(45),
    body: DataTypes.TEXT,
    nick: DataTypes.string(20),
    comment_count: DataTypes.INTEGER,
    secret_key: DataTypes.string(40),
  };
}

export class Comment extends Model {
  static table = "comment";
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    post_id: DataTypes.INTEGER,
    nick: DataTypes.string(20),
    comment: DataTypes.TEXT,
  };

  id!: number
  post_id!: number
  nick!: string
  comment!: string
}
