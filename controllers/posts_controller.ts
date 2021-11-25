import { postsRepo, userRepo } from "../repository/dbRepository.ts";
import { RouterContext } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { getAuthInfo } from "../utils/auth.ts";

import { User } from "../models/user.ts";

const emptyNick = "익명의 캠퍼";

export const getHomePosts = async (ctx: RouterContext) => {
  try {
    const data = await postsRepo.getHomePosts();
    response.body = { result: true, msg: "", data: data };
  } catch (error) {
    console.error(error);
    response.body = { result: false, msg: error };
  }
};

export const getPosts = async (ctx: RouterContext) => {
  if (params && params.id) {
    const id = Number(params.id);
    const token = request.url.searchParams.get("token") as string;
    try {
      const info = await postsRepo.getPosts(id);
      if (info != null && info.posts["type"] == 3) {
        const authInfo = await getAuthInfo(token);
        if (authInfo == null) {
          response.body = { result: false, msg: "auth fail" };
          return;
        } else {
          const userResult = await userRepo.getUser(authInfo.uid);
          const nick = userResult?.user["nick"];
          if (nick != info.posts["nick"]) {
            response.body = { result: false, msg: "Auth Fail" };
            return;
          }
        }
      }

      response.body = { result: true, msg: "", data: info };
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};

export const getPostsPage = async (ctx: RouterContext) => {
  if (params && params.page) {
    const page = Number(params.page);
    const typeArr: string[] = request.url.searchParams.getAll("type");
    try {
      const info = await postsRepo.getPostsWith(page, typeArr);
      response.body = { result: true, msg: "", data: info };
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};

export const postPosts = async (ctx: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const type = body["type"] as number;
      const title = body["title"] as string;
      const bodyVal = body["body"] as string;
      const token = body["token"] as string | null;

      let nick = emptyNick;
      let level = 0;
      if (token != null) {
        const authInfo = await getAuthInfo(token);
        if (authInfo == null) {
          response.body = { result: false, msg: "auth fail" };
          return;
        } else {
          const userResult = await userRepo.getUser(authInfo.uid);
          nick = userResult.user.nick as string
          level = userResult.user.level as number;
        }
      }

      if (type == 0) { // 공지사항이라면
        if (level < 2) {
          response.body = { result: false, msg: "auth fail" };
          return;
        }
      }

      const result = await postsRepo.createPosts(
        type,
        title,
        bodyVal,
        nick,
      );

      if (result.affectedRows != null) {
        response.body = { result: true, msg: "" };
      } else {
        response.body = { result: false, msg: "not excuted" };
      }
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "no params." };
  }
};

export const postComment = async (ctx: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const postId = body["post_id"] as number;
      const comment = body["comment"] as string;
      const token = body["token"] as string | null;

      let nick = emptyNick;
      if (token != null) {
        const authInfo = await getAuthInfo(token);
        if (authInfo == null) {
          response.body = { result: false, msg: "auth fail" };
          return;
        } else {
          const userResult = await userRepo.getUser(authInfo.uid);
          nick = userResult.user.nick as string;
        }
      }

      const result = await postsRepo.createComment(postId, nick, comment);
      if (result != undefined) {
        response.body = { result: true, msg: "" };
      } else {
        response.body = { result: false, msg: "not excuted" };
      }
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "no params." };
  }
};

export const deletePosts = async (ctx: RouterContext) => {
  if (params && params.token) {
    try {
      const token: string = params.token;
      const id = Number(request.url.searchParams.get("id"));

      const info = await postsRepo.getPosts(id);
      if (info == null) {
        response.body = { result: false, msg: "Posts is not existed." };
        return;
      }

      const authInfo = await getAuthInfo(token);
      if (authInfo == null) {
        response.body = { result: false, msg: "auth fail" };
        return;
      } else {
        const userResult = await userRepo.getUser(authInfo.uid);
        const nick = userResult?.user["nick"];
        if (info.posts["nick"] != nick) {
          response.body = { result: false, msg: "auth fail" };
          return;
        }
      }

      const result = await postsRepo.deletePosts(id);
      if (result != undefined) {
        response.body = { result: true, msg: "" };
      } else {
        response.body = { result: false, msg: "not excuted" };
      }
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};

export const deleteComment = async (ctx: RouterContext) => {
  if (params && params.token) {
    try {
      const token: string = params.token;
      const id = Number(request.url.searchParams.get("id"));
      const postId = Number(request.url.searchParams.get("post_id"));

      const comment = await postsRepo.getComment(id);
      if (comment == null) {
        response.body = { result: false, msg: "Comment is not existed." };
        return;
      }

      const authInfo = await getAuthInfo(token);
      if (authInfo == null) {
        response.body = { result: false, msg: "auth fail" };
        return;
      } else {
        const userResult = await userRepo.getUser(authInfo.uid);
        const nick = userResult?.user["nick"];
        if (comment["nick"] != nick) {
          response.body = { result: false, msg: "auth fail" };
          return;
        }
      }

      const result = await postsRepo.deleteComment(id, postId);
      if (result != undefined) {
        response.body = { result: true, msg: "" };
      } else {
        response.body = { result: false, msg: "not excuted" };
      }
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};
