// import { dbRepo } from "../repository/dbRepository.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { mailerObj } from "../utils/smtpClient.ts";

async function getUID(token: string) {
  try {
    const res = await fetch("http://127.0.0.1:5000?token=" + token);
    const json = await res.json();
    if (json["result"].boolean) {
      return json["data"];
    } else {
      console.error(json["msg"]);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 유저 정보 가져오기
export const getUser = async ({
  response,
  params,
}: RouterContext) => {
  if (params && params.token) {
    const token: string = params.token;

    const uid = await getUID(token);
    console.log("uid - " + uid);
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
      const res = await fetch("http://127.0.0.1:5000?token=" + token, {
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

// 즐겨찾는 캠핑목록 가져오기
// export const getFavorite = async ({
//   request,
//   response,
//   params
// }: RouterContext) => {
//   if (params && params.auth) {
//     const auth = params.auth;
//     const typeArr: string[] = request.url.searchParams.getAll("type");

//     try {
//       const info = await dbRepo.getPostsWith(page, typeArr);
//       response.body = { result: true, msg: "", data: info };
//     } catch (error) {
//       console.error(error);
//       response.body = { result: false, msg: error };
//     }
//   } else {
//     response.body = { result: false, msg: "param fail" };
//   }
// };
