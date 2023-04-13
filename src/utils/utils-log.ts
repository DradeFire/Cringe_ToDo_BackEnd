import { LEVEL, SPLAT } from 'triple-beam';
import Winston from 'winston';

const loadNs = process.hrtime();
const loadMsBigInt = BigInt(new Date().getTime()) * BigInt(1e6);

const nanoseconds = () => {
  const diffNs = process.hrtime(loadNs);
  const addBigInt = BigInt(diffNs[0]) * BigInt(1e9) + BigInt(diffNs[1]);
  return (loadMsBigInt + addBigInt).toString();
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

type LogFormat = {
  [LEVEL]?: string;
  [SPLAT]?: any;
  timestamp: string;
  level: string;
  message: string;
  errorMessage?: string;
  errorTrace?: string;
  logExtra?: Record<string, any>; //Extra данные для лога
  errorExtra?: Record<string, any>; //Extra данные для ошибки
};

const logsHandler = Winston.format((info) => {
  const nanoString = nanoseconds();
  const msNumber = Number(nanoString.substring(0, nanoString.length - 6));
  const timestamp = `${new Date(msNumber).toISOString().slice(0, -1)}${nanoString.substring(nanoString.length - 6)}Z`;

  let newInfo: LogFormat = {
    timestamp,
    level: info.level,
    [LEVEL]: info[LEVEL],
    message: info.message,
  };

  const splatArr = info[SPLAT] || []; //Опциональные параметры

  //примерный формат лога (msg, [obj1, error])
  splatArr.forEach((el: any) => {
    if (el instanceof Error) {
      //Нашли инстанс ошибки
      if (el.message.length > 0) {
        //Если есть сообщение
        newInfo.message = `${newInfo.message.replace(el.message, '')}`.trim();
        newInfo['errorMessage'] = el.message;
      }

      //Проверка есть ли у ошибки ТРЕЙС
      if (typeof el.stack === 'string' && el.stack.length > 0) {
        const tmp = el.stack.split('\n').map((el1) => el1.trim());
        newInfo['errorTrace'] = tmp.slice(1, tmp.length - 1).join('; ');
      }

      //Если в ошибке есть ExtraData
      el = el as any;
      if (!isEmptyObj(el.extraData)) {
        newInfo['errorExtra'] = el.extraData;
      }
    } else {
      //Все остальное
      if (!isEmptyObj(el)) {
        newInfo['logExtra'] = el;
      }
    }
  });

  return newInfo;
});

const isEmptyObj = (obj: any) => {
  if (typeof obj !== 'object') return true;
  for (let _ in obj) return false;
  return true;
};

const format = Winston.format.combine(
  logsHandler(),
  Winston.format.printf((info) => JSON.stringify(info)),
  Winston.format.colorize({
    all: true,
    colors,
  })
);

const transports = [new Winston.transports.Console()];

const logger = Winston.createLogger({
  format,
  transports,
});

export function logInfo(message: string, meta: Record<string, any> = {}) {
  logger.info(message, meta);
}

export function logWarn(message: string, meta: Record<string, any> = {}) {
  logger.warn(message, meta);
}

//Под вопросом на счет ANY
export function logError(message: string, err: any, meta: Record<string, any> = {}) {
  logger.error(message, err, meta);
}
