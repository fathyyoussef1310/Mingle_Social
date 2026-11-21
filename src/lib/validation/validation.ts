import { ZodType } from "zod";
import { AppError } from "../error/AppError";

export function validateBody<T>(dto: ZodType<T>, body: unknown): T {
    const result = dto.safeParse(body);

    if (!result.success) {
        const errMessage = result.error.issues.map(
            (issue: any) => `${String(issue.path?.[0] ?? "")} : ${issue.message}`
        );
        const error = new AppError(errMessage.join(", "), 400) as AppError & { errMessage?: string[] };

        error.errMessage = errMessage;

        throw error;
    }
     return result.data;
}

export default validateBody;
