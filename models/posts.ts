import { DataTypes, Model } from "https://deno.land/x/denodb@v1.0.40/mod.ts";

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
    user_id: DataTypes.string(30),
    comment_count: DataTypes.INTEGER,
    good_count: DataTypes.INTEGER,
  };

  id!: number;
  type!: number;
  title!: string;
  body!: string;
  user_id!: string;
  comment_count!: number;
  good_count!: number;
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
    user_id: DataTypes.string(30),
    comment: DataTypes.TEXT,
    good_count: DataTypes.INTEGER,
  };

  id!: number;
  post_id!: number;
  user_id!: string;
  comment!: string;
  good_count!: number;
}
