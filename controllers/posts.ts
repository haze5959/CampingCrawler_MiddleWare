import { postsRepo, userRepo } from "../repository/dbRepository.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { getAuthInfo } from "../utils/auth.ts";

const emptyNick = "익명의 캠퍼";

export const getHomePosts = async ({
  response,
}: RouterContext) => {
  try {
    const data = await postsRepo.getHomePosts();
    response.body = { result: true, msg: "", data: data };
  } catch (error) {
    console.error(error);
    response.body = { result: false, msg: error };
  }
};

export const getPosts = async ({
  response,
  params,
}: RouterContext) => {
  if (params && params.id) {
    const id = Number(params.id);
    try {
      const info = await postsRepo.getPosts(id);
      if (info != null && info.posts["type"] == 3) {
        if (params.token) {
          const token = params.token;
          const authInfo = await getAuthInfo(token);
          if (authInfo == null) {
            response.body = { result: false, msg: "auth fail" };
            return;
          } else {
            const userResult = await userRepo.getUser(authInfo.localId);
            const nick = userResult["nick"];
            if (nick != info.posts["nick"]) {
              response.body = { result: false, msg: "Auth Fail" };
              return;
            }
          }
        } else {
          response.body = { result: false, msg: "Auth Fail" };
          return;
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

export const getPostsPage = async ({
  request,
  response,
  params,
}: RouterContext) => {
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

export const postPosts = async ({
  request,
  response,
}: RouterContext) => {
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
          const userResult = await userRepo.getUser(authInfo.localId);
          nick = userResult["nick"];
          level = userResult["level"];
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

export const postComment = async ({
  request,
  response,
}: RouterContext) => {
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
          const userResult = await userRepo.getUser(authInfo.localId);
          nick = userResult["nick"];
        }
      }

      const result = await postsRepo.createComment(postId, nick, comment);
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

export const deletePosts = async ({
  request,
  response,
}: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const id = body["id"] as number;
      const token = body["token"] as string;

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
        const userResult = await userRepo.getUser(authInfo.localId);
        const nick = userResult["nick"];
        if (info.posts["nick"] != nick) {
          response.body = { result: false, msg: "auth fail" };
          return;
        }
      }

      const result = await postsRepo.deletePosts(id);
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

export const deleteComment = async ({
  request,
  response,
}: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const id = body["id"] as number;
      const token = body["token"] as string;

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
        const userResult = await userRepo.getUser(authInfo.localId);
        const nick = userResult["nick"];
        if (comment["nick"] != nick) {
          response.body = { result: false, msg: "auth fail" };
          return;
        }
      }

      const result = await postsRepo.deleteComment(id);
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
