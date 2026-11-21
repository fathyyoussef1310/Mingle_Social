/**
 * POST MONGOOSE MODEL
 *
 * Responsibility:
 * Defines the MongoDB schema and Mongoose data model for community Posts.
 *
 * Why does this file exist?
 * To persist and validate user-created post documents in the MongoDB `posts` collection.
 * It enforces minimum and maximum string lengths, relational references to users (`userId`),
 * and tracks metadata such as comment counts, reaction counts, and commenting permissions.
 *
 * Architecture:
 * Data Access / Mongoose Model Layer.
 *
 * Dependencies:
 * - `Schema, model` from `mongoose`: Mongoose schema builder and model factory.
 * - `IPost` from `../interface/PostsInterface`: TypeScript domain interface for posts.
 *
 * Used by:
 * - `src/app/posts/post.repository.ts`: Passed to `super(Post)` in PostRepository.
 *
 * Application Flow:
 * PostController -> PostService -> PostRepository -> Post Mongoose Model -> MongoDB.
 */

// Import Mongoose Schema and model creation functions
import { Schema, model } from "mongoose";

// Import the TypeScript interface representing a Post
import { IPost } from "../interface/PostsInterface";

/**
 * Mongoose Schema defining fields, types, and validation rules for the `posts` collection.
 */
const postSchema = new Schema<IPost>({
    // Unique identifier for the post
    id: {
        type: String,
        required: true,
    },

    // Foreign key reference pointing to the user who authored the post
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // Headline or title of the post (between 3 and 100 characters)
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },

    // The primary content body of the post (between 3 and 1000 characters)
    content: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1000,
    },

    // Aggregated counter of comments submitted under this post
    commentsCount: {
        type: Number,
        default: 0,
    },

    // Aggregated counter of user reactions (likes, hearts) on this post
    reactionsCount: {
        type: Number,
        default: 0,
    },

    // Toggle allowing or disabling new comments on this specific post
    allowComments: {
        type: Boolean,
        default: true,
    },
});

/**
 * Compiled Mongoose Post Model for MongoDB operations on the `posts` collection.
 */
export const Post = model<IPost>("Post", postSchema);
export default Post;
