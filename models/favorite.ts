import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

export class Favorite extends Model {
    static table = "my_favorite";

    static fields = {
        user_id: {
            type: DataTypes.STRING,
            length: 30,
            primaryKey: true,
            allowNull: false,
        },
        camp_id: {
            type: DataTypes.STRING,
            length: 40,
            allowNull: false,
        },
    };
}
