import { Router } from 'express';
import { asyncHandler } from 'middlewares/async-handler';
import { ApiMethodTypes, IRouteMethod, IRouteParams } from './swagger-classes';
import { addSWPath } from './swagger-generator';

export function ApiController(path: string) {
  return function (constructor: Function) {
    constructor.prototype.path = path;

    let router = Router();

    if (constructor.prototype.methodList !== undefined) {
      constructor.prototype.methodList.forEach((el: IRouteMethod) => {
        //BINDING
        switch (el.type) {
          case ApiMethodTypes.GET:
            router.get(el.path, ...el.handlers.map(asyncHandler));
            break;

          case ApiMethodTypes.POST:
            router.post(el.path, ...el.handlers.map(asyncHandler));
            break;

          case ApiMethodTypes.PUT:
            router.put(el.path, ...el.handlers.map(asyncHandler));
            break;

          case ApiMethodTypes.PATCH:
            router.patch(el.path, ...el.handlers.map(asyncHandler));
            break;

          case ApiMethodTypes.DELETE:
            router.delete(el.path, ...el.handlers.map(asyncHandler));
            break;
        }

        //SWAGGER GENERTOR
        addSWPath(path, el.path, el.type, el.routeParams);
      });
    }

    constructor.prototype.router = router;
  };
}

export const GET = addMethod(ApiMethodTypes.GET);

export const POST = addMethod(ApiMethodTypes.POST);

export const PUT = addMethod(ApiMethodTypes.PUT);

export const PATCH = addMethod(ApiMethodTypes.PATCH);

export const DELETE = addMethod(ApiMethodTypes.DELETE);

function addMethod(apiType: ApiMethodTypes) {
  return function (path: string, routeParams?: IRouteParams) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      if (!target.methodList) {
        target.methodList = [];
      }

      target.methodList.push({
        propertyKey,
        type: apiType,
        path,
        handlers:
          routeParams !== undefined && routeParams.handlers !== undefined
            ? [...routeParams.handlers, descriptor.value]
            : [descriptor.value],
        routeParams,
      });
    };
  };
}
