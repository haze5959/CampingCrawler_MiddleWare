// import { dbRepo } from "../repository/dbRepository.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { mailerObj } from "../utils/smtpClient.ts";

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
