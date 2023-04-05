import User from "../../database/model/final/User.model";
import Token from "../../database/model/final/Token.model";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { ErrorResponse } from "../../middleware/custom-error";
import { Response } from 'express';
import { UserRequest} from '../models/models';
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";

const login = async (req: UserRequest, res: Response) => {
  if (!req.body.login) {
    throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.pass) {
    throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }

  const candidate = await User.findOne({
    where :{
      login: req.body.login,
    }
  });

  if (!candidate) {
    throw new ErrorResponse(ErrorReasons.INCORRECT_LOGIN_400, StatusCode.BAD_REQUEST_400);
  }

  const passwordResult = bcrypt.compareSync(
    req.body.pass,
    candidate.pass as string
  );

  if (!passwordResult) {
    throw new ErrorResponse(ErrorReasons.INCORRECT_PASSWORD_400, StatusCode.BAD_REQUEST_400);
  }

  const newToken = await Token.create({
    login: candidate.login,
    token: nanoid(128),
  });
  console.log(candidate.login);
  console.log(newToken);

  res.json(newToken);
};

const registration = async (req: UserRequest, res: Response) => {
  if (!req.body.login) {
    throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.pass) {
    throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }

  const candidate = await User.findOne({
    where :{
      login: req.body.login,
    }
  });
  if (candidate) {
    throw new ErrorResponse(ErrorReasons.USER_EMAIL_EXIST_400, StatusCode.BAD_REQUEST_400);
  }

  const salt = bcrypt.genSaltSync(10);
  const password = req.body.pass;
  const hashPassword = bcrypt.hashSync(password, salt);
  const user = await User.create({
    login: req.body.login,
    pass: hashPassword
  });

  res.json(user.toJSON());
};

//Разобраться
const logout = async (req: UserRequest, res: Response) => {
  await req.token.destroy();
  res.json(OkMessage);
};

const me = async (req: UserRequest, res: Response) => {
  const user = await User.findOne({
    where:{
      login: req.token.login
    }
  });
  res.json({ user: user });
};

export {
  login,
  registration,
  logout,
  me,
};
