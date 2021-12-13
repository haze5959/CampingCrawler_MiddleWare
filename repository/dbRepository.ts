import "https://deno.land/x/dotenv/load.ts";
// import { Database, MySQLConnector } from "https://deno.land/x/denodb/mod.ts";
import { Database, MySQLConnector } from "../utils/denodb-update-deps/mod.ts";
import { Comment, Posts } from "../models/posts.ts";
import { User } from "../models/user.ts";
import { Site } from "../models/site.ts";
import { Favorite } from "../models/favorite.ts";
import { Push } from "../models/push.ts";
import { Report } from "../models/report.ts";

const connector = new MySQLConnector({
  database: "camp",
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_ID")!,
  password: Deno.env.get("DB_PW")!,
});

const db = new Database(connector);
db.link([Posts, Comment, User, Site, Favorite, Push, Report]);

class PostsRepository {
  async getPosts(id: number) {
    const posts = await Posts.find(id);
    const comments = await Comment.where("post_id", id)
      .orderBy("id", "desc")
      .all();
    return {
      posts: posts,
      commentList: comments,
    };
  }

  async getHomePosts() {
    const amountOfPage = 5;
    const notice = await Posts.where("type", 0)
      .select("id", "type", "title", "nick", "updated_at", "comment_count")
      .orderBy("id", "desc")
      .take(amountOfPage)
      .get();

    const posts = await Posts.where("type", ">", 0)
      .select("id", "type", "title", "nick", "updated_at", "comment_count")
      .orderBy("id", "desc")
      .take(amountOfPage)
      .get();

    return {
      "notice_list": notice,
      "posts_list": posts,
    };
  }

  async getAllPostsWith(page: number) {
    const amountOfPage = 10;

    return await Posts.select(
      "id",
      "type",
      "title",
      "nick",
      "updated_at",
      "comment_count",
    )
      .orderBy("id", "desc")
      .offset(amountOfPage * (page - 1))
      .take(amountOfPage)
      .get();
  }

  async getPostsWith(page: number, isNotice: boolean) {
    const amountOfPage = 10;

    const query = Posts.select(
      "id",
      "type",
      "title",
      "nick",
      "updated_at",
      "comment_count",
    );

    if (isNotice) {
      query.where("type", "0");
    } else {
      query.where("type", ">", 0);
    }

    return await query
      .orderBy("id", "desc")
      .offset(amountOfPage * (page - 1))
      .take(amountOfPage)
      .get();
  }

  async getComment(id: number) {
    const comments = await Comment.find(id);
    return comments;
  }

  async createPosts(
    type: number,
    title: string,
    body: string,
    nick: string,
  ) {
    const posts = new Posts();
    posts.type = type;
    posts.title = title;
    posts.body = body;
    posts.nick = nick;

    return await posts.save();
  }

  async createComment(postId: number, nick: string, body: string) {
    await Comment.create({
      post_id: postId,
      nick: nick,
      comment: body,
    });

    const posts = await Posts.find(postId);
    const commentCount = posts.comment_count as number;
    posts.comment_count = commentCount + 1;
    return await posts.update();

    // 트랜젝션에 문제가 있음. denoDB 업데이트 필요
    // return await db.transaction(async () => {
    //   await Comment.create({
    //     post_id: postId,
    //     nick: nick,
    //     comment: body,
    //    });

    //   const posts = await Posts.find(postId);
    //   const commentCount = posts.comment_count as number;
    //   posts.comment_count = commentCount + 1;
    //   await posts.update();
    // });
  }

  async deletePosts(id: number) {
    await Posts.deleteById(id);
    return await Comment.where("post_id", id).delete();
    // 트랜젝션에 문제가 있음. denoDB 업데이트 필요
    // return await db.transaction(async () => {
    //   await Posts.deleteById(id);
    //   await Comment.where("post_id", id).delete();
    // });
  }

