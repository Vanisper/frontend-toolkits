/**
 * 需要排除的文件夹关键字
 */
const excludes = [
  'node_modules',
  '__tests__',
  'dist',
]

/**
 * 过滤文件列表
 * @param files 原始文件列表
 * @returns 过滤后的文件列表
 */
export const excludeFiles = (files: string[]) => {
  return files.filter(path => ![...excludes].some(exclude => path.includes(exclude)))
}
