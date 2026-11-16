import {model , Schema} from "mongoose";
import {Gender , Provider} from "../enum/enum"
import {IUser} from "../interface/UserInterface";

const schema  = new Schema<IUser>({
    userName:{type:String  , required:true , trim:true},
    email:{type:String , required:true , maxLength:30 , minLength:10, trim:true , toLowerCase:true},
    password:{type:String ,
        required:function(this):boolean{
        return this.provider === Provider.LOCAL;
        },
        maxLength:30 ,
        minLength:10 ,
        trim:true ,
        toLowerCase:true,
    },
    provider:{type:Number , default:Provider.LOCAL,enum:Provider,
}})
export const User = model("User",schema);