import safety from '../safety.js';
import compare from './compare.js';
import jsonb from './jsonb.js';
const { safetyKey } = safety;
export default {
    // 原生sql
    $sql(sql) {
        return () => sql;
    },
    /**
     * 定义别名
     * @param {String} field 原名
     * @param {String} alias 别名
     */
    $as(field, alias) {
        return () => `${safetyKey(field)} AS "${alias.replace(/"/g, "")}"`;
    },
    $count() {
        return () => `count(*)::integer`;
    },
    ...compare,
    ...jsonb,
};
