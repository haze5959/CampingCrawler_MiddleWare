import { dbRepo } from "../repository/dbRepository.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";

export const getHomePosts = async ({
  response,
}: RouterContext) => {
  try {
    const data = await dbRepo.getHomePosts();
    response.body = { result: true, msg: "", data: data };
  } catch (error) {
    console.error(error);
    response.body = { result: false, msg: error };
  }
};

export const getPosts = async ({
  request,
  response,
  params,
}: RouterContext) => {
  if (params && params.id) {
    const page = Number(params.id);
    try {
      const info = await dbRepo.getPosts(page);
      if (info != null && info.posts["type"] == 3) {
        const secretKey = request.url.searchParams.get("key");

        if (info.posts["secret_key"] == secretKey) {
          response.body = { result: true, msg: "", data: info };
        } else {
          response.body = { result: false, msg: "잘못된 비밀번호입니다." };
        }
        return;
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
      const info = await dbRepo.getPostsWith(page, typeArr);
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
      let nick = body["nick"] as string;
      const secretKey = body["secret_key"] as string | null;

      if (type == 0) { // 공지사항이라면
        const id = body["id"] as string;
        const pw = body["pw"] as string;
        const userResult = await dbRepo.getUser(id, pw);
        if (userResult == null) {
          response.body = { result: false, msg: "auth fail" };
          return;
        }

        nick = userResult["nick"] as string;
      }

      const result = await dbRepo.createPosts(
        type,
        title,
        bodyVal,
        nick,
        secretKey,
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
      const nick = body["nick"] as string;
      const comment = body["comment"] as string;

      const result = await dbRepo.createComment(postId, nick, comment);
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

      const result = await dbRepo.deletePosts(id);
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

      const result = await dbRepo.deleteComment(id);
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
