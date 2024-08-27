import fs from "node:fs";
import path from "node:path";

/**
 * 格式化目标目录
 * @param targetDir 目标目录
 * @returns 格式化后的目标目录
 */
export function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

/**
 * 复制文件或目录
 * @param src 源文件或目录
 * @param dest 目标文件或目录
 */
export function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

/**
 * 判断是否为有效的包名
 * @param projectName 包名
 * @returns 是否为有效的包名
 */
export function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  );
}

/**
 * 转换为有效的包名
 * @param projectName 包名
 * @returns 有效的包名
 */
export function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-");
}

/**
 * 复制目录
 * @param srcDir 源目录
 * @param destDir 目标目录
 */
export function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

/**
 * 判断目录是否为空
 * @param path 目录路径
 * @returns 是否为空
 */
export function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

/**
 * 清空目录
 * @param dir 目录
 */
export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

/** 解析 `process.env.npm_config_user_agent` 字符串内容 ｜ 获取包管理工具信息 */
export function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

export function setupReactSwc(root: string, isTs: boolean) {
  editFile(path.resolve(root, "package.json"), (content) => {
    return content.replace(
      /"@vitejs\/plugin-react": ".+?"/,
      `"@vitejs/plugin-react-swc": "^3.5.0"`,
    );
  });
  editFile(
    path.resolve(root, `vite.config.${isTs ? "ts" : "js"}`),
    (content) => {
      return content.replace(
        "@vitejs/plugin-react",
        "@vitejs/plugin-react-swc",
      );
    },
  );
}

/**
 * 编辑文件
 * @param file 文件路径
 * @param callback 回调函数
 * @returns
 */
export function editFile(file: string, callback: (content: string) => string) {
  const content = fs.readFileSync(file, "utf-8");
  fs.writeFileSync(file, callback(content), "utf-8");
}
