import { Application } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { monthly, weekly } from "https://deno.land/x/deno_cron/cron.ts";
import { singleton } from "./utils/singleton.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import { campRouter } from "./routers/camp_router.ts";
import { postsRouter } from "./routers/posts_router.ts";
import { userRouter } from "./routers/user_router.ts";

const app = new Application();
app.use(oakCors({ origin: "*" }));
app.use(campRouter.routes(), campRouter.allowedMethods());
app.use(postsRouter.routes(), postsRouter.allowedMethods());
app.use(userRouter.routes(), userRouter.allowedMethods());

app.addEventListener("error", (evt) => {
  console.error(evt.error);
});

// 서버 시작할때랑 월마다 공휴일 업데이트
singleton.updateHolidayInFourMonth();
monthly(() => {
  singleton.updateHolidayInFourMonth();
}, 1);

// // 서버 시작할때랑 주마다 캠핑장 정보 업데이트
singleton.updatesiteSimpleInfo();
weekly(() => {
  singleton.updatesiteSimpleInfo();
}, 1);

console.info("CAMP_MIDDLEWARE Start!!");

await app.listen({ port: 8000 });
