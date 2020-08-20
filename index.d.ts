

declare module 'ormv' {

  /**
   * 加载一个或多个应用
   * @param {string} path 要加载的应用路径
   */
  export const Op: {
    /**
     * 原生sql查询
     * @param params 
     */
    $sq(params: type): void,
    /**
     * 字段别名
     * @param params 
     */
    $as(params: type): void,
    /**
     * 统计总量
     * @param params 
     */
    $count(params: type): void
  }

}