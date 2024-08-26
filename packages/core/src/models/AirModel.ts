import {
  getAlias,
  getDefault,
  getDictionary,
  getFieldName,
  getFieldPrefix,
  getIsList,
  getModelName,
  getNoPrefix,
  getToJson,
  getToModel,
  getType,
} from "../decorators";
import type { IDictionary, IJson } from "../interfaces";
import type { AirDictionaryArray } from "./AirDictionaryArray";

/**
 * # 模型超类
 * @author Hamm
 * @template P 模型前缀
 */
export class AirModel<P extends string = string> {
  /**
   * # 从JSON转换到当前类的对象
   * ---
   * ### 💡 会自动进行数据别名转换
   * @param json JSON
   */
  static fromJson<T extends AirModel>(this: new () => T, json: IJson = {}): T {
    const instance: T = Object.assign(new this()) as T;
    return AirModel.parse<T>(instance, json);
  }

  /**
   * # 从JSON数组转换到当前类的对象数组
   * ---
   * ### 💡 会自动进行数据别名转换
   * @param jsonArray JSON数组
   */
  static fromJsonArray<T extends AirModel>(
    this: new () => T,
    jsonArray: IJson | IJson[] = [],
  ): T[] {
    const instanceList: T[] = [];
    if (Array.isArray(jsonArray)) {
      for (let i = 0; i < jsonArray.length; i += 1) {
        const instance: T = Object.assign(new this()) as T;
        instanceList.push(AirModel.parse(instance, jsonArray[i]));
      }
    } else {
      const instance: T = Object.assign(new this()) as T;
      instanceList.push(AirModel.parse(instance, jsonArray));
    }
    return instanceList;
  }

  /**
   * # 转换JSON为实体
   * ---
   * ### 💡 会自动进行数据别名转换
   * @param instance 实体
   * @param json JSON
   */
  static parse<T extends AirModel>(instance: T, json: IJson = {}): T {
    const fieldKeyList = Object.keys(instance);
    for (const fieldKey of fieldKeyList) {
      const defaultValue = getDefault(instance, fieldKey);
      const FieldTypeClass = getType(instance, fieldKey);
      const fieldAliasName = getAlias(instance, fieldKey);
      let fieldData =
        json[
          (!getNoPrefix(instance, fieldKey) ? getFieldPrefix(instance) : "") +
            (fieldAliasName || fieldKey)
        ];
      if (fieldData === undefined) {
        // 没有值尝试获取默认值
        fieldData = getDefault(instance, fieldKey);
      }
      (instance as any)[fieldKey] = fieldData;

      const toModelFunction = getToModel(instance, fieldKey);
      if (toModelFunction !== undefined) {
        // 标记了手动转换到模型的自定义方法
        try {
          (instance as any)[fieldKey] = toModelFunction(json as any);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("ToModel Function Error", e);
          continue;
        }
      }
      if (getIsList(instance, fieldKey)) {
        // 是数组 循环转换
        const fieldValueList: any = [];
        if (typeof fieldData === "object" && Array.isArray(fieldData)) {
          for (let i = 0; i < fieldData.length; i += 1) {
            // 如果标记了类 需要递归处理
            if (FieldTypeClass) {
              fieldValueList[i] = this.parse(
                new FieldTypeClass() as AirModel,
                fieldData[i],
              );
            }
          }
        }
        (instance as any)[fieldKey] = fieldValueList;
        continue;
      }
      if (
        defaultValue !== undefined &&
        (fieldData === undefined || fieldData === null || fieldData === "")
      ) {
        // 如果有默认值 则先给上默认值
        (instance as any)[fieldKey] = defaultValue;
      }

      if (!FieldTypeClass || fieldData === undefined || fieldData === null) {
        // 属性值为非 ```undefined``` 和 ```null``` 时不转换
        continue;
      }

      if (!FieldTypeClass) {
        // 无需强制转换
        continue;
      }

      switch (FieldTypeClass.name) {
        case "String":
          (instance as any)[fieldKey] = fieldData.toString();
          break;
        case "Number":
          // 强制转换为Number, 但如果不是标准的Number, 则忽略掉值
          (instance as any)[fieldKey] = Number.isNaN(
            Number.parseFloat(fieldData),
          )
            ? undefined
            : Number.parseFloat(fieldData);
          break;
        case "Boolean":
          // 强制转换为布尔型
          (instance as any)[fieldKey] = !!fieldData;
          break;
        default:
          // 是对象 需要递归转换
          (instance as any)[fieldKey] = this.parse(
            new FieldTypeClass() as AirModel,
            fieldData,
          );
      }
    }

    // 最后删除无用的数据
    for (const fieldKey of fieldKeyList) {
      const fieldAliasName = getAlias(instance, fieldKey);

      if (fieldAliasName && fieldAliasName !== fieldKey) {
        delete (instance as any)[fieldAliasName];
      }
    }
    return instance;
  }

