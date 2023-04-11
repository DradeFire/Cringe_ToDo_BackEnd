import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Response } from 'express';
import BaseRequest from 'modules/base/base.request';
import { throwErrorSimple } from 'utils/utils-error';

export const dtoValidator =
  (type: any, skipMissingProperties = false) =>
  async (req: BaseRequest, _: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(type, req.body);
    const errors = await validate(dtoObj, { skipMissingProperties });
    if (errors.length > 0) {
      const dtoErrors = validateErrors(errors);
      throwErrorSimple(dtoErrors);
    } else {
      req.body = dtoObj;
      next();
    }
  };

function validateErrors(errors: ValidationError[]): string {
  return errors
    .map((error: ValidationError) => {
      if (error.children && error.children.length > 0) {
        return validateErrors(error.children);
      } else {
        return (Object as any).values(error.constraints);
      }
    })
    .join(', ');
}
