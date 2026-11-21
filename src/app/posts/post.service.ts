
import { PostRepository, postRepository as defaultPostRepo } from "./post.repository";

export class PostService {
    constructor(private readonly postRepo: PostRepository = defaultPostRepo) {}

}

export const postService = new PostService();
export default postService;

