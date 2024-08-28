import type { Plugin } from "rollup";

/**
 * 清除console.log
 * @returns
 */
export function ClearConsolePlugin(): Plugin {
  const reg = /(console.log()(.*)())/g;
  return {
    name: "clear-console-plugin",
    transform(source) {
      source = source.replace(reg, "");
      return source;
    },
  };
}
