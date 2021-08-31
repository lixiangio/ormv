import ormv from './ormv.js';
import './tasks.js';
import './user.js';

export default ormv.virtual('tasks innerJoin user', {
   id: "tasks",
   uid: "tasks",
   keywords: "tasks",
   list: "tasks",
   area: "tasks",
   state: "tasks",
   createdAt: "tasks",
   updatedAt: "tasks",
   name: "user",
   image: "user",
   phone: "user",
   email: "user",
   xxx: "user.age",
   ggr: "user.age",
}, { 'tasks.uid': 'user.id' });
