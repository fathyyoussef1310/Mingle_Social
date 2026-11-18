import {Types} from "mongoose";
export interface IPost{
    content: String;
    title: String;
    id:Number;
    userId:Types.ObjectId;
    commentsCount: Number;
    reactionsCount: Number;
    allowComments: Boolean;
}