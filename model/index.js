import Ormv from '../build/index.js';
import ormv from './ormv.js';
import user from './user.js';
import tasks from './tasks.js';
import admin from './admin.js';
import tasksUser from './tasksUser.js';
import vTasks from './vTasks.js';

const model = {
   tasks,
   user,
   admin,
   tasksUser,
   vTasks,
};

export {
   Ormv,
   ormv,
   model
};

export default model;
