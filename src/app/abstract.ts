import { Model, QueryFilter, Types } from "mongoose";

export abstract class AbstractRepository<T> {
    constructor(private readonly model: Model<T>) {}
        async  createUser(user:T){
          return   this.model.create(user
            )
        }
        async updateUser(filter:QueryFilter<T> ,newData:Partial<T>,options?:QueryFilter<T>){
            return this.model.findOneAndUpdate(
                 filter,newData,options
            )
        }
        async deleteUser(filter:QueryFilter<T>)
        {
            return this.model.deleteOne(filter)
        }
        async readOne(filter:QueryFilter<T>){
            return this.model.findOne(filter)
        }
}