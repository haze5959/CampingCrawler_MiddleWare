import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

export class User extends Model {
  static table = "user";

  static fields = {
    user_id: {
      type: DataTypes.string(30),
      primaryKey: true,
      allowNull: false,
    },
    nick: {
      type: DataTypes.string(40),
      allowNull: false,
    },
    auth_level: DataTypes.INTEGER,
    area_bit: DataTypes.INTEGER,
    use_push_area_on_holiday: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    use_push_site_on_holiday: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    use_push_reservation_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    use_push_notice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  };
}
