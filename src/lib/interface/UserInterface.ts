import {Gender, Provider} from "../enum/enum";

export interface IUser{
    userName:String,
    email:String,
    password:String,
    provider:Provider,
    gender:Gender;
}
