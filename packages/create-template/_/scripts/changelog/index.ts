import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import days from "dayjs";
import { cloneDeep } from "lodash";
import qs from "qs";

type Tag = {
  /* 标签 */
  tag: string;
  /* 提交id */
  id: string;
  /* 作者 */
  author: string;
  /* 日期 */
  date: string;
  /* sha值 */
  sha: string;
  /* 上一个tag */
  pre: Tag;
};

type Log = {
  /* 提交id */
  id: string;
  /* 作者 */
  author: string;
  /* 日期 */
  date: string;
  /* sha值 */
  sha: string;
  /* 描述 */
  desc: string;
  /* 主题 */
  reg: string;
  /* commit主要内容 */
  subject: string;
  /* commit类型 */
  type: string;
  /* commit作用域 ｜ 文件或者模块 */
  scope: string;
};

type CommitInfo = {
  /* commit主要内容 */
  subject: string;
  /* commit类型 */
  type: string;
  /* commit作用域 ｜ 文件或者模块 */
  scope?: string;
  /* git-emoji */
  emoji?: string;
  /* 任务单号 */
  ticket?: string;
};

// const formatConfigPath = path.resolve(__dirname, '../../.prettierrc.js')
// const formatConfig = require(formatConfigPath)

const execPromise = (
  command: string,
): Promise<{ success: boolean; data: string | null }> => {
  return new Promise((resolve, _reject) => {
    exec(command, (err, stdout) => {
      if (!stdout || err) {
        resolve({ success: false, data: null });
        return;
      }

      resolve({ success: true, data: stdout });
    });
  });
};

const errorHandle = (success: boolean, msg = "") => {
  if (!success) {
    throw new Error(msg || "exec error");
  }
};

