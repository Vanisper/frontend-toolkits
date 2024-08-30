import { resolve } from "node:path";
import { findRootPath } from "./_utils";
import { PACKAGE_NAME } from "./constant";

/** 项目根目录 `/`  */
export const projRoot = findRootPath() || resolve(__dirname, "../../");
/** 包目录 `/packages` */
export const pkgRoot = resolve(projRoot, "packages");
/** 组件目录 `/packages/components` */
export const compRoot = resolve(pkgRoot, "components");
/** hooks目录  `/packages/hooks`  */
export const hookRoot = resolve(pkgRoot, "hooks");
/** 工具函数目录 `/packages/utils`  */
export const utilRoot = resolve(pkgRoot, "utils");
/** 语言包目录 `/packages/locale`  */
export const localesRoot = resolve(pkgRoot, "locale");

/** frontend-toolkits 目录 即 `/packages/frontend-toolkits` */
export const mainRoot = resolve(pkgRoot, PACKAGE_NAME);

/** Docs */
export const docsDirName = "docs";
export const docRoot = resolve(projRoot, docsDirName);
export const vpRoot = resolve(docRoot, ".vitepress");

/** `/dist` */
export const buildOutput = resolve(projRoot, "dist");
/** `/dist/frontend-toolkits` */
export const mainOutput = resolve(buildOutput, PACKAGE_NAME);

export const mainPackage = resolve(mainRoot, "package.json");
export const projPackage = resolve(projRoot, "package.json");
export const compPackage = resolve(compRoot, "package.json");
export const hookPackage = resolve(hookRoot, "package.json");
export const utilPackage = resolve(utilRoot, "package.json");
export const docPackage = resolve(docRoot, "package.json");

// dts
export const TSCONFIG_PATH = resolve(projRoot, "tsconfig.web.json");
export const DTS_OUT_DIR = resolve(buildOutput, "types");
