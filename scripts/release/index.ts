import path from 'node:path'
import fs from 'node:fs'
import semver from 'semver'
import consola from 'consola'
import { execa } from 'execa'
import { checkbox, select, input } from '@inquirer/prompts'
import { findWorkspacePackages } from '@pnpm/find-workspace-packages'
import { projRoot, projPackage } from '../utils/paths'
import { PACKAGE_NAME } from '../utils/constant'
import { genVersion } from './gen-version'

type SemverRow = {
  release: semver.ReleaseType
  optionsOrLoose?: boolean | semver.Options | string
  identifier?: string
}

// 打印
const echo = (msg: string) => consola.success(msg)

// 运行脚本
const run = (bin: string, args: string[], opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })

//  版本列表
const versionIncrements: SemverRow[] = [
  {
    release: 'patch' // 修订版本号，问题修复
  },
  {
    release: 'minor' // 次版本 功能性的改动
  },
  {
    release: 'major' // 主版本 不兼容的大改动
  },
  {
    release: 'prepatch', // 预修订版本
    optionsOrLoose: 'rc',
    identifier: '1'
  },
  {
    release: 'preminor', // 预次版本
    optionsOrLoose: 'rc',
    identifier: '1'
  },
  {
    release: 'premajor', // 预主版本
    optionsOrLoose: 'rc',
    identifier: '1'
  },
  {
    release: 'prerelease', // 预发布 - alpha 测试（内测版）
    optionsOrLoose: 'alpha',
    identifier: '1'
  },
  {
    release: 'prerelease', // 预发布 - beta 测试（公测版）
    optionsOrLoose: 'beta',
    identifier: '1'
  }
]

// 获取工作空间包
const getWorkspaceList = async (dir = projRoot) => {
  const pkgs = await findWorkspacePackages(projRoot)
  return pkgs
    .filter(pkg => pkg.dir.startsWith(dir))
    .filter(pkg => pkg.manifest.private !== true && pkg.manifest.name)
}

/**
 * 更新版本号
 * @param {string} version
 */
const updatePackage = (version: string, pkgPath: string) => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

// 获取版本
const getVersion = async (currentVersion: string, pkgName: string) => {
  // 发布版本
  let version: string | null
  const selectChoices = versionIncrements
    .map(item => {
      const value = semver.inc(
        currentVersion,
        item.release,
        item.optionsOrLoose as unknown as semver.Options,
        item.identifier
      )
      const name = `${item.release} (${value})`

      return {
        name,
        value
      }
    })
    .concat({ name: 'custom', value: 'custom' })

  version = await select({
    // message: `Select release type (${pkgName})`,
    message: `选择发布类型 (${pkgName})`,
    choices: selectChoices
  })

  // 自定义版本
  if (version === 'custom') {
    // version = await input({ message: 'Enter custom version' })
    version = await input({ message: '输入自定义版本' })
    // 校验版本
    if (!semver.valid(version)) {
      // throw new Error(`Illegal version: ${version}`)
      throw new Error(`非法版本: ${version}`)
    }
  }

  return version
}

/** 提交 */
interface CommitInfo {
  version?: string
  name?: string
}
async function commit({ version, name }: CommitInfo = {}) {
  try {
    // 打tag
    if (version) {
      await run('git', ['tag', '-a', `${name}/v${version}`, '-m', `${name}/v${version}`])
    }

    // 生成changelog
    if (version) {
      await run('npm', ['run', '--name', 'changelog'])
    }

    // 更新导出 版本号
    if (version) {
      await genVersion(version)
    }

    await run('git', ['add', '-A'])
    await run('npm', ['run', '--name', 'commit'])
    await run('git', ['pull'])

    // push tag ｜ TODO: 暂时不自动push
    // if (version) {
    //   await run('git', ['push', '--tags'])
    // }
    // await run('git', ['push'])
    echo(`\ncommit success ${version}`)
  } catch (error: any) {
    throw new Error(error)
  }
}

const main = async () => {
  const workspaceList = await getWorkspaceList()  
  const workspaceNames = workspaceList.map(item => item.manifest.name) as string[]
  const workspaceMaps = workspaceList.map(item => ({
    dir: item.dir,
    name: item.manifest.name,
    version: item.manifest.version,
    pkgPath: path.resolve(item.dir, 'package.json')
  }))
  
  // 选择需要更新的包
  let selectPackages: string[] = []
  const checkboxChoices = workspaceNames.map(item => ({
    name: item,
    value: item,
    checked: item === PACKAGE_NAME
  }))
  const packages = await checkbox({
    // message: 'Which packages would you like to include?',
    message: '你想要更新哪些包?',
    choices: [{ name: 'all', value: 'all' }, ...checkboxChoices]
  })
  console.log(packages);

  if (!packages.length) {
    // throw new Error('Please select one or more packages!')
    throw new Error('请选择一个或多个包!')
  }

  if (packages.includes('all')) { // 如果其中包含all ｜ 则更新所有包，无视其他选择
    selectPackages = workspaceNames
  } else {
    selectPackages = [...packages]
  }

  // 更新版本号
  for (let index = 0; index < selectPackages.length; index++) {
    const name = selectPackages[index]
    const packageInfo = workspaceMaps.find(i => i.name === name)
    const pkg = name === PACKAGE_NAME ? JSON.parse(fs.readFileSync(projPackage, 'utf-8')) : packageInfo
    const pkgPath = name === PACKAGE_NAME ? projPackage : packageInfo?.pkgPath
    const version = await getVersion(pkg.version as string, packageInfo?.name as string)
    
    updatePackage(version as string, pkgPath as string)
    // consola.success(`Successfully updated version ${name}!`)
    consola.success(`成功更新版本 ${name}！`)
  }
  
  if (selectPackages.includes(PACKAGE_NAME)) {
    const mainPkg = JSON.parse(fs.readFileSync(projPackage, 'utf-8'))
    commit({ version: mainPkg.version, name: PACKAGE_NAME })
  } else {
    commit()
  }
}

main()
  .then(() => {
    console.log('success')
  })
  .catch(err => {
    console.log(err)
  })
