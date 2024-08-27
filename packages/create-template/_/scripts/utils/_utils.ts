import fs from "node:fs";
import { dirname, resolve } from "node:path";

// 短横线字符串转驼峰字符串 | 如果 isPascalCase 为 true，则转换为帕斯卡命名法
export function kebabToCamelCase(str: string, isPascalCase = false) {
  const camelCaseStr = str.replace(/-([a-z])/g, (all, letter) =>
    letter.toUpperCase(),
  );
  return isPascalCase
    ? camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1)
    : camelCaseStr;
}

// 首字母大写
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 使用正则表达式匹配根目录
const isRoot = (path: string) => {
  // 适配 Unix 系统根目录和 Windows 系统盘符根目录
  const unixRoot = /^\/$/;
  const windowsRoot = /^[a-zA-Z]:\\$/;
  return unixRoot.test(path) || windowsRoot.test(path);
};

/**
 * 查找项目根目录
 * 查找当前目录是否存在 package.json
 * 如果不存在，则向上查找
 */
export function findRootPath() {
  let root: string = resolve(__dirname, ".");
  process.env.NODE_ENV;
  while (!fs.existsSync(resolve(root, "package.json"))) {
    // 如果已经到了根目录，则路径设置为undefined
    if (isRoot(root)) return undefined;

    root = dirname(root);
  }
  return root;
}
