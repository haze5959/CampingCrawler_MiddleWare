import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

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
            allowNull: false,
        },
        camp_id: {
            type: DataTypes.STRING,
            length: 20,
            allowNull: false,
        },
    };
}
