import dotenv from 'dotenv';
import path from 'path';
import randomString from 'random-string';

const { NODE_ENV } = process.env;

dotenv.config({
  path: path.resolve(
    process.cwd(),
    NODE_ENV == 'production' ? '.env' : '.env.dev',
  ),
});

process.env.APP_CACHE = randomString();
