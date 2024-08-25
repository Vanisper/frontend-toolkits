import type { RollupBuild, OutputOptions } from 'rollup'

// 将一个 RollupBuild 对象写入到多个输出选项中
export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map(option => bundle.write(option)))
}

// 异步获取多个 Rollup 打包对象并将其写入多个输出选项中
export async function writeBundlesFunction(
  getBundle: (option: OutputOptions) => Promise<RollupBuild>,
  options: OutputOptions[]
) {
  const task = []
  for (let index = 0; index < options.length; index++) {
    const option = options[index]
    const bundle = await getBundle(option)
    task.push(bundle.write(option))
  }
  return task
}

// 格式化打包文件名
export function formatBundleFilename(name: string, minify?: boolean, ext?: string) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}
