import { Post } from "../../lib/models/post.model";
import { IPost } from "../../lib/interface/PostsInterface";
import { AbstractRepository } from "../abstract";
export class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post);
    }
}
export const postRepository = new PostRepository();
export default PostRepository;
