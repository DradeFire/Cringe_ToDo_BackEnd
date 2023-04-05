import { NextFunction } from "express";
import  Token  from "../database/model/final/Token.model";
import { RequestWithToken } from "../modules/models/models";
import { ErrorReasonse, StatusCode, UrlConst } from "../utils/constants";
import { ErrorResponse } from "./custom-error";

export const requireToken = async <K, T extends RequestWithToken<K>>(req: T, _res: Response, next: NextFunction) => {
    console.log(req.headers)
    const token = req.header(UrlConst.HEADER_ACCESS_TOKEN);
    if (!token) {
        throw new ErrorResponse(ErrorReasonse.NO_TOKEN_SEND_403, StatusCode.UNAUTHORIZED_403);
    }

    const tokenFromDb = await Token.findOne({
        where:{
            token: token
        }
    });
    
    if (!tokenFromDb) {
        throw new ErrorResponse(ErrorReasonse.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
    }

    req.token = tokenFromDb;
    next();
};