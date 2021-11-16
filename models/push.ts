import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

export class Push extends Model {
    static table = "push";

    static fields = {
        user_id: {
            type: DataTypes.STRING,
            length: 30,
            primaryKey: true,
            allowNull: false,
        },
    };
}
