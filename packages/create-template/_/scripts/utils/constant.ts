import { capitalize, kebabToCamelCase } from "./_utils";

/** 主包名称 ｜ TODO: 需要修改 */
export const PACKAGE_NAME = "your-project-name";

/** 主包帕斯卡命名 */
export const PACKAGE_CAMEL_CASE_NAME = kebabToCamelCase(PACKAGE_NAME, true);

/** 包前缀 ｜ 项目组织名称 */
export const PACKAGE_PREFIX = `@${PACKAGE_NAME}`;

/** 语言包后缀标识 */
export const LOCALE_SUFFIX = "locale";

/** 语言包名称 */
export const PACKAGE_CAMEL_CASE_LOCALE_NAME = `${PACKAGE_CAMEL_CASE_NAME}${capitalize(LOCALE_SUFFIX)}`;

export const target = "es2018";
