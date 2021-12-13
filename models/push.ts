import { DataTypes, Model } from "https://deno.land/x/denodb@v1.0.40/mod.ts";

export class Push extends Model {
  static table = "push";

  static fields = {
    device_id: {
      type: DataTypes.STRING,
      length: 30,
      primaryKey: true,
    },
    purchase_id: {
      type: DataTypes.STRING,
      length: 20,
    },
    user_id: {
      type: DataTypes.STRING,
      length: 30,
    },
    fcm_token: {
      type: DataTypes.STRING,
      length: 255,
    },
  };

  device_id!: string;
  purchase_id!: string;
  user_id!: string;
  fcm_token!: string;
}
