
import { Model } from "mongoose";

export abstract class AbstractRepository<T> {
    constructor(protected readonly model: Model<T>) {}

    async createUser(user: Partial<T> | T) {
        return this.model.create(user as any);
    }

    async updateUser(filter: any, newData: any, options?: any) {
        return this.model.findOneAndUpdate(filter, newData, options);
    }

    async deleteUser(filter: any) {
        return this.model.deleteOne(filter);
    }

    async readOne(filter: any) {
        return this.model.findOne(filter);
    }
}