  /**
   * # 创建一个当前类的实例
   * @param recoverBy (可选)初始化用于覆盖对象实例的JSON
   */
  static newInstance<T extends AirModel>(
    this: new () => T,
    recoverBy?: IJson,
  ): T {
    const instance = Object.assign(new this(), null) as T;
    if (recoverBy) {
      return instance.recoverBy(recoverBy);
    }
    return instance;
  }

  /**
   * # 获取模型名称
   * 可使用 @Model 装饰器修饰 如无修饰 则直接返回类名
   */
  static getModelName() {
    return this.newInstance().getModelName();
  }

  /**
   * @deprecated
   * @see getModelName()
   */
  static getClassName() {
    return this.getModelName();
  }

  /**
   * # 获取属性的可阅读名字
   * @param fieldKey 属性名
   * 可使用 @FieldName 装饰器修饰 如无修饰 则直接返回属性名
   */
  static getFieldName(fieldKey: string): string {
    return this.newInstance().getFieldName(fieldKey);
  }

  static getDictionary<T extends IDictionary>(
    fieldKey: string,
  ): AirDictionaryArray<T> {
    return getDictionary(this.newInstance(), fieldKey);
  }

  /**
   * # 用指定的数据对当前实例进行覆盖
   * ---
   * ### 💡 相同字段才会覆盖上去
   * @param obj 覆盖对象
   */
  recoverBy(obj: IJson | AirModel): this {
    return Object.assign(this, obj);
  }

  /**
   * # 将当前实例复制到一个新实例上
   */
  copy(): this {
    const newModel = Object.create(Object.getPrototypeOf(this));
    return Object.assign(newModel, this);
  }

  /**
   * # 暴露部分类的字段
   * @param fields 字段列表
   */
  expose(...fields: string[]): this {
    const fieldList = Object.keys(this);
    for (const field of fieldList) {
      if (!fields.includes(field)) {
        (this as any)[field] = undefined;
      }
    }
    return this;
  }

  /**
   * # 排除部分类的字段
   * @param fields 字段列表
   */
  exclude(...fields: string[]): this {
    const fieldList = Object.keys(this);
    for (const field of fieldList) {
      if (fields.includes(field)) {
        (this as any)[field] = undefined;
      }
    }
    return this;
  }

  /**
   * # 转换到JSON
   * ---
   * ### 💡 会自动进行数据别名转换
   */
  toJson<
    V,
    W extends keyof V,
    X extends { readonly [K in keyof V]?: string },
  >() {
    const fieldPrefix = getFieldPrefix<P>(this);

    // 定义类型映射，将所有属性字段加上前缀，除非字段在 NoPrefixFields 中
    type Prefixed<T, P extends string, W> = {
      // [K in keyof T as K extends W ? K : `${P}${string & K}`]: T[K];
      [K in keyof T as K extends W
        ? K
        : K extends keyof X
          ? `${P}${X[K]}`
          : `${P}${string & K}`]: T[K];
    };
    // 使用 Omit 工具类型排除父类或超类的属性
    type UserModelOwnProps = Omit<V, keyof AirModel>;
    // 使用类型映射生成新的类型
    type PrefixedUserModel = Prefixed<UserModelOwnProps, typeof fieldPrefix, W>;

    const fieldKeyList = Object.keys(this);
    const json: PrefixedUserModel | { [key: string]: any } = {};
    for (const fieldKey of fieldKeyList) {
      const fieldData = (this as any)[fieldKey];
      let fieldAliasName = getAlias(this, fieldKey) || fieldKey;
      if (!getNoPrefix(this, fieldKey) && fieldPrefix) {
        // 按忽略前缀规则获取别名
        fieldAliasName = fieldPrefix + fieldAliasName;
      }
      const toJsonFunction = getToJson(this, fieldKey);
      json[fieldAliasName || fieldKey] = fieldData;

      if (toJsonFunction !== undefined) {
        // 如果标记了自定义转换JSON的方法
        try {
          json[fieldAliasName || fieldKey] = toJsonFunction(this);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("ToJson Function Error", e);
        }
        continue;
      }

      if (typeof fieldData === "object") {
        // 是数组 循环转换
        if (Array.isArray(fieldData)) {
          // 数组需要循环转换
          const jsonList: IJson[] = [];
          for (let i = 0; i < fieldData.length; i += 1) {
            if (typeof fieldData[i] === "object") {
              jsonList[i] = (fieldData[i] as AirModel).toJson();
              continue;
            }
            jsonList[i] = fieldData[i] as AirModel;
          }
          json[fieldAliasName || fieldKey] = jsonList;
          continue;
        }
        // 是对象 递归转换
        json[fieldAliasName || fieldKey] = (fieldData as AirModel).toJson();
      }
    }

    return json as PrefixedUserModel;
  }

  /**
   * # 请直接调用静态方法获取
   * ! 内部使用的保留方法
   * @deprecated
   */
  getModelName(): string {
    return getModelName(this) || this.constructor.name;
  }

  /**
   * # 请直接调用静态方法获取
   * ! 内部使用的保留方法
   * @deprecated
   */
  getFieldName(fieldKey: string): string {
    return getFieldName(this, fieldKey);
  }
}