// 解析commit信息
const getInfo = (data: string): CommitInfo | null => {
  const headerPattern =
    /^(?<type>\w*)(?:\((?<scope>.*)\))?!?:\s(?:(?<emoji>:\w*:|(?:\ud83c[\udf00-\udfff])|(?:\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55])\s)?(?<subject>(?:(?!#).)*(?:(?!\s).))(?:\s\(?(?<ticket>#\d*)\)?)?$/; // chore(scope): :emoji: test #123

  const match = data.trim().match(headerPattern);
  const matchGroups = match?.groups;

  if (
    !matchGroups ||
    matchGroups.subject === undefined ||
    matchGroups.type === undefined
  )
    return null;

  return {
    type: matchGroups.type.trim(),
    subject: matchGroups.subject.trim(),
    scope: matchGroups.scope?.trim(),
    emoji: matchGroups.emoji?.trim(),
    ticket: matchGroups.ticket?.trim(),
  };
};

const handleLogData = async (): Promise<Log[]> => {
  const { success, data: log } = await execPromise(
    'git log --pretty=format:"id=%H&author=%an&date=%ad&sha=%h&desc=%s"     --date=format:"%Y/%m/%d %H:%M:%S" \n',
  );
  errorHandle(success);

  const temp = log?.split("\n");
  const logData = temp
    ?.filter((item) => item) // 过滤空行
    .map((item) => {
      // 其余的都是链接地址的形式
      // 此处对链接字符串进行解析 获取`desc`字段信息
      const info = qs.parse(item) as { desc: string };

      return { ...info, ...getInfo(info.desc) };
    });

  return logData as Log[];
};
const handleTagData = async (): Promise<Tag[]> => {
  const { success: _success, data: tagStr } = await execPromise("git tag");
  // TODO: 此处不做错误处理 ｜ 因为首次提交没有tag
  // errorHandle(success, 'tag error')

  const tags =
    tagStr
      ?.split("\n")
      .filter((item) => item)
      .map((item) => ({ tag: item })) || [];
  let tagData: Tag[] = [];
  for (const item of tags) {
    const { success, data } = await execPromise(
      `git show ${item.tag} -q --pretty=format:"%id=%H&author=%an&date=%ad&sha=%h%"     --date=format:"%Y/%m/%d %H:%M:%S"`,
    );
    errorHandle(success, "tag show error");

    const temp =
      data?.slice(data.indexOf("%") + 1, data.lastIndexOf("%")) || "";

    const tag = qs.parse(temp);
    tagData.push({ ...item, ...tag } as unknown as Tag);
  }
  tagData = tagData
    .sort((a, b) => +new Date(b.date) - +new Date(a.date)) // 按时间排序
    .map((item, index, array) => ({
      ...item,
      pre: array[index + 1],
    }));
  return tagData;
};

const main = async () => {
  // 获取远程仓库地址
  const { success, data } = await execPromise(
    "git remote get-url --all origin",
  );
  const target = data?.replace(".git", "/").replace("\n", "");

  errorHandle(success);

  // 匹配关键部分 替换为仓库对应的链接
  const replacePull = (content: string) => {
    return content.replace(
      /pull request (#(\d+))/,
      (_, data, number) => `pull request [${data}](${target}pull/${number})`,
    );
  };

  const logs = await handleLogData();
  const tags = await handleTagData();

  const res: (Partial<Tag> & { content: Log[] })[] = [];

  if (!tags.length) {
    // 没有tag | 使用所有的commit
    res.push({ content: logs });
  } else {
    res.push(
      ...tags.map((item) => {
        const start = logs.findIndex((i) => i.id === item.id);
        const end = logs.findIndex((i) => i.id === item.pre?.id);
        const data = cloneDeep(logs).slice(
          start,
          end === -1 ? logs.length : end,
        );
        return {
          ...item,
          content: data,
        };
      }),
    );
  }

  const mdContent = res.map((item) => {
    let md = "";
    if (item.id) {
      if (!item.pre?.tag) {
        md = `## [${item.tag}](${target}commit/${item.sha}) (${days(item.date).format("YYYY-MM-DD")})`;
      } else {
        md = `## [${item.tag}](${target}compare/${item.pre?.tag}...${item.tag}) (${days(
          item.date,
        ).format("YYYY-MM-DD")})`;
      }
    }

    const getFormatContent = (item: Log) => {
      return `* **${item.scope || "all"}:** ${item.subject}([${item.sha}](${target}commit/${
        item.sha
      })) by@${item.author}\n`;
    };

    /** 功能新增 */
    const featData = item.content
      .filter((item) => item.type === "feat" || item.subject.includes("Merge"))
      .map(
        (item) =>
          `* **${item.scope || "all"}:** ${
            item.subject.includes("Merge")
              ? // biome-ignore lint/style/useTemplate: <explanation>
                " " + replacePull(item.subject)
              : item.subject
          }([${item.sha}](${target}commit/${item.sha})) by@${item.author}\n`,
      );

    /** 一些修复 */
    const fixData = item.content
      .filter((item) => item.type === "fix")
      .map((item) => getFormatContent(item));

    /** 代码重构 */
    const refactorData = item.content
      .filter((item) => item.type === "refactor")
      .map((item) => getFormatContent(item));

    /** 性能优化 */
    const perfData = item.content
      .filter((item) => item.type === "perf")
      .map((item) => getFormatContent(item));

    /** 文档变更 */
    const docsData = item.content
      .filter((item) => item.type === "docs")
      .map((item) => getFormatContent(item));

    const content =
      // biome-ignore lint/style/useTemplate: <explanation>
      md +
      "\n\n\n" +
      (featData.length ? `### ✨ Features\n\n${featData.join("")}` : "") +
      "\n\n" +
      (perfData.length
        ? `### ⚡ Performance Improvements\n\n${perfData.join("")}`
        : "") +
      "\n\n" +
      (fixData.length ? `### 🐛 Bug Fixes\n\n${fixData.join("")}` : "") +
      "\n\n" +
      (refactorData.length
        ? `### ♻️ Code Refactoring\n\n${refactorData.join("")}`
        : "") +
      "\n\n" +
      (docsData.length
        ? `### 📚 Documentation Update\n\n${docsData.join("")}`
        : "") +
      "\n\n";

    return content;
  });

  // TODO: 此处需要对内容进行格式化
  const formatContent = mdContent.join("");

  fs.writeFileSync(
    path.resolve(__dirname, "../../CHANGELOG.md"),
    formatContent,
  );
};

main().catch(async (err) => {
  console.log(err);
});
