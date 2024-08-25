// 短横线字符串转驼峰字符串 | 如果 isPascalCase 为 true，则转换为帕斯卡命名法
export function kebabToCamelCase(str: string, isPascalCase = false) {
    const camelCaseStr = str.replace(/-([a-z])/g, (all, letter) => letter.toUpperCase())
    return isPascalCase ? camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1) : camelCaseStr
}

// 首字母大写
export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}