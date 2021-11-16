import "https://deno.land/x/dotenv/load.ts";
import { Database, MySQLConnector } from "https://deno.land/x/denodb/mod.ts";
import { Posts, Comment } from "../models/posts.ts";
import { User } from "../models/user.ts";
import { Site } from "../models/site.ts";
import { Favorite } from "../models/favorite.ts";
import { Push } from "../models/push.ts";

// https://eveningkid.com/denodb-docs/docs/api/model-methods
const connector = new MySQLConnector({
  database: 'camp',
  host: Deno.env.get("DB_HOST")!,
  username: Deno.env.get("DB_ID")!,
  password: Deno.env.get("DB_PW")!
});

const db = new Database(connector);
db.link([Posts, Comment, User, Site, Favorite, Push]);

class PostsRepository {
  async getPosts(id: number) {
    const posts = await Posts.find(id);
    const comments = await Comment.where('post_id', id)
      .orderBy('desc')
      .all();
    return {
      posts: posts,
      comments: comments,
    };
  }

  async getHomePosts() {
    const amountOfPage = 5;
    const notice = await Posts.where('type', 0)
      .select('id', 'type', 'title', 'nick', 'edit_time', 'comment_count')
      .orderBy('desc')
      .take(amountOfPage)
      .get();

    const posts = await Posts.where('type', '>', 0)
      .select('id', 'type', 'title', 'nick', 'edit_time', 'comment_count')
      .orderBy('desc')
      .take(amountOfPage)
      .get();

    return {
      "notice": notice,
      "posts": posts,
    };
  }

  async getPostsWith(page: number, typeArr: string[]) {
    const amountOfPage = 10;

    if (typeArr.length == 0) {
      return await Posts.select('id', 'type', 'title', 'nick', 'edit_time', 'comment_count')
        .orderBy('desc')
        .offset(amountOfPage * page)
        .take(amountOfPage)
        .get();
    } else {
      const query = Posts.select('id', 'type', 'title', 'nick', 'edit_time', 'comment_count')
      for (const type in typeArr) {
        query.where('type', Number(type))
      }

      return await query
        .orderBy('desc')
        .offset(amountOfPage * page)
        .take(amountOfPage)
        .get();
    }
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
    return await db.transaction(async () => {
      const comment = new Comment();
      comment.post_id = postId;
      comment.nick = nick;
      comment.comment = body;
      await comment.save();

      const posts = await Posts.find(postId);
      const commentCount = posts.comment_count as number;
      posts.comment_count = commentCount + 1;
      await posts.update()
    });
  }

  async deletePosts(id: number) {
    return await db.transaction(async () => {
      await Posts.deleteById(id);
      await Comment.where('post_id', id).delete();
    });
  }

  async deleteComment(id: number, postId: number) {
    return await db.transaction(async () => {
      const posts = await Posts.find(postId);
      const commentCount = posts.comment_count as number;
      posts.comment_count = commentCount - 1;
      await posts.update();
      await await Comment.where('id', id).delete();
    });
  }
}

class UserRepository {
  async getUser(uid: string) {
    const user = await User.select('nick', 'auth_level', 'area_bit', 'use_push_area_on_holiday',
      'use_push_site_on_holiday', 'use_push_reservation_day', 'use_push_notice')
      .find(uid)

    const favorites = await Favorite.select('camp_id').where('user_id', uid).all();
    return {
      "user": user,
      "favorite": favorites,
    }
  }

  async getUserPushInfo(uid: string) {
    return await User.where(User.field('user_id'), uid)
      .join(Push, Push.field('id'), User.field('user_id'))
      .select('area_bit', 'use_push_area_on_holiday',
        'use_push_site_on_holiday', 'use_push_reservation_day', 'use_push_notice')
      .get();
  }

  async getFavorite(uid: string) {
    return await Favorite.select('camp_id')
      .where('user_id', uid)
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
    return await User.where('user_id', uid).delete();;
  }

  async checkUserNick(
    nick: string,
  ) {
    const results = await User.where('nick', nick).count();
    return results > 0;
  }

  async updateUserNick(
    uid: string,
    nick: string,
    oldNick: string,
  ) {
    return await db.transaction(async () => {
      await Posts.where('nick', oldNick).update('nick', nick);
      await Comment.where('nick', oldNick).update('nick', nick);
      await User.where('user_id', uid).update('nick', nick);
    });
  }

  async updateUserArea(
    uid: string,
    areaBit: number,
  ) {
    return await User.where('user_id', uid).update('area_bit', areaBit);
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
    return await Favorite.where('user_id', uid)
      .where('camp_id', campId)
      .delete();
  }
}

class SiteRepository {
  async getSiteInfo(id: string) {
    return await Site.find(id);
  }

  async getAllSiteInfo() {
    return await Site.select('id', 'name', 'addr', 'area', 'reservation_open').all();
  }
}

const postsRepo = new PostsRepository();
const userRepo = new UserRepository();
const siteRepo = new SiteRepository();

export { postsRepo, siteRepo, userRepo };
