import Morgan from 'morgan';

import { logger } from '../utils/logger';

const morganMiddleware = Morgan(
  (tokens: any, req: any, res: any) => {
    return ['📘[ END ]', tokens.method(req, res), tokens.url(req, res), tokens.status(req, res)].join(' ');
  },
  {
    stream: {
      write: (message: string) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
      },
    },
  }
);

export default morganMiddleware;
