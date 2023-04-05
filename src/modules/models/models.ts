import Token from "../../database/model/final/Token.model"
import { Request } from "express"
import { UserModel, IdParamModel, ChangePassModel } from "../dto/models"


export interface RequestWithToken<ReqBody> extends Request<IdParamModel, {}, ReqBody, {}> {
    token: Token
}



export interface UserRequest extends RequestWithToken<UserModel> { }
export interface ChangePassRequest extends RequestWithToken<ChangePassModel> { }