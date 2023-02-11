import Blog from "../models/blogModel.js";
import logger from "../logger/logger.js";

// * @desc - CREATE BLOG CONTROLLER
// * @method - POST
// * @route - /blog/create
const createBlog = async(req, res) => {
    const payload = req.body;
    const blog = new Blog({
        title: payload.title,
        description: payload.description,
        tags: payload.tags,
        body: payload.body,
        author: payload.author
    });

    // * save blog
    try {
        const result = await blog.save();
        logger.info("Blog created successfully.");
        res.status(201).json({
            status: "success",
            code: 201,
            message: "Blog created successfully.",
            data: {
                id: result._id
            }
        });
    }
    catch(err) {
        logger.error("Error occured while saving blog.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to save blog. Try again.",
            data: err,
        });
    }
};

// * @desc - GET ALL BLOGS CONTROLLER
// * @method - GET
// * @route - /blog/all
const getAllBlogs = async(req, res) => {
    let searchQuery = req.query.tag;
    let size = req.query.size;
    let page = req.query.page;

    let query = {};
    if(searchQuery) {
        query = {
            tags: searchQuery
        };
    }

    if(!size){
        size=8;
    }
    if(!page){
        page = 1;
    }
    const limit = parseInt(size);
    const skip = (page-1) * size;
    try {
        const result = await Blog.find(query).limit(limit).skip(skip);
        logger.info("Blogs fetched successfully.");
        res.status(200).json({
            status: "success",
            code: 200,
            page: page,
            results: result.length,
            message: "Blog fetched successfully.",
            data: result
        });
    }
    catch(err) {
        logger.error("Error occured while fetching blogs.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to fetch blogs. Try again.",
            data: err,
        });
    }
};

// * @desc - GET BLOGS BY ID CONTROLLER
// * @method - GET
// * @route - /blog/:blogId
const getBlogsById = async(req, res) => {
    const blogId = req.params.blogId;
    try {
        const result = await Blog.find({_id: blogId});
        logger.info("Blogs fetched successfully.");
        res.status(200).json({
            status: "success",
            code: 200,
            message: "Blog fetched successfully.",
            data: result
        });
    }
    catch(err) {
        logger.error("Error occured while fetching blogs.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to fetch blogs. Try again.",
            data: err,
        });
    }
};

// * @desc - GET BLOGS BY AUTHOR CONTROLLER
// * @method - GET
// * @route - /blog/:author
const getBlogsByAuthor = async(req, res) => {
    const authorId = req.params.author;

    // * query for pagination
    let size = req.query.size;
    let page = req.query.page;
    if(!size){
        size=8;
    }
    if(!page){
        page = 1;
    }
    const limit = parseInt(size);
    const skip = (page-1) * size;

    try {
        const result = await Blog.find({author: authorId}).limit(limit).skip(skip);
        logger.info("Blogs fetched successfully.");
        res.status(200).json({
            status: "success",
            code: 200,
            page: page,
            results: result.length,
            message: "Blog fetched successfully.",
            data: result
        });
    }
    catch(err) {
        logger.error("Error occured while fetching blogs.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to fetch blogs. Try again.",
            data: err,
        });
    }
};

// * @desc - UPDATE BLOG CONTROLLER
// * @method - PUT
// * @route - /blog/:blogId
const updateBlog = async(req, res) => {
    const blogId = req.params.blogId;
    try {
        const result = await Blog.findByIdAndUpdate(blogId, req.body, {
            useFindAndModify: false,
        });
        logger.info("Blog updated successfully.");
        res.status(200).json({
            status: "success",
            code: 200,
            message: "Blog updated successfully.",
            data: result,
        });
    } catch (err) {
        logger.error("Error occured while updating event.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to update blog. Try again.",
            data: err,
        });
    }
};

// * @desc - DELETE BLOG CONTROLLER
// * @method - DELETE
// * @route - /delete/:blogId
const deleteBlog = async (req, res) => {
    const blogId = req.params.blogId;
    try {
        const result = await Blog.findByIdAndRemove(blogId);
        logger.info("Blog deleted successfully.");
        res.status(200).json({
            status: "success",
            code: 200,
            message: "Blog deleted successfully.",
            data: result,
        });
    } catch (err) {
        logger.error("Error occured while deleting event.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to delete event. Try again.",
            data: err,
        });
    }
};

export {createBlog, getAllBlogs, getBlogsById, getBlogsByAuthor, updateBlog, deleteBlog};