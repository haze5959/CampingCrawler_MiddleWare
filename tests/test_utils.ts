import { IResponse } from "https://deno.land/x/superoak/mod.ts";

export function testLogger(err: any, res: IResponse) {
    if (err) throw err;
    console.log(res.text);
}