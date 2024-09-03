# @frontend-toolkits/create-template <a href="https://www.npmjs.com/package/@frontend-toolkits/create-template"><img src="https://img.shields.io/npm/v/@frontend-toolkits/create-template" alt="npm package"></a>

> 本项目基于 [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)，感谢开源生态🙏！
>
> 用于生成本项目推荐的开发模板

## 使用

```bash
npx @frontend-toolkits/create-template

npx --ignore-existing @frontend-toolkits/create-template # 强制使用远程版本

npx --no-install @frontend-toolkits/create-template # 强制使用本地版本，不存在则报错
```

## （计划）支持模版类型

> 暂时的规划是将每一种项目类型都分为 `工程化版本` 以及 `去工程化版本`，并且优先考虑 `Typescript` 版本。
>
> 工程化版本集成了：
>
> - 代码样式格式化 + 语法类型检查：由 [biomejs](https://biomejs.dev/) 实现
> - commit提交规范检查：由 [commitlint](https://commitlint.js.org/) + [commitizen](https://github.com/commitizen-tools/commitizen) 实现
> - githook能力：由 [lefthook](https://github.com/evilmartians/lefthook) 实现

### 前端

* [X] vanilla-vite-ts
* [X] vue-vite-ts
* [ ] [electron-vite-ts](https://electron-vite.org)
* [ ] [web-extension-wxt](https://wxt.dev)

### 后端

* [ ] nestjs
