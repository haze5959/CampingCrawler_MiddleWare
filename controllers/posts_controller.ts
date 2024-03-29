import { postsRepo, userRepo } from "../repository/dbRepository.ts";
import { helpers, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { getAuthInfo } from "../utils/auth.ts";

const emptyNick = "익명의 캠퍼";

export const getHomePosts = async (ctx: RouterContext) => {
  try {
    const data = await postsRepo.getHomePosts();
    ctx.response.body = { result: true, msg: "", data: data };
  } catch (error) {
    console.error(error);
    ctx.response.body = { result: false, msg: error };
  }
};

export const getPosts = async (ctx: RouterContext) => {
  const params = helpers.getQuery(ctx);
  const id = Number(params.id);
  const token = params.token;

  if (id != undefined && token != undefined) {
    try {
      const info = await postsRepo.getPosts(id);
      if (info != null && info.posts["type"] == 3) {
        const authInfo = await getAuthInfo(token);
        if (authInfo == null) {
          ctx.response.body = { result: false, msg: "auth fail" };
          return;
        } else {
          const userResult = await userRepo.getUser(authInfo.uid);
          const nick = userResult?.user["nick"];
          if (nick != info.posts["nick"]) {
            ctx.response.body = { result: false, msg: "Auth Fail" };
            return;
          }
        }
      }

      ctx.response.body = { result: true, msg: "", data: info };
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: error };
    }
  } else {
    ctx.response.body = { result: false, msg: "param fail" };
  }
};

export const getPostsPage = async (ctx: RouterContext) => {
  const params = helpers.getQuery(ctx);
  const page = Number(params.page);
  const isNotice = Boolean(params.is_notice);

  if (page != undefined) {
    if (isNotice != undefined) {
      try {
        const info = await postsRepo.getPostsWith(page, isNotice);
        ctx.response.body = { result: true, msg: "", data: info };
      } catch (error) {
        console.error(error);
        ctx.response.body = { result: false, msg: error };
      }
    } else {
      try {
        const info = await postsRepo.getAllPostsWith(page);
        ctx.response.body = { result: true, msg: "", data: info };
      } catch (error) {
        console.error(error);
        ctx.response.body = { result: false, msg: error };
      }
    }
  } else {
    ctx.response.body = { result: false, msg: "param fail" };
  }
};

export const postPosts = async (ctx: RouterContext) => {
  if (ctx.request.hasBody) {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const type = body["type"] as number;
      const title = body["title"] as string;
      const bodyVal = body["body"] as string;
      const token = body["token"] as string | null;

      let nick = emptyNick;
      let level = 0;
      if (token != null) {
        const authInfo = await getAuthInfo(token);
        if (authInfo == null) {
          ctx.response.body = { result: false, msg: "auth fail" };
          return;
        } else {
          const userResult = await userRepo.getUser(authInfo.uid);
          nick = userResult.user.nick as string
          level = userResult.user.level as number;
        }
      }

      if (type == 0) { // 공지사항이라면
        if (level < 2) {
          ctx.response.body = { result: false, msg: "auth fail" };
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
        ctx.response.body = { result: true, msg: "" };
      } else {
        ctx.response.body = { result: false, msg: "not excuted" };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: error };
    }
  } else {
    ctx.response.body = { result: false, msg: "no params." };
  }
};

export const postComment = async (ctx: RouterContext) => {
  if (ctx.request.hasBody) {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const postId = body["post_id"] as number;
      const comment = body["comment"] as string;
      const token = body["token"] as string | null;

      let nick = emptyNick;
      if (token != null) {
        const authInfo = await getAuthInfo(token);
        if (authInfo == null) {
          ctx.response.body = { result: false, msg: "auth fail" };
          return;
        } else {
          const userResult = await userRepo.getUser(authInfo.uid);
          nick = userResult.user.nick as string;
        }
      }

      const result = await postsRepo.createComment(postId, nick, comment);
      if (result != undefined) {
        ctx.response.body = { result: true, msg: "" };
      } else {
        ctx.response.body = { result: false, msg: "not excuted" };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: error };
    }
  } else {
    ctx.response.body = { result: false, msg: "no params." };
  }
};

export const deletePosts = async (ctx: RouterContext) => {
  const params = helpers.getQuery(ctx);
  const token = params.token;
  const id = Number(params.id);
  if (token != undefined && id != undefined) {
    try {
      const info = await postsRepo.getPosts(id);
      if (info == null) {
        ctx.response.body = { result: false, msg: "Posts is not existed." };
        return;
      }

      const authInfo = await getAuthInfo(token);
      if (authInfo == null) {
        ctx.response.body = { result: false, msg: "auth fail" };
        return;
      } else {
        const userResult = await userRepo.getUser(authInfo.uid);
        const nick = userResult?.user["nick"];
        if (info.posts["nick"] != nick) {
          ctx.response.body = { result: false, msg: "auth fail" };
          return;
        }
      }

      const result = await postsRepo.deletePosts(id);
      if (result != undefined) {
        ctx.response.body = { result: true, msg: "" };
      } else {
        ctx.response.body = { result: false, msg: "not excuted" };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: error };
    }
  } else {
    ctx.response.body = { result: false, msg: "param fail" };
  }
};

export const deleteComment = async (ctx: RouterContext) => {
  const params = helpers.getQuery(ctx);
  const token = params.token;
  const id = Number(params.id);
  const postId = Number(params.post_id);

  if (token != undefined && id != undefined && postId != undefined) {
    try {
      const comment = await postsRepo.getComment(id);
      if (comment == null) {
        ctx.response.body = { result: false, msg: "Comment is not existed." };
        return;
      }

      const authInfo = await getAuthInfo(token);
      if (authInfo == null) {
        ctx.response.body = { result: false, msg: "auth fail" };
        return;
      } else {
        const userResult = await userRepo.getUser(authInfo.uid);
        const nick = userResult?.user["nick"];
        if (comment["nick"] != nick) {
          ctx.response.body = { result: false, msg: "auth fail" };
          return;
        }
      }

      const result = await postsRepo.deleteComment(id, postId);
      if (result != undefined) {
        ctx.response.body = { result: true, msg: "" };
      } else {
        ctx.response.body = { result: false, msg: "not excuted" };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: error };
    }
  } else {
    ctx.response.body = { result: false, msg: "param fail" };
  }
};
