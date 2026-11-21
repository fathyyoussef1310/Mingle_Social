/**
 * POST ENTITY INTERFACE
 *
 * Responsibility:
 * Defines the compile-time TypeScript type contract for the Post domain model.
 *
 * Why does this file exist?
 * To ensure type safety across the application whenever post documents are created, updated,
 * or queried. By typing `Schema<IPost>` in Mongoose and `AbstractRepository<IPost>` in repositories,
 * TypeScript enforces that all post properties match this structure.
 *
 * Architecture:
 * Domain / Shared Interface Layer.
 *
 * Dependencies:
 * - `mongoose.Types`: For the MongoDB `ObjectId` reference to the author user.
 *
 * Used by:
 * - `src/lib/models/post.model.ts`: In the Mongoose Post schema definition.
 * - `src/app/posts/post.repository.ts`: In the PostRepository generic type parameter.
 */

// Import Mongoose Types to reference MongoDB ObjectIds
import { Types } from "mongoose";

/**
 * Interface representing a user-created Post.
 */
export interface IPost {
    /** The main text body of the post */
    content: string | String;

    /** The headline title of the post */
    title: string | String;

    /** Optional custom numeric or string identifier */
    id?: number | Number | string;

    /** Foreign key reference to the User who created this post */
    userId: Types.ObjectId;

    /** Total count of comments posted under this article */
    commentsCount?: number | Number;

    /** Total count of reactions (likes, loves) on this post */
    reactionsCount?: number | Number;

    /** Privacy flag controlling whether other users can post comments */
    allowComments?: boolean | Boolean;
}
