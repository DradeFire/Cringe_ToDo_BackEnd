import { logError, logInfo } from 'utils/utils-log';
import App from './app';

async function bootstrap() {
  const app = await App.create();

  // do app specific cleaning before exiting
  process.on('exit', async () => {
    logInfo('Exit');
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', () => {
    logInfo('SIGINT - Ctrl-C...');
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', (error) => {
    logError('Uncaught Exception...', error);
    process.exit(99);
  });

  await app.listen();
}

bootstrap();