class UrlConst {
  static LOCALHOST_MASK: string = `localhost`; //маска localhost
  static LOCAL_URL: string = `http://${UrlConst.LOCALHOST_MASK}`; //Адрес локалХост

  static SWAGGER_UI_DIST_PATH: string = `swagger-ui-dist`; //маска для swagger docs
  static SWAGGER_DOCS: string = `/swagger/docs`; //маска для swagger docs
  static SWAGGER_JSON: string = `/swagger/json`; //маска для swagger SHEMA (get-json)
  static MEDIA_FOLDER: string = `/media`; //Папка, где хранятся все документы
}

export class Constants extends UrlConst {
  static HEADER_ACCESS_TOKEN: string = 'Authorization'; //Название заголовка для - Authorization
}

export enum FileTypes {
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

export class StatusCode {
  static BAD_REQUEST_400 = 400;
  static NOT_FOUND_404 = 404;
  static UNAUTHORIZED_403 = 403;
  static SERVER_ERROR_500 = 500;
}
