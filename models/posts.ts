import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts';

export class Posts extends Model {
    static table = 'post';

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

export class Comment extends Model {
    static table = 'comment';

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