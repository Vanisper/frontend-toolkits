## 版本管理

### changesets

## 代码提交规范

### commitlint

### commitizen

### cz-customizable

> `cz-customizable` 是一个可以自定义 `commitizen` 的工具，可以根据自己的需求来配置提交规范

### husky

> Husky 是一款 [Git Hooks](https://git-scm.com/docs/githooks) 工具，可以在执行特定的 git 命令时（如: git commit, git push）触发对应的脚本
>
> 本项目基于9.0版本以上的 `husky` 进行配置（9.0版本前后命令行的使用方式有出入！）
>
> ---
>
> 安装好 `husky` 之后，需要在工程根目录下的 `package.json` 中添加一条 script——`"prepare": "husky"`
>
> 需要执行一遍 `echo 'npx --no-install commitlint --edit "$1"'>.husky/_/commit-msg`
> 
> 或者直接在 `package.json` 中添加一条 script——`"prepare": "husky && echo 'npx --no-install commitlint --edit \"$1\"'>.husky/_/commit-msg"` 
>

### lint-staged

> `lint-staged` 是一个可以在提交代码前执行 `lint` 检查的工具
>
> lint-staged 是 Git 里的概念，表示暂存区，lint-staged 表示只检查暂存区中的文件。 
>

package.json:
```json
{
  "lint-staged": {
    "*.ts": [
      "< 代码语法、格式检查的命令 >"
      "git add"
    ]
  }
}
```

之后 `echo "npx --no-install lint-staged">.husky/_/pre-commit` 即可在每次提交代码前执行 `lint-staged` 的检查

