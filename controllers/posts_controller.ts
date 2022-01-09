import { postsRepo, userRepo } from "../repository/dbRepository.ts";
import { Context, helpers } from "https://deno.land/x/oak/mod.ts";
import { getAuthInfo } from "../utils/auth.ts";
import { ErrorMessage } from "../utils/error_msg.ts";

const emptyNick = "익명의 캠퍼";

export async function getPosts(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const id = Number(params.id);

  if (id != undefined) {
    try {
      const info = await postsRepo.getPosts(id);
      if (info.posts["type"] == 3) {
        const token = params.token;
        const authInfo = await getAuthInfo(token);
        if (authInfo == null) {
          ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
          return;
        } else {
          const userResult = await userRepo.getUser(authInfo.uid);
          const nick = userResult?.user["nick"];
          if (nick != info.posts["nick"]) {
            ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
            return;
          }
        }
      }
      ctx.response.body = { result: true, msg: "", data: info };
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

export async function getSecretPosts(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const id = Number(params.id);
  const token = params.token;

  if (id != undefined && token != undefined) {
    try {
      const info = await postsRepo.getPosts(id);
      const authInfo = await getAuthInfo(token);
      if (authInfo == null) {
        ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
        return;
      } else {
        const userResult = await userRepo.getUser(authInfo.uid);
        const nick = userResult?.user["nick"];
        if (nick != info.posts["nick"]) {
          ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
          return;
        }
      }

      ctx.response.body = { result: true, msg: "", data: info };
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

export async function getPostsPage(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const page = Number(params.page);

  if (page != undefined) {
    if (params.is_notice != undefined) {
      const isNotice = params.is_notice == "true";
      
      try {
        const info = await postsRepo.getPostsWith(page, isNotice);
        ctx.response.body = { result: true, msg: "", data: info };
      } catch (error) {
        console.error(error);
        ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
      }
    } else {
      try {
        const info = await postsRepo.getAllPostsWith(page);
        ctx.response.body = { result: true, msg: "", data: info };
      } catch (error) {
        console.error(error);
        ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
      }
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

export async function postPosts(ctx: Context) {
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
          ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
          return;
        } else {
          const userResult = await userRepo.getUser(authInfo.uid);
          nick = userResult.user.nick as string;
          level = userResult.user.level as number;
        }
      }

      if (type == 0) { // 공지사항이라면
        if (level < 2) {
          ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
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
        ctx.response.body = { result: false, msg: ErrorMessage.NOT_EXCUTE };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

export async function postComment(ctx: Context) {
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
          ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
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
        ctx.response.body = { result: false, msg: ErrorMessage.NOT_EXCUTE };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

export async function deletePosts(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const token = params.token;
  const id = Number(params.id);
  if (token != undefined && id != undefined) {
    try {
      const info = await postsRepo.getPosts(id);
      if (info == null) {
        ctx.response.body = { result: false, msg: ErrorMessage.NOT_EXIST };
        return;
      }

      const authInfo = await getAuthInfo(token);
      if (authInfo == null) {
        ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
        return;
      } else {
        const userResult = await userRepo.getUser(authInfo.uid);
        const nick = userResult?.user["nick"];
        if (info.posts["nick"] != nick) {
          ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
          return;
        }
      }

      const result = await postsRepo.deletePosts(id);
      if (result != undefined) {
        ctx.response.body = { result: true, msg: "" };
      } else {
        ctx.response.body = { result: false, msg: ErrorMessage.NOT_EXCUTE };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

export async function deleteComment(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const token = params.token;
  const id = Number(params.id);
  const postId = Number(params.post_id);

  if (token != undefined && id != undefined && postId != undefined) {
    try {
      const comment = await postsRepo.getComment(id);
      if (comment == null) {
        ctx.response.body = { result: false, msg: ErrorMessage.NOT_EXIST };
        return;
      }

      const authInfo = await getAuthInfo(token);
      if (authInfo == null) {
        ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
        return;
      } else {
        const userResult = await userRepo.getUser(authInfo.uid);
        const nick = userResult?.user["nick"];
        if (comment["nick"] != nick) {
          ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
          return;
        }
      }

      const result = await postsRepo.deleteComment(id, postId);
      if (result != undefined) {
        ctx.response.body = { result: true, msg: "" };
      } else {
        ctx.response.body = { result: false, msg: ErrorMessage.NOT_EXIST };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}
