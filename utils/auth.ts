import { AuthInfo } from "../models/authInfo.ts";

export async function getAuthInfo(token: string) {
  try {
    const res = await fetch("http://127.0.0.1:5000/" + token);
    const json = await res.json();
    if (json["result"].boolean) {
      return json as AuthInfo;
    } else {
      console.error(json["msg"]);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
