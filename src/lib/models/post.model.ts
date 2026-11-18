import {Schema, model} from 'mongoose'
import {IPost} from '../interface/PostsInterface'
const postSchema = new Schema<IPost>({
    id: {type: String, required: true},
    userId:{type:Schema.Types.ObjectId, required: true},
    title: {type: String, required: true , minlength: 3, maxlength: 100},
    content: {type: String, required: true , minlength: 3, maxlength: 1000},
    commentsCount:{type: Number, default: 0},
    reactionsCount:{type: Number, default: 0},
    allowComments:{type: Boolean, default: true},
})

export const Post = model('Post', postSchema)