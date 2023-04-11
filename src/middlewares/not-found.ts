import { NextFunction, Request, Response } from 'express';
import { throwErrorNotFound } from 'utils/utils-error';

export const notFound = (req: Request, _: Response, next: NextFunction) => {
  next(throwErrorNotFound(`Not found - ${req.originalUrl} ${req.method}`));
};
