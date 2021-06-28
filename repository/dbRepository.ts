import "https://deno.land/x/dotenv/load.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";

const client = await new Client();

client.connect({
  hostname: Deno.env.get("DB_HOST"),
  username: Deno.env.get("DB_ID"),
  password: Deno.env.get("DB_PW"),
  db: "",
});

class PostsRepository {
  private static _instance = new PostsRepository();
  private constructor() {
  }

  static get instance() {
    return this._instance;
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
      `SELECT id, type, title, nick, edit_time, comment_count FROM camp.post WHERE type=0 ORDER BY id DESC Limit 0, ${amountOfPage};`,
    );
    const posts = await client.query(
      `SELECT id, type, title, nick, edit_time, comment_count FROM camp.post WHERE type!=0 ORDER BY id DESC Limit 0, ${amountOfPage};`,
    );

    return {
      "notice": notice,
      "posts": posts,
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
      const reducer = (acc: string, curr: string) =>
        acc + ` OR type=${Number(curr)}`;
      const first = typeArr.pop();
      const sqlFilter = typeArr.reduce(reducer, `type=${Number(first)}`);

      return await client.query(
        `SELECT id, type, title, nick, edit_time, comment_count FROM camp.post WHERE ${sqlFilter} ORDER BY id DESC Limit ${amountOfPage *
          page}, ${amountOfPage};`,
      );
    }
  }

  async getComment(id: number) {
    const comments = await client.query(
      `SELECT * FROM camp.comment WHERE id=${id};`,
    );

    return comments[0];
  }

  async createPosts(
    type: number,
    title: string,
    body: string,
    nick: string,
  ) {
    return await client.execute(
      `INSERT INTO camp.post (type, title, body, nick, edit_time, comment_count)
    values(${type}, "${title}", "${body}", "${nick}", now(), 0);`,
    );
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

class UserRepository {
  private static _instance = new UserRepository();
  private constructor() {
  }

  static get instance() {
    return this._instance;
  }

  async getUser(uid: string) {
    const users = await client.query(
      `SELECT user_id, nick, auth_level, area_bit, use_push_area_on_holiday, 
      use_push_site_on_holiday, use_push_reserbation_day, use_push_notice 
      FROM camp.user WHERE user_id="${uid}";`,
    );
    return users.length > 0 ? users[0] : null;
  }

  async getUserPushInfo(uid: string) {
    const pushInfos = await client.query(
      `SELECT 
      area_bit, use_push_area_on_holiday, 
      use_push_site_on_holiday, use_push_reserbation_day, use_push_notice
      FROM camp.user WHERE user_id="${uid}";`,
    );
    return pushInfos.length > 0 ? pushInfos[0] : null;
  }

  async getFavorite(uid: string) {
    const favorites = await client.query(
      `SELECT * FROM camp.my_favorite WHERE user_id="${uid}";`,
    );
    return favorites;
  }

  async createUser(
    uid: string,
    nick: string,
  ) {
    const reulst = await client.execute(
      `INSERT INTO camp.user (user_id, nick, auth_level)
    values("${uid}", "${nick}", 0);`,
    );
    return reulst;
  }

  async checkUserNick(
    nick: string,
  ) {
    const results = await client.query(
      `SELECT COUNT(*) as length FROM camp.user WHERE nick="${nick}";`,
    );

    return results[0]["length"] > 0;
  }

  async updateUserNick(
    uid: string,
    nick: string,
  ) {
    const reulst = await client.execute(
      `UPDATE camp.user SET nick = ? WHERE user_id = ?`,
      [nick, uid],
    );
    return reulst;
  }

  async updateUserArea(
    uid: string,
    areaBit: number,
  ) {
    const reulst = await client.execute(
      `UPDATE camp.user SET area_bit = ? WHERE user_id = ?`,
      [areaBit, uid],
    );
    return reulst;
  }

  async createUserFavorite(
    uid: string,
    campId: string,
  ) {
    const reulst = await client.execute(
      `INSERT INTO camp.favorite (user_id, camp_id)
    values("${uid}", "${campId}");`,
    );
    return reulst;
  }

  async deleteUserFavorite(
    uid: string,
    campId: string,
  ) {
    return await client.execute(
      `DELETE FROM camp.favorite WHERE user_id=${uid} AND camp_id=${campId};`,
    );
  }
}

const postsRepo = PostsRepository.instance;
const userRepo = UserRepository.instance;

export { postsRepo, userRepo };
