import Router from 'koa-router';
import dataStore from 'nedb-promise';
import { taskStore } from './task.js';

export class ListStore {
  constructor({ filename, autoload }) {
    this.store = dataStore({ filename, autoload });
  }

  async find(props) {
    return this.store.find(props);
  }

  async findOne(props) {
    return this.store.findOne(props);
  }

  async insert(list) {
    if (!list.userId) { // validation
      throw new Error('Missing userId property')
    }
    return this.store.insert(list);
  };

  async update(props, list) {
    return this.store.update(props, list);
  }

  async remove(props) {
    return this.store.remove(props);
  }
}

export const listStore = new ListStore({ filename: './db/lists.json', autoload: true });

export const listRouter = new Router();

listRouter.get('/', async (ctx) => {
  const userId = ctx.state.user._id;
  ctx.response.body = await listStore.find({ userId: userId });
  ctx.response.status = 200; // ok
});

listRouter.get('/tasks/:id', async (ctx) => {
  const userId = ctx.state.user._id;
  const list = await listStore.findOne({_id: ctx.params.id});

  if(!list){
    ctx.response.status = 404;
  }
  if(list.userId != userId){
    ctx.response.status = 403; // forbidden
    return;
  }

  const tasks = await taskStore.find({listId: list._id});
  ctx.response.body = {list: list, tasks: tasks};
  ctx.response.status = 200; // ok
});

const createList = async (ctx, list, response) => {
  try {
    const userId = ctx.state.user._id;
    list.userId = userId;
    response.body = await listStore.insert(list);
    response.status = 201; // created
  } catch (err) {
    response.body = { message: err.message };
    response.status = 400; // bad request
  }
};

listRouter.post('/', async ctx => await createList(ctx, ctx.request.body, ctx.response));

listRouter.put('/:id', async ctx => {
  const list = ctx.request.body;
  const id = ctx.params.id;
  const listId = list._id;
  const response = ctx.response;
  if (listId && listId !== id) {
    response.body = { message: 'Param id and body _id should be the same' };
    response.status = 400; // bad request
    return;
  }
  if (!listId) {
    await createList(ctx, list, response);
  } else {
    const userId = ctx.state.user._id;
    list.userId = userId;
    const updatedCount = await listStore.update({ _id: id }, list);
    if (updatedCount === 1) {
      response.body = list;
      response.status = 200; // ok
    } else {
      response.body = { message: 'Resource no longer exists' };
      response.status = 405; // method not allowed
    }
  }
});

listRouter.del('/:id', async (ctx) => {
  const userId = ctx.state.user._id;
  const list = await listStore.findOne({ _id: ctx.params.id });
  if (list && userId !== list.userId) {
    ctx.response.status = 403; // forbidden
  } else {
    const associatedTasks = await taskStore.find({ listId: list._id });
    for(const task of associatedTasks){
        const updatedTask = {...task, listId: ""};
        await taskStore.update(updatedTask);
    }

    await listStore.remove({ _id: ctx.params.id });
    ctx.response.status = 204; // no content
  }
});