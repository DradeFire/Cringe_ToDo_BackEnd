import User from "../../../database/model/final/User.model"
import { ErrorResponse } from "../../../middleware/custom-error";
import { ErrorReasons, StatusCode } from "../../../utils/constants";

export async function getAndCheckAuthCandidate(login: string): Promise<User> {
    const candidate = await User.findOne({
        where: {
            login: login
        }
    });
    if (!candidate) {
        throw new ErrorResponse(ErrorReasons.INCORRECT_LOGIN_400, StatusCode.BAD_REQUEST_400);
    }

    return candidate
}

export async function checkExistCandidate(login: string) {
    const candidate = await User.findOne({
        where: {
            login: login
        }
    });

    if (candidate) {
        throw new ErrorResponse(ErrorReasons.USER_EMAIL_EXIST_400, StatusCode.BAD_REQUEST_400);
    }
}