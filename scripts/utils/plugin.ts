import type { Plugin } from 'rollup'
import { PACKAGE_NAME } from './constant'

/**
 * 清除console.log
 * @returns
 */
export function ClearConsolePlugin(): Plugin {
  const reg = /(console.log()(.*)())/g
  return {
    name: `${PACKAGE_NAME}-clear-console-plugin`,
    transform(source) {
      source = source.replace(reg, '')
      return source
    }
  }
}
