import logger from '../lib/logger';

export default function(req, res, next) {
  const date = new Date();
  const reqTime = date.getTime();
  const origianlEnd = res.end;

  res.end = function() {
    origianlEnd.apply(res, arguments);
    const { method, url } = req;

    const now = Date.now();
    const duration = now - reqTime;

    const { statusCode, _contentLength } = res;

    logger.debug(
      `${method} ${url} ${statusCode} ${duration} ms - ${_contentLength}`,
    );
  };

  next();
}
