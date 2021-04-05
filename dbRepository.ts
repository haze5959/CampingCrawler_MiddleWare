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

  async getUser(id: string, pw: string) {
    const users = await client.query(`SELECT * FROM camp.users WHERE id="${id}" AND pw="${pw}";`);
    return users.length > 0 ? users[0] : null;
  }

  async getPosts(id: number) {
    const posts = await client.query(`SELECT * FROM camp.post WHERE id=${id};`);
    if (posts.length > 0) {
      const comments = await client.query(
        `SELECT * FROM camp.comment WHERE post_id=${id} ORDER BY id DESC;`,
      );
  
      return {
        posts: posts[0],
        comments: comments,
      };
    } else {
      return null;
    }
  }

  async getHomePosts() {
    const amountOfPage = 5;

    const notice = await client.query(
      `SELECT id, type, title, nick, edit_time, comment_count FROM camp.post WHERE type=0 Limit 0, ${amountOfPage} ORDER BY id DESC;`,
    );
    const posts = await client.query(
      `SELECT id, type, title, nick, edit_time, comment_count FROM camp.post WHERE type!=0 Limit 0, ${amountOfPage} ORDER BY id DESC;`,
    );

    return {
      "notice": notice,
      "posts": posts
    };
  }

  async getPostsWith(page: number, typeArr: string[]) {
    const amountOfPage = 10;

    if (typeArr.length == 0) {
      return await client.query(
        `SELECT id, type, title, nick, edit_time, comment_count FROM camp.post ORDER BY id DESC Limit ${amountOfPage *
          page}, ${amountOfPage};`,
      );
    } else {
      const reducer = (acc: string, curr: string) => acc + ` OR type=${Number(curr)}`;
      const first = typeArr.pop();
      const sqlFilter = typeArr.reduce(reducer, `type=${Number(first)}`)

      return await client.query(
        `SELECT id, type, title, nick, edit_time, comment_count FROM camp.post WHERE ${sqlFilter} ORDER BY id DESC Limit ${amountOfPage *
          page}, ${amountOfPage};`,
      );
    }
  }

  async createPosts(
    type: number,
    title: string,
    body: string,
    nick: string,
    secretKey: string | null,
  ) {
    if (secretKey == null) {
      return await client.execute(
        `INSERT INTO camp.post (type, title, body, nick, edit_time, comment_count)
      values(${type}, "${title}", "${body}", "${nick}", now(), 0);`,
      );
    } else {
      return await client.execute(
        `INSERT INTO camp.post (type, title, body, nick, edit_time, comment_count, secret_key)
      values(${type}, "${title}", "${body}", "${nick}", now(), 0, "${secretKey}");`,
      );
    }
  }

  async createComment(postId: number, nick: string, comment: string) {
    return await client.transaction(async (conn) => {
      await conn.execute(
        `INSERT INTO camp.comment (post_id, nick, comment, edit_time)
      values(${postId}, "${nick}", "${comment}", now());`,
      );

      return await conn.execute(
        `UPDATE camp.post SET comment_count=comment_count+1 WHERE id=${postId};`,
      );
    });
  }

  async deletePosts(id: number) {
    return await client.transaction(async (conn) => {
      await conn.execute(
        `DELETE FROM camp.comment WHERE post_id=${id};`,
      );

      return await conn.execute(
        `DELETE FROM camp.post WHERE id=${id};`,
      );
    });
  }

  async deleteComment(id: number) {
    return await client.execute(
      `DELETE FROM camp.comment WHERE id=${id};`,
    );
  }
}

export { DBRepository };
