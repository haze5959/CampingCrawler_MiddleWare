import { RouterContext } from "https://deno.land/x/oak@v9.0.1/mod.ts";
// import { mailerObj } from "../utils/smtpClient.ts";
import { getAuthInfo } from "../utils/auth.ts";
import { userRepo } from "../repository/dbRepository.ts";

// 유저 정보 가져오기
export const getUser = async (ctx: RouterContext) => {
  if (params && params.token) {
    const token: string = params.token;
    const authInfo = await getAuthInfo(token);

    if (authInfo != null) {
      const userResult = await userRepo.getUser(authInfo.uid);
      if (userResult == null) {
        // 새 유저 등록하기
        let name = authInfo.name ?? "캠퍼" + "_" + makeid(8);
        const isExist = await userRepo.checkUserNick(name);
        if (isExist) {
          name = name + "_" + makeid(6);
        }

        await userRepo.createUser(authInfo.uid, name);
        const signUpResult = await userRepo.getUser(authInfo.uid);
        if (signUpResult == null) {
          response.body = { result: false, msg: "sign up fail" };
        } else {
          response.body = { result: true, msg: "sign up", data: signUpResult };
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

function makeid(length: number): string {
  var result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(
      Math.random() *
      charactersLength,
    ));
  }
  return result;
}

export const putUserNick = async (ctx: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const token = body["token"] as string;
      const nick = body["nick"] as string;

      const isExist = await userRepo.checkUserNick(nick);
      if (isExist) {
        response.body = { result: false, msg: "이미 존재하는 닉네임입니다." };
        return;
      }

      const authInfo = await getAuthInfo(token);
      if (authInfo != null) {
        const userResult = await userRepo.getUser(authInfo.uid);
        const oldNick = userResult.user.nick as string;
        const result = await userRepo.updateUserNick(authInfo.uid, nick, oldNick);
        if (result != undefined) {
          response.body = { result: true, msg: "" };
        } else {
          response.body = { result: false, msg: "not excuted" };
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

export const putUserArea = async (ctx: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const token = body["token"] as string;
      const areaBit = body["area_bit"] as number;

      const authInfo = await getAuthInfo(token);
      if (authInfo != null) {
        const result = await userRepo.updateUserArea(authInfo.uid, areaBit);
        if (result != undefined) {
          response.body = { result: true, msg: "" };
        } else {
          response.body = { result: false, msg: "not excuted" };
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

// 유저 삭제하기
export const deleteUser = async (ctx: RouterContext) => {
  if (params && params.token) {
    const token: string = params.token;

    try {
      const res = await fetch("http://192.168.0.2:5000/" + token, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json["result"]) {
        const uid: string = json["uid"];
        await userRepo.deleteUser(uid);
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
export const createReport = async (ctx: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const idStr = body["id"] as string;
      const titleStr = body["title"] as string;
      const bodyStr = body["body"] as string;

      await userRepo.createReport(idStr, titleStr, bodyStr);
      // await mailerObj("[명당캠핑] 🤬 신고 - " + id, bodyStr);
      response.body = { result: true, msg: "" };
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "no params." };
  }
};

// 신고 상태 수정
export const changeReportState = async (ctx: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const id = body["id"] as number;
      const state = body["state"] as number;

      await userRepo.updateReport(id, state);
      response.body = { result: true, msg: "" };
    } catch (error) {
      console.error(error);
      response.body = { result: false, msg: error };
    }
  } else {
    response.body = { result: false, msg: "no params." };
  }
};

// 신고 삭제
export const deleteReport = async (ctx: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const id = body["id"] as number;

      await userRepo.deleteReport(id);
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
export const getPushInfo = async (ctx: RouterContext) => {
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
export const getFavorite = async (ctx: RouterContext) => {
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

export const postFavorite = async (ctx: RouterContext) => {
  if (request.hasBody) {
    try {
      const body = await request.body({ type: "json" }).value;
      const token = body["token"] as string;
      const campId = body["camp_id"] as string;

      const authInfo = await getAuthInfo(token);
      if (authInfo != null) {
        const result = await userRepo.createUserFavorite(authInfo.uid, campId);
        if (result.affectedRows != null) {
          response.body = { result: true, msg: "" };
        } else {
          response.body = { result: false, msg: "not excuted" };
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

export const deleteFavorite = async (ctx: RouterContext) => {
  if (params && params.token) {
    try {
      const token: string = params.token;
      const campId = request.url.searchParams.get("camp_id") as string;

      const authInfo = await getAuthInfo(token);
      if (authInfo != null) {
        const result = await userRepo.deleteUserFavorite(authInfo.uid, campId);
        if (result != undefined) {
          response.body = { result: true, msg: "" };
        } else {
          response.body = { result: false, msg: "not excuted" };
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
