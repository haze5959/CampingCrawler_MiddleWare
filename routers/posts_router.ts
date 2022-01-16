import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  deleteComment,
  deletePosts,
  getPosts,
  getPostsPage,
  getPostsGoodInfo,
  getCommentGoodInfo,
  postComment,
  postPosts,
  createPostsGood,
  createCommentGood
} from "../controllers/posts_controller.ts";

const postsRouter = new Router();
postsRouter
  // 포스트 관련
  .get("/post/:id", getPosts)
  .get("/post/good:id", getPostsGoodInfo)
  .get("/comment/good:id", getCommentGoodInfo)
  .get("/post/list/:page", getPostsPage)
  .post("/post", postPosts)
  .post("/comment", postComment)
  .post("/post/good", createPostsGood)
  .post("/comment/good", createCommentGood)
  .delete("/post/:token", deletePosts)
  .delete("/comment/:token", deleteComment)

export { postsRouter };