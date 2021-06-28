import { AuthInfo } from "../models/authInfo.ts";

export async function getAuthInfo(token: string) {
  try {
    const res = await fetch("http://192.168.0.2:5000/" + token);
    const json = await res.json();
    if (json["result"]) {
      const authInfo = new AuthInfo(json["data"]);
      return authInfo;
    } else {
      console.error(json["msg"]);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
