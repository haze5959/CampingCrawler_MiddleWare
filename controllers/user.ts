import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { mailerObj } from "../utils/smtpClient.ts";
import { getAuthInfo } from "../utils/auth.ts";
import { userRepo } from "../repository/dbRepository.ts";

// 유저 정보 가져오기
export const getUser = async ({
  response,
  params,
}: RouterContext) => {
  if (params && params.token) {
    const token: string = params.token;
    const authInfo = await getAuthInfo(token);
    if (authInfo != null) {
      const userResult = await userRepo.getUser(authInfo.uid);
      if (userResult == null) {
        // 새 유저 등록하기
        const name = authInfo.name ?? "캠퍼" + Date();
        await userRepo.createUser(authInfo.uid, name);
        const signUpResult = await userRepo.getUser(authInfo.uid);
        if (signUpResult == null) {
          response.body = { result: false, msg: "sign up fail" };
        } else {
          response.body = { result: true, msg: "sign up", data: userResult };
        }
      } else {
        response.body = { result: true, msg: "", data: userResult };
      }
    } else {
      response.body = { result: false, msg: "auth fail" };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};

// 유저 삭제하기
export const deleteUser = async ({
  response,
  params,
}: RouterContext) => {
  if (params && params.token) {
    const token: string = params.token;

    try {
      const res = await fetch("http://127.0.0.1:5000/" + token, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json["result"].boolean) {
        response.body = { result: true, msg: "" };
      } else {
        response.body = { result: false, msg: json["msg"] };
      }
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};

// 신고하기
export const reportMail = async ({
  request,
  response,
}: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const id = body["id"] as string;
      const bodyStr = body["body"] as string;

      await mailerObj("[명당캠핑] 🤬 신고 - " + id, bodyStr);
      response.body = { result: true, msg: "" };
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "no params." };
  }
};

// 푸시 정보 가져오기
export const getPushInfo = async ({
  response,
  params,
}: RouterContext) => {
  if (params && params.token) {
    const token: string = params.token;
    const authInfo = await getAuthInfo(token);
    if (authInfo != null) {
      const pushInfo = await userRepo.getUserPushInfo(authInfo.uid);
      response.body = { result: true, msg: "", data: pushInfo };
    } else {
      response.body = { result: false, msg: "Auth Fail" };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};

// 즐겨찾는 캠핑목록 가져오기
export const getFavorite = async ({
  response,
  params,
}: RouterContext) => {
  if (params && params.token) {
    const token: string = params.token;
    const authInfo = await getAuthInfo(token);
    if (authInfo != null) {
      const favorites = await userRepo.getFavorite(authInfo.uid);
      response.body = { result: true, msg: "", data: favorites };
    } else {
      response.body = { result: false, msg: "Auth Fail" };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};

export const putUserNick = async ({
  request,
  response,
}: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const token = body["token"] as string;
      const nick = body["nick"] as string;

      const authInfo = await getAuthInfo(token);
      if (authInfo != null) {
        const isExist = await userRepo.checkUserNick(nick);
        if (isExist) {
          response.body = { result: false, msg: "이미 존재하는 닉네임입니다." };
        } else {
          const result = await userRepo.updateUserNick(token, nick);
          if (result.affectedRows != null) {
            response.body = { result: true, msg: "" };
          } else {
            response.body = { result: false, msg: "not excuted" };
          }
        }
      } else {
        response.body = { result: false, msg: "Auth Fail" };
      }
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "param fail" };
  }
};
