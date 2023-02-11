import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
);

export default mongoose.model("Blog", blogSchema);
