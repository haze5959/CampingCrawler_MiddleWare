import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  deleteComment,
  deletePosts,
  getPosts,
  getPostsPage,
  getPostGood,
  getCommentGood,
  postComment,
  postPosts,
  postGood,
  deleteGood
} from "../controllers/posts_controller.ts";

const postsRouter = new Router();
postsRouter
  // 포스트 관련
  .get("/post/:id", getPosts)
  .get("/good/post/:id", getPostGood)
  .get("/good/comment/:id", getCommentGood)
  .get("/post/list/:page", getPostsPage)
  .post("/post", postPosts)
  .post("/comment", postComment)
  .post("/good", postGood)
  .delete("/post/:token", deletePosts)
  .delete("/comment/:token", deleteComment)
  .delete("/good/:token", deleteGood)

export { postsRouter };