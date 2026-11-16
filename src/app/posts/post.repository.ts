import {ObjectId} from "mongodb";
import {Types} from "mongoose";
import { Post } from "../../lib/models/post.model";
import { IPost } from "../../lib/interface/PostsInterface";
import { AbstractRepository } from "../abstract";
class PostRepository extends AbstractRepository<IPost>{
    constructor() {
        super(Post);
    }
}
export default PostRepository