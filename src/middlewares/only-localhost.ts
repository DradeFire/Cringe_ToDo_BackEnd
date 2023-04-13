import { NextFunction, Request, Response } from 'express';
import { Constants } from 'utils/constants';
import { throwErrorNotFound } from 'utils/utils-error';

export const requireLocalhost = async (req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host;
  if (!host || !host.includes(Constants.LOCALHOST_MASK)) {
    throwErrorNotFound('Endpoint no found');
  }

  next();
};
