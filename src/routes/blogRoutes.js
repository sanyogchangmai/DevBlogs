import express from "express";
import {
    createBlog,
    getAllBlogs,
    getBlogsById,
    getBlogsByAuthor,
    updateBlog,
    deleteBlog
} from "../controllers/blogController.js";
const blogRouter = express.Router();
import protect from "../middlewares/authMiddleware.js";

blogRouter.post("/create", protect, createBlog);
blogRouter.get("/all", protect, getAllBlogs);
blogRouter.get("/:blogId", protect, getBlogsById);
blogRouter.get("/author/:authorId", protect, getBlogsByAuthor);
blogRouter.put("/update/:blogId", protect, updateBlog);
blogRouter.delete("/delete/:blogId", protect, deleteBlog);

export default blogRouter;
