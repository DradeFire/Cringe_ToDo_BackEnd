import {
  ApiMethodTypes,
  IRouteParams,
  SWComponentProp,
  SWMethod,
  SWMethodParam,
  SWMethodResponse,
  SWParamInEnum,
  SWRequiredProps,
} from './swagger-classes';
import SwaggerDoc from './swagger-doc';

//Добавление пути
export function addSWPath(
  controllerPath: string,
  methodPath: string,
  methodType: ApiMethodTypes,
  routeParams?: IRouteParams
) {
  const newPath = getSWPathName(controllerPath + methodPath);
  const tagName = getTagName(controllerPath);

  const method: SWMethod = {
    summary: routeParams?.summary,
    description: routeParams?.description,
    tags: [tagName],
    responses: {} as { [code: string]: SWMethodResponse },
  };

  let parameters: SWMethodParam[] = [];

  //Добавляем path переменные - это всегда будет СТРОКА
  (controllerPath + methodPath).split('/').forEach((el) => {
    if (el.startsWith(':')) {
      parameters.push(parseMethodParam(SWParamInEnum.PATH, el.replace(':', ''), el.replace(':', '')));
    }
  });

  //Добавляем заголовки
  if (routeParams?.headers) {
    Object.entries(routeParams.headers).forEach((entry) => {
      parameters.push(parseMethodParam(SWParamInEnum.HEADER, entry[0], entry[1]));
    });
  }

  //Добавляем query
  if (routeParams?.query) {
    Object.entries(routeParams.query).forEach((entry) => {
      parameters.push(parseMethodParam(SWParamInEnum.QUERY, entry[0], entry[1]));
    });
  }

  method.parameters = parameters;

  //Добавляем BODY запроса / MultipartFrom-data
  if (routeParams?.fileList) {
    method.requestBody = {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: routeParams.fileList,
            properties: parseFileList(routeParams.fileList),
          },
        },
      },
    };
  } else if (routeParams?.body) {
    method.requestBody = {
      content: {
        'application/json': {
          schema: parseKeyToSWProp(routeParams.body),
        },
      },
    };
  }

  //API responses
  if (routeParams?.responses) {
    routeParams.responses.forEach((el) => {
      let methodResponse: SWMethodResponse = {
        description: el.description,
      };

      if (el.body) {
        methodResponse.content = {
          'application/json': {
            schema: parseKeyToSWProp(el.body),
          },
        };
      }

      method.responses[el.code.toString()] = methodResponse;
    });
  }

  SwaggerDoc.addTag(tagName);
  SwaggerDoc.addPath(newPath, methodType, method);
}

function parseMethodParam(swparamIn: SWParamInEnum, key: string, value: string | boolean | number): SWMethodParam {
  let newKey = key.replace('?', '');

  let type = 'string';
  if (typeof value === 'string') {
    type = 'string';
  } else if (typeof value === 'boolean') {
    type = 'boolean';
  } else if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      type = 'integer';
    } else {
      type = 'number';
    }
  }

  return {
    in: swparamIn,
    name: newKey,
    required: !key.endsWith('?'),
    schema: {
      type: type,
      example: value,
    },
  };
}

function parseFileList(fileList: string[]): { [propName: string]: SWComponentProp } {
  let result: { [propName: string]: SWComponentProp } = {};

  fileList.forEach((el) => {
    result[el] = {
      type: 'string',
      format: 'binary',
    };
  });

  return result;
}

function parseKeysToProps(obj: any): SWRequiredProps {
  let properties: { [propName: string]: SWComponentProp } = {};
  let required: string[] = [];
  Object.keys(obj).forEach((key) => {
    let newKey = key.replace('?', '');
    properties[newKey] = parseKeyToSWProp(obj[key]);
    if (!key.endsWith('?')) {
      required.push(newKey);
    }
  });

  return { required, properties };
}

function parseKeyToSWProp(propValue: any): SWComponentProp {
  let example: any | undefined = undefined;
  let type = 'string';
  let properties: { [propName: string]: SWComponentProp } | undefined = undefined;
  let items: SWComponentProp | undefined = undefined;
  let required: string[] | undefined = undefined;

  if (propValue === null) {
    type = 'object';
    example = propValue;
  } else if (typeof propValue === 'string') {
    type = 'string';
    example = propValue;
  } else if (typeof propValue === 'boolean') {
    type = 'boolean';
    example = propValue;
  } else if (typeof propValue === 'number') {
    if (Number.isInteger(propValue)) {
      type = 'integer';
    } else {
      type = 'number';
    }
    example = propValue;
  } else if (typeof propValue === 'object') {
    if (Array.isArray(propValue)) {
      //Это массив значений(100% - должен быть НУЛЕВОЙ элемент)
      type = 'array';
      items = parseKeyToSWProp(propValue[0]);
    } else {
      //Это объект
      type = 'object';
      let tmpObject = parseKeysToProps(propValue);
      properties = tmpObject.properties;
      required = tmpObject.required;
    }
  }

  return {
    type,
    example,
    required,
    properties,
    items,
  };
}

function getTagName(path: string) {
  return path
    .split('/')
    .map((el) => {
      if (el.startsWith(':')) {
        return `${el.replace(':', '')}`;
      }
      return el;
    })
    .map((el) => el.charAt(0).toUpperCase() + el.substring(1))
    .join('');
}

//Преобразование api/v1/users/:id -> api/v1/users/{id}
function getSWPathName(path: string) {
  return path
    .split('/')
    .map((el) => {
      if (el.startsWith(':')) {
        return `${el.replace(':', '{')}}`;
      }
      return el;
    })
    .join('/');
}
