/**
 * # 标准的JSON数据
 * @author Hamm
 */
export interface IJson<V = any> {
  /**
   * JSON的键
   */
  [x: string]: V;
}
