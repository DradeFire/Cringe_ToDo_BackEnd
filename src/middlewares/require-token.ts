import Token from "database/models/final/Token.model";
import User from "database/models/final/User.model";
import { NextFunction } from "express";
import BaseRequest from "modules/base/base.request";
import { Constants, StatusCode } from "utils/constants";

export const requireToken = async (req: BaseRequest, _res: Response, next: NextFunction) => {
    console.log(req.headers)
    const token = req.header(Constants.HEADER_ACCESS_TOKEN);
    if (!token) {
        throw new Error(StatusCode.UNAUTHORIZED_403.toString());
    }

    const tokenFromDb = await Token.findOne({
        where: {
            token: token
        }
    });

    if (!tokenFromDb) {
        throw new Error(StatusCode.UNAUTHORIZED_403.toString());
    }

    const userFromDb = await User.findOne({
        where: {
            login: tokenFromDb.login
        }
    });

    if (!userFromDb) {
        throw new Error(StatusCode.UNAUTHORIZED_403.toString());
    }

    req.token = tokenFromDb;
    req.user = userFromDb;
    next();
};