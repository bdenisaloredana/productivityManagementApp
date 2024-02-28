import http from 'http';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from "koa-bodyparser";
import jwt from 'koa-jwt';
import cors from '@koa/cors';
import { jwtConfig, timingLogger, exceptionHandler } from './utils.js';
import { taskRouter } from './task.js';
import { authRouter } from './auth.js';
import { listRouter } from './list.js';

const app = new Koa();
const server = http.createServer(app.callback());

app.use(cors());
app.use(timingLogger);
app.use(exceptionHandler);
app.use(bodyParser());

const prefix = '/api';

const publicApiRouter = new Router({ prefix });
publicApiRouter
  .use('/auth', authRouter.routes());
app
  .use(publicApiRouter.routes())
  .use(publicApiRouter.allowedMethods());

app.use(jwt(jwtConfig));

const protectedApiRouter = new Router({ prefix });
protectedApiRouter
  .use('/task', taskRouter.routes())
  .use('/list', listRouter.routes());
app
  .use(protectedApiRouter.routes())
  .use(protectedApiRouter.allowedMethods());

server.listen(3000);
console.log('started on port 3000');
