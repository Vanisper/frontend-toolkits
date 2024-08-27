import type { PromptConfig, UserConfig } from "@commitlint/types";
import _enum_types_ from "./scripts/githooks/_enum_types_.json";

// 提取 PromptConfig 中 questions 的类型
type QuestionsType = NonNullable<PromptConfig["questions"]>;

// 提取单个 question 中的 enum 类型
type SingleQuestionType = NonNullable<QuestionsType[keyof QuestionsType]>;

// 提取 enum 的类型
type EnumType = NonNullable<SingleQuestionType["enum"]>;

const enumTypes: EnumType = _enum_types_;
const newEnumTypes = Object.fromEntries(
  Object.entries(enumTypes).map(([key, value]) => [
    key,
    {
      description: `${value.emoji} ${value.description}`,
      emoji: value.emoji,
      value: key,
    },
  ]),
);

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 规则的严重性级别。2 表示错误，1 表示警告，0 表示关闭此规则。
    "type-enum": [2, "always", Object.keys(newEnumTypes)],
  },
  prompt: {
    questions: {
      type: {
        // description: "Select the type of change that you're committing:",
        description: "请选择提交的类型",
        enum: newEnumTypes,
      },
    },
  },
};

export default Configuration;
