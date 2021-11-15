import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

export class Posts extends Model {
  static table = "post";

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
    edit_time: DataTypes.DATETIME,
    comment_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    secret_key: DataTypes.string(40),
  };
}

export class Comment extends Model {
  static table = "comment";

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
    edit_time: DataTypes.DATETIME,
  };
}
