import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts';

export class Site extends Model {
    static table = 'site';

    static fields = {
        id: {
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            length: 50,
        },
    };
}