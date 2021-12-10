import { Context, helpers } from "https://deno.land/x/oak/mod.ts";
import { getAuthInfo } from "../utils/auth.ts";
import { userRepo } from "../repository/dbRepository.ts";
import { ErrorMessage } from "../utils/error_msg.ts";

// 유저 정보 가져오기
export async function getUser(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const token = params.token;

  if (token != undefined) {
    try {
      const authInfo = await getAuthInfo(token);

      if (authInfo != null) {
        const userResult = await userRepo.getUser(authInfo.uid);
        if (userResult == null) {
          // 새 유저 등록하기
          let name = authInfo.name ?? "캠퍼" + "_" + makeid(8);
          let isExist = await userRepo.checkUserNick(name);
          while (isExist) {
            name = name + "_" + makeid(4);
            isExist = await userRepo.checkUserNick(name);
          }

          await userRepo.createUser(authInfo.uid, name);
          const signUpResult = await userRepo.getUser(authInfo.uid);
          if (signUpResult == null) {
            ctx.response.body = { result: false, msg: ErrorMessage.SIGN_UP_FAIL};
          } else {
            ctx.response.body = {
              result: true,
              msg: "sign up",
              data: signUpResult,
            };
          }
        } else {
          ctx.response.body = { result: true, msg: "", data: userResult };
        }
      } else {
        ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: error };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

function makeid(length: number): string {
  let result = "";
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

export async function putUserNick(ctx: Context) {
  if (ctx.request.hasBody) {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const token = body["token"] as string;
      const nick = body["nick"] as string;

      const isExist = await userRepo.checkUserNick(nick);
      if (isExist) {
        ctx.response.body = { result: false, msg: ErrorMessage.ALREADY_EXIST };
        return;
      }

      const authInfo = await getAuthInfo(token);
      if (authInfo != null) {
        const userResult = await userRepo.getUser(authInfo.uid);
        const oldNick = userResult.user.nick as string;
        const result = await userRepo.updateUserNick(
          authInfo.uid,
          nick,
          oldNick,
        );
        if (result != undefined) {
          ctx.response.body = { result: true, msg: "" };
        } else {
          ctx.response.body = { result: false, msg: ErrorMessage.NOT_EXCUTE };
        }
      } else {
        ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

export async function putUserArea(ctx: Context) {
  if (ctx.request.hasBody) {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const token = body["token"] as string;
      const areaBit = body["area_bit"] as number;

      const authInfo = await getAuthInfo(token);
      if (authInfo != null) {
        const result = await userRepo.updateUserArea(authInfo.uid, areaBit);
        if (result != undefined) {
          ctx.response.body = { result: true, msg: "" };
        } else {
          ctx.response.body = { result: false, msg: ErrorMessage.NOT_EXCUTE };
        }
      } else {
        ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

// 유저 삭제하기
export async function deleteUser(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const token = params.token;

  if (token != undefined) {
    try {
      const res = await fetch("http://192.168.0.2:5000/" + token, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json["result"]) {
        const uid: string = json["uid"];
        await userRepo.deleteUser(uid);
        ctx.response.body = { result: true, msg: "" };
      } else {
        console.error(json["msg"]);
        ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

// 신고하기
export async function createReport(ctx: Context) {
  if (ctx.request.hasBody) {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const idStr = body["id"] as string;
      const titleStr = body["title"] as string;
      const bodyStr = body["body"] as string;

      await userRepo.createReport(idStr, titleStr, bodyStr);
      // await mailerObj("[명당캠핑] 🤬 신고 - " + id, bodyStr);
      ctx.response.body = { result: true, msg: "" };
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

// 신고 상태 수정
export async function changeReportState(ctx: Context) {
  if (ctx.request.hasBody) {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const id = body["id"] as number;
      const state = body["state"] as number;

      await userRepo.updateReport(id, state);
      ctx.response.body = { result: true, msg: "" };
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

// 신고 삭제
export async function deleteReport(ctx: Context) {
  const params = helpers.getQuery(ctx);
  const id = Number(params.id);

  if (id != undefined) {
    try {
      await userRepo.deleteReport(id);
      ctx.response.body = { result: true, msg: "" };
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

// 푸시 정보 가져오기
export async function getPushInfo(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const token = params.token;

  if (token != undefined) {
    const authInfo = await getAuthInfo(token);
    if (authInfo != null) {
      const pushInfo = await userRepo.getUserPushInfo(authInfo.uid);
      ctx.response.body = { result: true, msg: "", data: pushInfo };
    } else {
      ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

// 즐겨찾는 캠핑목록 가져오기
export async function getFavorite(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const token = params.token;

  if (token != undefined) {
    const authInfo = await getAuthInfo(token);
    if (authInfo != null) {
      const favorites = await userRepo.getFavorite(authInfo.uid);
      ctx.response.body = { result: true, msg: "", data: favorites };
    } else {
      ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

export async function postFavorite(ctx: Context) {
  if (ctx.request.hasBody) {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const token = body["token"] as string;
      const campId = body["camp_id"] as string;

      const authInfo = await getAuthInfo(token);
      if (authInfo != null) {
        const result = await userRepo.createUserFavorite(authInfo.uid, campId);
        if (result.affectedRows != null) {
          ctx.response.body = { result: true, msg: "" };
        } else {
          ctx.response.body = { result: false, msg: ErrorMessage.NOT_EXCUTE };
        }
      } else {
        ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}

export async function deleteFavorite(ctx: Context) {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const token = params.token;
  const campId = params.camp_id;

  if (token != undefined && campId != undefined) {
    try {
      const authInfo = await getAuthInfo(token);
      if (authInfo != null) {
        const result = await userRepo.deleteUserFavorite(authInfo.uid, campId);
        if (result != undefined) {
          ctx.response.body = { result: true, msg: "" };
        } else {
          ctx.response.body = { result: false, msg: ErrorMessage.NOT_EXCUTE };
        }
      } else {
        ctx.response.body = { result: false, msg: ErrorMessage.AUTH_FAIL };
      }
    } catch (error) {
      console.error(error);
      ctx.response.body = { result: false, msg: ErrorMessage.SERVER_ERROR };
    }
  } else {
    ctx.response.body = { result: false, msg: ErrorMessage.PARAM_FAIL };
  }
}
