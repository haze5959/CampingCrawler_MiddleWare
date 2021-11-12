import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts';

export class User extends Model {
    static table = 'users';

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