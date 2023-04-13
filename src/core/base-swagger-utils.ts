export default class BaseSwaggerUtils {
  static message200(message: string = 'Ok') {
    return {
      code: 200,
      body: {
        message,
      },
    };
  }

  static body200(body: any = undefined) {
    return {
      code: 200,
      body,
    };
  }
}
