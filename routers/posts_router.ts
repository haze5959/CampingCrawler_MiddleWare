import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  deleteComment,
  deletePosts,
  getPosts,
  getPostsPage,
  postComment,
  postPosts,
} from "../controllers/posts_controller.ts";

const postsRouter = new Router();
postsRouter
  // 포스트 관련
  .get("/post/:id", getPosts)
  .get("/post/list/:page", getPostsPage)
  .post("/post", postPosts)
  .post("/comment", postComment)
  .delete("/post/:token", deletePosts)
  .delete("/comment/:token", deleteComment)

export { postsRouter };