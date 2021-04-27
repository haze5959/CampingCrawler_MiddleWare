// import { dbRepo } from "../repository/dbRepository.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { mailerObj } from "../utils/smtpClient.ts";

function authCheck(auth: string) {
  
}

export const getUserInfo = async ({
  request,
  response,
  params
}: RouterContext) => {
  if (params && params.token) {
    const token: string = params.token;
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
export const getFavorite = async ({
  request,
  response,
  params
}: RouterContext) => {
  if (params && params.auth) {
    const auth = params.auth;
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
