import { Client } from "https://deno.land/x/mysql/mod.ts";
import { DBAccount } from "./redisAccount.ts";

const client = await new Client();

client.connect({
  hostname: DBAccount.host,
  username: DBAccount.id,
  password: DBAccount.pw,
  db: "",
});

class DBRepository {
  constructor() {
  }

  async getAllPosts() {
    return await client.query(`SELECT * FROM camp.post`);
  }

  async createPosts(type: number, title: string, body: string, nick: string) {
    return await client.query(
      `INSERT INTO camp.post (type, title, body, nick, edit_time, comment_count)
    values(${type}, ${title}, ${body}, ${nick}, now(), 0);`,
    );
  }
}

export { DBRepository };
