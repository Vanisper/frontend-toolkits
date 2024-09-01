## [@frontend-toolkits/create-template/v0.0.2-alpha.3](https://github.com/Vanisper/frontend-toolkits/compare/@frontend-toolkits/create-template/v0.0.2-alpha.2...@frontend-toolkits/create-template/v0.0.2-alpha.3) (2024-09-02)


### ✨ Features

* **@frontend-toolkits/create-template:release-ci:** 模版创建工具同步新增 `release-ci` 相关逻辑、配置([f9662a4](https://github.com/Vanisper/frontend-toolkits/commit/f9662a4)) by@Vanisper








## [@frontend-toolkits/create-template/v0.0.2-alpha.2](https://github.com/Vanisper/frontend-toolkits/compare/@frontend-toolkits/create-template/v0.0.2-alpha.1...@frontend-toolkits/create-template/v0.0.2-alpha.2) (2024-09-01)






### 🐛 Bug Fixes

* **workflows/release.yml:** git-tag change `--sort=-taggerdate` to `--sort=-creatordate`([8dca377](https://github.com/Vanisper/frontend-toolkits/commit/8dca377)) by@Vanisper
* **@frontend-toolkits/create-template:package.json:** 修复 `npx` 运行报错的问题([9bfb5fe](https://github.com/Vanisper/frontend-toolkits/commit/9bfb5fe)) by@Vanisper




## [@frontend-toolkits/create-template/v0.0.2-alpha.1](https://github.com/Vanisper/frontend-toolkits/compare/@frontend-toolkits/create-template/v0.0.2-rc.1...@frontend-toolkits/create-template/v0.0.2-alpha.1) (2024-09-01)


### ✨ Features

* **@frontend-toolkits/create-template:release.yml:** 同步 `release.yml` 工作流内容([4e5fe7d](https://github.com/Vanisper/frontend-toolkits/commit/4e5fe7d)) by@Vanisper




### 🐛 Bug Fixes

* **workflow/release.yml:** 修复release工作流因 `grep` 匹配导致的崩溃问题([9bb0c64](https://github.com/Vanisper/frontend-toolkits/commit/9bb0c64)) by@Vanisper
* **@frontend-toolkits/create-template:scripts/changelog:** 模版同步实现：日志生成适配没有tag的情况([7e49234](https://github.com/Vanisper/frontend-toolkits/commit/7e49234)) by@Vanisper
* **scripts/changelog:** 日志生成适配没有tag的情况([33195a7](https://github.com/Vanisper/frontend-toolkits/commit/33195a7)) by@Vanisper




## [@frontend-toolkits/create-template/v0.0.2-rc.1](https://github.com/Vanisper/frontend-toolkits/compare/frontend-toolkits/v0.0.1...@frontend-toolkits/create-template/v0.0.2-rc.1) (2024-08-30)


### ✨ Features

* **packages/create-template:** 模版创建新增 `release`、`changelog` 脚本模块([d250e2b](https://github.com/Vanisper/frontend-toolkits/commit/d250e2b)) by@Vanisper




### 🐛 Bug Fixes

* **workflows/release.yml:** 更换获取tag列表的排序方式([69e3cc3](https://github.com/Vanisper/frontend-toolkits/commit/69e3cc3)) by@Vanisper
* **workflows/release.yml:** 适配tag的不同命名空间([c8cb0a1](https://github.com/Vanisper/frontend-toolkits/commit/c8cb0a1)) by@Vanisper
* **workflows/release.yml:** 修复tag获取不到的问题([568fe97](https://github.com/Vanisper/frontend-toolkits/commit/568fe97)) by@Vanisper
* **workflows/release.yml:** 修复反引号字符串被解析成可执行程序的问题([801b84c](https://github.com/Vanisper/frontend-toolkits/commit/801b84c)) by@Vanisper
* **workflows/release.yml:** 适配只有一个tag的情况([d5b8c0f](https://github.com/Vanisper/frontend-toolkits/commit/d5b8c0f)) by@Vanisper
* **workflows/release.yml:** 修正发布工作流触发逻辑([538c276](https://github.com/Vanisper/frontend-toolkits/commit/538c276)) by@Vanisper
* **ci:changelog:** 修复生成的 `changelog.md` 加粗样式无效的问题([45aedab](https://github.com/Vanisper/frontend-toolkits/commit/45aedab)) by@Vanisper




## [frontend-toolkits/v0.0.1](https://github.com/Vanisper/frontend-toolkits/commit/af2fb4e) (2024-08-30)


### ✨ Features

* **packages/frontend-toolkits:** 新增项目主入口包 —— `frontend-toolkits`([aa7e613](https://github.com/Vanisper/frontend-toolkits/commit/aa7e613)) by@Vanisper
* **packages/create-template:** 新增模版生成库 —— `@frontend-toolkits/create-template`([dc962fe](https://github.com/Vanisper/frontend-toolkits/commit/dc962fe)) by@Vanisper
* **packages/utils:** 新增工具库 —— `@frontend-toolkits/utils`([861c001](https://github.com/Vanisper/frontend-toolkits/commit/861c001)) by@Vanisper
* **root:scripts:** 新增git提交shell脚本([98d054b](https://github.com/Vanisper/frontend-toolkits/commit/98d054b)) by@Vanisper
* **root:scripts:** 新增项目构建脚本所需的工具函数([0f11ed5](https://github.com/Vanisper/frontend-toolkits/commit/0f11ed5)) by@Vanisper
* **root:typings:** 预置项目根目录下的全局类型文件([989e19a](https://github.com/Vanisper/frontend-toolkits/commit/989e19a)) by@Vanisper
* **all:** 调整tsconfig配置逻辑，加入vitest([319c09f](https://github.com/Vanisper/frontend-toolkits/commit/319c09f)) by@Vanisper
* **packages:** 初建项目结构([b6496ae](https://github.com/Vanisper/frontend-toolkits/commit/b6496ae)) by@Vanisper




### 🐛 Bug Fixes

* **ci:release:** 修正不正确的包名称传参([b6f4817](https://github.com/Vanisper/frontend-toolkits/commit/b6f4817)) by@Vanisper
* **ci:changelog:** 修复 `changelog` 脚本无法正确获取tag信息的bug([4c0c30a](https://github.com/Vanisper/frontend-toolkits/commit/4c0c30a)) by@Vanisper
* **all:** 修复`rimraf`删除子包依赖的不正确写法([35b63ca](https://github.com/Vanisper/frontend-toolkits/commit/35b63ca)) by@Vanisper
* **core:BUG:** 修复核心库各基础类因 `this` 关键字均切换成当前类本身导致的严重问题([d737344](https://github.com/Vanisper/frontend-toolkits/commit/d737344)) by@Vanisper
* **root:package.json:** 修复git-hook准备工作运行命令([029703d](https://github.com/Vanisper/frontend-toolkits/commit/029703d)) by@Vanisper




