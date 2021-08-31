import ormv from './ormv.js';

import './tasks.js';
import './user.js';

const vTasks = ormv.virtual('tasks', {
   id: "tasks",
   uid: "tasks",
   keywords: "tasks",
   list: "tasks",
   area: "tasks",
   state: "tasks",
   createdAt: "tasks",
   updatedAt: "tasks",
});

// const vTasks = ormv.virtual('tasks', [
//    'id',
//    'uid',
//    'keywords',
//    'list as xx',
//    'area',
//    'state',
//    'createdAt',
//    'updatedAt'
// ]);

export default vTasks;
