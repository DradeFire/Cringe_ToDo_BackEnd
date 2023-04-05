import bcrypt from "bcryptjs";
import { Response } from 'express';
import { ChangePassRequest} from '../models/models';
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { ErrorResponse } from "../../middleware/custom-error";
import User from "../../database/model/final/User.model";
import Token from "../../database/model/final/Token.model";




export const changePassword = async (req: ChangePassRequest, res: Response) => {
    console.log(req.body.lastPassword, "last")
    if (!req.body.lastPassword) {
        throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.newPassword) {
        throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const lastPassword = req.body.lastPassword;
    const newPassword = req.body.newPassword;

    const token = await Token.findOne({
        where :{
          login: req.token.login,
        }
      });
      if (!token) {
        throw new ErrorResponse(ErrorReasons.USER_EMAIL_EXIST_400, StatusCode.BAD_REQUEST_400);
      }

      const candidate = await User.findOne({
        where:{
            login: token.login
        }
      });
      if (!candidate) {
        throw new ErrorResponse(ErrorReasons.USER_EMAIL_EXIST_400, StatusCode.BAD_REQUEST_400);
      }


    const passwordResult = bcrypt.compareSync(lastPassword, candidate.pass);
    if (!passwordResult) {
        throw new ErrorResponse(ErrorReasons.INCORRECT_LAST_PASSWORD_400, StatusCode.BAD_REQUEST_400);
    }

    const salt = bcrypt.genSaltSync(10);
    await candidate.update(
        {
            pass: bcrypt.hashSync(newPassword, salt),
        },
        {
            where: {
                login: req.token.login,
            },
        }
    );

    res.json(OkMessage);
};
