import Token from 'database/models/final/Token.model';
import User from 'database/models/final/User.model';
import { Request } from 'express';

export default interface BaseRequest extends Request {
  token: Token;
  user: User;
}
