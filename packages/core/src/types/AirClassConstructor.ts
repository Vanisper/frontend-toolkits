/**
 * # 类包装
 * @author Hamm
 */
export type AirClassConstructor<T> = {
  new (...args: any[]): T;
};
