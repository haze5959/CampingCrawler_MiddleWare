// import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";
import { DataTypes, Model } from "../utils/denodb-update-deps/mod.ts";

export class Posts extends Model {
  static table = "post";
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: DataTypes.string(45),
    body: DataTypes.TEXT,
    nick: DataTypes.string(20),
    comment_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nick: DataTypes.string(20),
    comment: DataTypes.TEXT,
  };
}
