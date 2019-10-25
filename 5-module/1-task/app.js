const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let subscribers = [];

function subscribe(ctx) {
  return new Promise((resolve, reject) => {
    subscribers.push(resolve);

    ctx.res.on('close', ()=> {
      subscribers.splice(subscribers.indexOf(resolve), 1);
    });
  });
}

function publish(message) {
  subscribers.forEach((resolve) => {
    resolve(message);
  });
}

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await subscribe(ctx);
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;
  if (!message) {
    return ctx.body = '';
  }
  publish(message);
  ctx.body = '';
});

app.use(router.routes());

module.exports = app;
