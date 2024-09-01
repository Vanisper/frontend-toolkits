import path from "node:path";
import { select } from "@inquirer/prompts";
import { PACKAGE_NAME } from "../utils/constant";
import { echo, getWorkspaceList, run } from "./_utils";
import { genVersion } from "./gen-version";

const main = async () => {
  const workspaceList = await getWorkspaceList();
  const workspaceNames = workspaceList.map(
    (item) => item.manifest.name,
  ) as string[];
  const workspaceMaps = workspaceList.map((item) => ({
    dir: item.dir,
    name: item.manifest.name,
    version: item.manifest.version,
    pkgPath: path.resolve(item.dir, "package.json"),
  }));

  // 选择需要更新的包
  const checkboxChoices = workspaceNames
    .map((item) => ({
      name: item,
      value: item,
    }))
    .filter((item) => item.name !== PACKAGE_NAME);
  const selectPackage = await select({
    // message: 'Which packages would you like to include?',
    message: "你想要更新哪个包?",
    choices: [...checkboxChoices],
  });

  const target = workspaceMaps.find((item) => item.name === selectPackage);

  if (!selectPackage || !target) {
    // throw new Error('Please select one or more packages!')
    throw new Error("请选择一个包!");
  }

  if (!target.version || !target.name) {
    throw new Error("version is not exist");
  }

  // 打tag
  const tagName = `${target.name}/v${target.version}`;
  await run("git", [
    "tag",
    "-a",
    tagName,
    "-m",
    `${target.name} v${target.version}`,
  ]);
  await run("npm", ["run", "--name", "changelog"]);
  // 移除tag
  await run("git", ["tag", "-d", tagName]);

  // 更新导出主包版本号
  if (target.name === PACKAGE_NAME) {
    await genVersion(target.version);
  }

  await run("git", ["add", "-A"]);
  // await run('npm', ['run', '--name', 'commit'])
  await run("git", [
    "commit",
    "-m",
    `release(${target.name}): bump version to \`${target.version}\``,
  ]);

  await run("git", [
    "tag",
    "-a",
    tagName,
    "-m",
    `${target.name} v${target.version}`,
  ]);

  echo(`\ncommit success ${tagName}`);
};

main()
  .then(() => {
    console.log("success");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
