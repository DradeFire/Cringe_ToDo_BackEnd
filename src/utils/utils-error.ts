type ExceptionOptions = {
  statusCode?: number;
  message?: string;
  extraData?: Record<string, any>;
};

export class HttpException extends Error {
  statusCode: number;
  extraData: Record<string, any>;

  constructor({ statusCode = 400, message = 'Error', extraData = {} }: ExceptionOptions) {
    super(message);
    this.statusCode = statusCode;
    this.extraData = extraData;
  }
}

export function throwError(options: ExceptionOptions): never {
  throw new HttpException(options);
}

export function throwErrorSimple(message: string, extraData: Record<string, any> = {}): never {
  throw new HttpException({
    message,
    extraData,
  });
}

export function throwErrorCode(message: string, statusCode: number, extraData: Record<string, any> = {}): never {
  throw new HttpException({
    message,
    statusCode,
    extraData,
  });
}

export function throwErrorNotFound(message: string = 'Not found', extraData: Record<string, any> = {}): never {
  throw new HttpException({
    statusCode: 404,
    message,
    extraData,
  });
}
