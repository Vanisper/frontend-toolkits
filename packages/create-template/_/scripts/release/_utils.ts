import { findWorkspacePackages } from "@pnpm/find-workspace-packages";
import consola from "consola";
import { execa } from "execa";
import { projRoot } from "../utils/paths";

// 运行脚本
export const run = (bin: string, args: string[], opts = {}) =>
  execa(bin, args, { stdio: "inherit", ...opts });

// 打印
export const echo = (msg: string) => consola.success(msg);

// 获取工作空间包
export const getWorkspaceList = async (dir = projRoot) => {
  const pkgs = await findWorkspacePackages(projRoot);
  return pkgs
    .filter((pkg) => pkg.dir.startsWith(dir))
    .filter((pkg) => pkg.manifest.private !== true && pkg.manifest.name);
};
