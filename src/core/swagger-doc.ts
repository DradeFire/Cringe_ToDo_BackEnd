import { ApiMethodTypes, SWMethod, SWTag } from './swagger-classes';

export default class SwaggerDoc {
  openapi: string = '3.0.0';
  info: any = {
    title: 'Preview Api',
    description: 'This is a simple API',
    contact: {
      email: 'you@your-company.com',
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
    version: '1.0.0',
  };
  servers: Array<any> = [
    {
      url: '/',
    },
  ];
  tags: SWTag[] = [];
  schemes: string[] = ['https', 'http'];
  paths: { [pathName: string]: { [methodType: string]: SWMethod } } = {};

  //Singleton поле
  private static doc: SwaggerDoc = new SwaggerDoc();

  //Добавление тага
  static addTag(tagName: string) {
    const tagIndex = this.doc!.tags.findIndex((el) => el.name === tagName);
    if (tagIndex === -1) {
      this.doc.tags.push({ name: tagName });
    }
  }

  //Добавление пути
  static addPath(methodPath: string, methodType: ApiMethodTypes, method: SWMethod) {
    //Если такого пути еще нема - то добавляем новый
    if (this.doc.paths[methodPath] === undefined) {
      this.doc.paths[methodPath] = {};
    }
    this.doc.paths[methodPath][methodType] = method;
  }

  static get() {
    return this.doc;
  }
}
