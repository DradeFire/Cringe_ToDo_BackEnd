import { NextFunction, Request, Response } from 'express';
import { HttpException } from 'utils/utils-error';
import { logError } from 'utils/utils-log';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logError('API error', err);

  let statusCode = 500;
  if (err instanceof HttpException) {
    if (typeof err.statusCode === 'number' && err.statusCode > 0) {
      statusCode = err.statusCode;
    }
  }

  let message = 'Неизвестная ошибка';
  if (typeof err.message === 'string' && err.message.length > 0) {
    message = err.message;
  }

  res.status(statusCode).json({
    message,
  });
};
