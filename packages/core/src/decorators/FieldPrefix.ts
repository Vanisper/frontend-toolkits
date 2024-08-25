import { AirDecorator } from "../helpers";
import { FIELD_PREFIX_KEY } from "./_const";

/**
 * # 标记属性别名前缀
 * @param prefix 类的属性别名前缀
 */
export function FieldPrefix<T extends string>(prefix: T) {
  return (target: any) =>
    AirDecorator.setClassConfig(target, FIELD_PREFIX_KEY, prefix);
}

/**
 * # 获取属性别名前缀
 * @param target 目标类
 */
export function getFieldPrefix<T extends string>(target: any): T {
  return AirDecorator.getClassConfig(target, FIELD_PREFIX_KEY) || "";
}
