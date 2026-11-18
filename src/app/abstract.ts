/**
 * GENERIC ABSTRACT REPOSITORY
 *
 * Responsibility:
 * Defines a reusable, generic base repository class containing standard CRUD operations
 * for Mongoose database models.
 *
 * Why does this file exist?
 * To avoid repeating basic database access logic (create, findOne, findOneAndUpdate, deleteOne)
 * across multiple domain repositories (e.g. UserRepository, AuthRepository). By inheriting from
 * this class, domain repositories can immediately perform common database actions and focus
 * strictly on domain-specific queries.
 *
 * Architecture:
 * Data Access Layer / Base Repository Pattern.
 *
 * Dependencies:
 * - `mongoose.Model`: Type representing a Mongoose compiled document model.
 *
 * Used by:
 * - `src/app/auth/repository/auth.repository.ts`
 * - `src/app/user/repository/user.repository.ts`
 * - (and other repositories extending standard MongoDB CRUD operations)
 *
 * Application Flow:
 * Service Layer -> Specific Repository (extends AbstractRepository) -> Mongoose Model -> MongoDB Database
 */

// Import the Mongoose Model type for type-safe interaction with MongoDB collections
import { Model } from "mongoose";

/**
 * AbstractRepository<T>
 *
 * An abstract generic class that encapsulates common MongoDB interactions using Mongoose.
 * The generic parameter `T` represents the TypeScript interface of the document stored in MongoDB.
 *
 * Being `abstract`, this class cannot be instantiated directly with `new AbstractRepository()`;
 * it is designed specifically to be inherited and extended by concrete repository classes.
 */
export abstract class AbstractRepository<T> {
    /**
     * Protected Constructor
     *
     * @param model - The Mongoose model associated with the specific entity.
     * Declared as `protected readonly` so that subclasses can access the underlying Mongoose model
     * if they need to write specialized aggregations or queries, while preventing external modification.
     */
    constructor(protected readonly model: Model<T>) {}

    /**
     * Create and insert a new document into the database collection.
     *
     * @param user - The entity payload containing either full or partial document fields.
     * @returns A promise resolving to the created Mongoose document.
     */
    async createUser(user: Partial<T> | T) {
        // Delegate document creation to Mongoose model.create()
        return this.model.create(user as any);
    }

    /**
     * Find a document matching the filter criteria and update it with new data.
     *
     * @param filter - MongoDB query filter to locate the document (e.g., { email: "user@example.com" }).
     * @param newData - Object containing fields to update or MongoDB update operators (e.g., { $set: { ... } }).
     * @param options - Optional Mongoose query options (e.g., { new: true } to return the modified document).
     * @returns A promise resolving to the updated document (or null if not found).
     */
    async updateUser(filter: any, newData: any, options?: any) {
        return this.model.findOneAndUpdate(filter, newData, options);
    }

    /**
     * Delete a single document matching the filter criteria.
     *
     * @param filter - MongoDB query filter identifying which document to remove.
     * @returns A promise resolving to the Mongoose delete result metadata (e.g., { acknowledged: true, deletedCount: 1 }).
     */
    async deleteUser(filter: any) {
        return this.model.deleteOne(filter);
    }

    /**
     * Retrieve a single document matching the filter criteria.
     *
     * @param filter - MongoDB query filter to match a document.
     * @returns A promise resolving to the found document or null if no document matched.
     */
    async readOne(filter: any) {
        return this.model.findOne(filter);
    }
}
