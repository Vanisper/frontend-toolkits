import type { IFieldConfig } from "../interfaces";

/**
 * # 字段配置基类
 * @author Hamm
 */
export class AirFieldConfig implements IFieldConfig {
  key!: string;

  label!: string;

  constructor(key?: string) {
    if (key) {
      this.key = key;
    }
  }
}
