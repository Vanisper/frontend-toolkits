/**
 * # 断言判断提示
 * @author Hamm
 */

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AirAssert {
  /**
   * # 断言条件成立时抛出异常
   * @param condition 条件
   * @param message 错误信息
   * @param title (可选)错误标题
   */
  static when(condition: boolean, message: string, title?: string) {
    if (condition) {
      throw new Error(
        `\n\n[AirAssert Failed]: ${title || ""}\n${message}\n\n\n`,
      );
    }
  }

  /**
   * # 数据是否为 ```null```
   * @param value 断言的值
   * @param message 错误信息
   * @param title (可选)错误标题
   */
  static whenNull(value: any, message: string, title?: string) {
    return this.when(value === null, message, title);
  }

  /**
   * # 数据是否为 ```undefined```
   * @param value 断言的值
   * @param message 错误信息
   * @param title (可选)错误标题
   */
  static whenUndefined(value: any, message: string, title?: string) {
    return this.when(value === undefined, message, title);
  }
}
