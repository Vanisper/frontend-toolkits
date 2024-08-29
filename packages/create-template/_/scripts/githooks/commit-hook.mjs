import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// 获取脚本所在目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// 读取提交消息 .git/COMMIT_EDITMSG
const commitMsgFile = process.argv[2];
const commitMsg = readFileSync(commitMsgFile, 'utf8');
const commitMsg_FistLine = commitMsg.split('\n')[0];

// https://github.com/conventional-changelog/commitlint/issues/880#issuecomment-1361000193 // Test URL: https://regex101.com/r/gYkG99/1
// 定义正则表达式 /^(?::\w*:|(?:\ud83c[\udf00-\udfff])|(?:\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55])  \s  (?<type>\w*)  (?:\((?<scope>.*)\))? !?  :  \s  (?<subject>(?:(?!#).)*(?:(?!\s).))  (?:\s\(?(?<ticket>#\d*)\)?)?  $/
// const headerPattern = /^(?::\w*:|(?:\ud83c[\udf00-\udfff])|(?:\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55])\s(?<type>\w*)(?:\((?<scope>.*)\))?!?:\s(?<subject>(?:(?!#).)*(?:(?!\s).))(?:\s\(?(?<ticket>#\d*)\)?)?$/; // :start: chore(scope): test #123
const headerPattern = /^(?<type>\w*)(?:\((?<scope>.*)\))?!?:\s(?:(?::\w*:|(?:\ud83c[\udf00-\udfff])|(?:\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55])\s)?(?<subject>(?:(?!#).)*(?:(?!\s).))(?:\s\(?(?<ticket>#\d*)\)?)?$/; // chore(scope): test #123

// 提取提交类型
const commitTypeMatch = commitMsg_FistLine.trim().match(headerPattern);
const commitType = commitTypeMatch && commitTypeMatch.groups ? commitTypeMatch.groups.type : null;


// 读取 JSON 文件
const jsonFile = resolve(__dirname, '_enum_types_.json');

const emojiMap = JSON.parse(readFileSync(jsonFile, 'utf8'));

// 获取对应的 emoji
const emoji = commitType && emojiMap[commitType] ? emojiMap[commitType].emoji : null;

// 如果找到对应的 emoji，则修改提交消息
if (emoji) {
    if (commitTypeMatch && commitTypeMatch.groups) {
        const { type, scope, subject, ticket } = commitTypeMatch.groups;

        // 添加 emoji 前缀到 commitSubject
        const newSubject = `${emoji} ${subject.trim()}`;
        
        // 重建提交消息
        let newCommitMsg = `${type}`;
        if (scope) {
            newCommitMsg += `(${scope})`;
        }
        newCommitMsg += `: ${newSubject}`;
        if (ticket) {
            newCommitMsg += ` (${ticket})`;
        }

        // 写入提交消息的其他行
        const commitMsgLines = commitMsg.split('\n');
        commitMsgLines.shift();
        newCommitMsg += '\n' + commitMsgLines.join('\n');

        writeFileSync(commitMsgFile, newCommitMsg, 'utf8');
    }

}