  async deleteComment(id: number, postId: number) {
    const posts = await Posts.find(postId);
    const commentCount = posts.comment_count as number;
    posts.comment_count = commentCount - 1;
    await posts.update();
    return await await Comment.where("id", id).delete();

    // 트랜젝션에 문제가 있음. denoDB 업데이트 필요
    // return await db.transaction(async () => {
    //   const posts = await Posts.find(postId);
    //   const commentCount = posts.comment_count as number;
    //   posts.comment_count = commentCount - 1;
    //   await posts.update();
    //   await await Comment.where("id", id).delete();
    // });
  }
}

class UserRepository {
  async getUser(uid: string) {
    const user = await User.select(
      "nick",
      "auth_level",
      "area_bit",
      "use_push_area_on_holiday",
      "use_push_site_on_holiday",
      "use_push_reservation_day",
      "use_push_notice",
    )
      .find(uid);

    const favorites = await Favorite.select("camp_id").where("user_id", uid)
      .all();
    return {
      "user": user,
      "favorite_list": favorites,
    };
  }

  async getUserPushInfo(uid: string) {
    return await User.where(User.field("user_id"), uid)
      .join(Push, Push.field("id"), User.field("user_id"))
      .select(
        "area_bit",
        "use_push_area_on_holiday",
        "use_push_site_on_holiday",
        "use_push_reservation_day",
        "use_push_notice",
      )
      .get();
  }

  async getFavorite(uid: string) {
    return await Favorite.select("camp_id")
      .where("user_id", uid);
  }

  async createUser(
    uid: string,
    nick: string,
  ) {
    const user = new User();
    user.uid = uid;
    user.nick = nick;

    return await user.save();
  }

  async deleteUser(
    uid: string,
  ) {
    return await User.where("user_id", uid).delete();
  }

  async checkUserNick(
    nick: string,
  ) {
    const results = await User.where("nick", nick).count();
    return results > 0;
  }

  async updateUserNick(
    uid: string,
    nick: string,
    oldNick: string,
  ) {
    await Posts.where("nick", oldNick).update("nick", nick);
    await Comment.where("nick", oldNick).update("nick", nick);
    return await User.where("user_id", uid).update("nick", nick);
    // 트랜젝션에 문제가 있음. denoDB 업데이트 필요
    // return await db.transaction(async () => {
    //   await Posts.where("nick", oldNick).update("nick", nick);
    //   await Comment.where("nick", oldNick).update("nick", nick);
    //   await User.where("user_id", uid).update("nick", nick);
    // });
  }

  async updateUserArea(
    uid: string,
    areaBit: number,
  ) {
    return await User.where("user_id", uid).update("area_bit", areaBit);
  }

  async createUserFavorite(
    uid: string,
    campId: string,
  ) {
    const favorite = new Favorite();
    favorite.user_id = uid;
    favorite.camp_id = campId;
    return await favorite.save();
  }

  async deleteUserFavorite(
    uid: string,
    campId: string,
  ) {
    return await Favorite.where("user_id", uid)
      .where("camp_id", campId)
      .delete();
  }

  async createReport(
    uid: string,
    title: string,
    body: string,
  ) {
    const report = new Report();
    report.user_id = uid;
    report.title = title;
    report.body = body;
    return await report.save();
  }

  async updateReport(
    id: number,
    state: number,
  ) {
    return await Report.where("id", id).update("state", state);
  }

  async deleteReport(
    id: number,
  ) {
    return await Report.where("id", id)
      .delete();
  }
}

class SiteRepository {
  async getSiteInfo(id: string) {
    return await Site.find(id);
  }

  async getAllSiteInfo() {
    return await Site.select("id", "name", "addr", "area", "reservation_open")
      .all();
  }
}

const postsRepo = new PostsRepository();
const userRepo = new UserRepository();
const siteRepo = new SiteRepository();

export { postsRepo, siteRepo, userRepo };
