import "https://deno.land/x/dotenv/load.ts";
import {
  Database,
  MySQLConnector,
} from "https://deno.land/x/denodb@v1.0.40/mod.ts";
import { Comment, Posts } from "../models/posts.ts";
import { User } from "../models/user.ts";
import { Site } from "../models/site.ts";
import { Favorite } from "../models/favorite.ts";
import { Push } from "../models/push.ts";
import { Report } from "../models/report.ts";
import { Review } from "../models/review.ts";
import { Good } from "../models/good.ts";

const connector = new MySQLConnector({
  database: "camp",
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_ID")!,
  password: Deno.env.get("DB_PW")!,
});

const db = new Database(connector);
db.link([Posts, Comment, User, Site, Favorite, Push, Report, Review, Good]);

class PostsRepository {
  async getPosts(id: number) {
    // 해보고 안되면 걍 db.query 이거 사용하기
    const posts = await Posts
      .join(User, User.field("user_id"), Posts.field("user_id"))
      .select(
        "id",
        "type",
        "title",
        "body",
        "updated_at",
        User.field("nick"),
        User.field("user_id"),
        "good_count",
      )
      .find(id);

    const comments = await Comment
      .where("post_id", id)
      .join(User, User.field("user_id"), Comment.field("user_id"))
      .select(
        "id",
        "post_id",
        "comment",
        "updated_at",
        User.field("nick"),
        User.field("user_id"),
        "good_count",
      )
      .orderBy("id", "desc")
      .all();

    return {
      posts: posts,
      commentList: comments,
    };
  }

  async getHomePosts() {
    const amountOfPage = 9;
    const query = Posts
      .join(User, User.field("user_id"), Posts.field("user_id"))
      .select(
        "id",
        "type",
        "title",
        "updated_at",
        "comment_count",
        User.field("nick"),
        User.field("user_id"),
        "good_count",
      )
      .orderBy("id", "desc")
      .take(amountOfPage);

    const notice = await query.where("type", 0)
      .get();

    const posts = await query.where("type", ">", 0)
      .get();

    return {
      "notice_list": notice,
      "posts_list": posts,
    };
  }

  async getAllPostsWith(page: number) {
    const amountOfPage = 10;

    return await Posts
      .join(User, User.field("user_id"), Posts.field("user_id"))
      .select(
        "id",
        "type",
        "title",
        "body",
        "updated_at",
        "comment_count",
        User.field("nick"),
        User.field("user_id"),
        "good_count",
      )
      .orderBy("id", "desc")
      .offset(amountOfPage * (page - 1))
      .take(amountOfPage)
      .get();
  }

  async getPostsWith(page: number, isNotice: boolean) {
    const amountOfPage = 10;

    const query = Posts;

    if (isNotice) {
      query.where("type", "0");
    } else {
      query.where("type", ">", 0);
    }

    return await query
      .join(User, User.field("user_id"), Posts.field("user_id"))
      .select(
        "id",
        "type",
        "title",
        "body",
        "updated_at",
        "comment_count",
        User.field("nick"),
        User.field("user_id"),
        "good_count",
      )
      .orderBy("id", "desc")
      .offset(amountOfPage * (page - 1))
      .take(amountOfPage)
      .get();
  }

  async getComment(id: number) {
    const comments = await Comment.join(
      User,
      User.field("user_id"),
      Comment.field("user_id"),
    ).find(id);
    return comments;
  }

  async getGood(type: number, id: number) {
    const goodInfoList = await Good
      .where("type", type)
      .where("type_id", id)
      .join(User, User.field("user_id"), Good.field("user_id"))
      .select("nick", "profile_url")
      .all();
    return goodInfoList;
  }

  async createPosts(
    type: number,
    title: string,
    body: string,
    userId: string,
  ) {
    const posts = new Posts();
    posts.type = type;
    posts.title = title;
    posts.body = body;
    posts.user_id = userId;

    return await posts.save();
  }

  async createComment(postId: number, userId: string, body: string) {
    await Comment.create({
      post_id: postId,
      user_id: userId,
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

  // type: 0 - 게시물 / 1 - 댓글
  async createGood(type: number, id: number, userId: string) {
    const good = new Good();
    good.type = type;
    good.type_id = id;
    good.user_id = userId;
    good.save();

    if (type == 0) { // 게시물
      const posts = await Posts.find(id);
      const goodCount = posts.good_count as number;
      posts.good_count = goodCount + 1;
      return await posts.update();
    } else if (type == 1) { // 댓글
      const comment = await Comment.find(id);
      const goodCount = comment.good_count as number;
      comment.good_count = goodCount + 1;
      return await comment.update();
    } else {
      return good;
    }

    // 트랜잭션 문제 해결되면 바꿔라
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
    return await Comment.where("id", id).delete();

    // 트랜젝션에 문제가 있음. denoDB 업데이트 필요
    // return await db.transaction(async () => {
    //   const posts = await Posts.find(postId);
    //   const commentCount = posts.comment_count as number;
    //   posts.comment_count = commentCount - 1;
    //   await posts.update();
    //   await await Comment.where("id", id).delete();
    // });
  }

  async deleteGood(id: number) {
    const model = await Good.find(id);
    const typeId = model.type_id as number;

    if (model.type == 0) { // 게시물
      const posts = await Posts.find(typeId);
      const goodCount = posts.good_count as number;
      posts.good_count = goodCount - 1;
      return await posts.update();
    } else if (model.type == 1) { // 댓글
      const comment = await Comment.find(typeId);
      const goodCount = comment.good_count as number;
      comment.good_count = goodCount - 1;
      return await comment.update();
    }

    await model.delete();
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
      "profile_url",
    )
      .find(uid);

    const favorites = await Favorite.select("camp_id").where("user_id", uid)
      .all();

    const goodList = await Good.select("id").where("user_id", uid)
      .all();
    return {
      "user": user,
      "favorite_list": favorites,
      "good_list": goodList,
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
    return await Favorite
      .select("camp_id")
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
  ) {
    return await User.where("user_id", uid).update("nick", nick);
  }

  async updateUserProfileUrl(
    uid: string,
    url: string,
  ) {
    return await User.where("user_id", uid).update("profile_url", url);
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
