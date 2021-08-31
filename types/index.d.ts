declare module 'pg'

export interface ormv {

}

export interface Op {
  /**
   * 原生sql查询
   * @param sql  
   */
  $sql(sql: string): Function,
  /**
   * 定义别名
   * @param {String} field 原名
   * @param {String} alias 别名
   */
  $as(field: string, alias: string): Function,
  /**
   * 统计总量
   */
  $count(): Function
}

export interface Ormv {
  new(): ormv
  Op: Op
}

declare module 'ormv' {

  export default Ormv;

}