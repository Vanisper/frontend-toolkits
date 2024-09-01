import { blue, green, yellow } from "kolorist";
import type { Framework } from "./types";

export const defaultTargetDir = "vite-project";

export const helpMessage = `\
Usage: create-template [OPTION]... [DIRECTORY]

Create a new Frontend project in JavaScript or TypeScript.
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        use a specific template

Available templates:
${green("vue-ts         basic")}`;

/** 工程化项目模版标签 */
export const engineeringTag = "engineering";

export const FRAMEWORKS: Framework[] = [
  {
    name: "vanilla",
    display: "Vanilla",
    color: yellow,
    variants: [
      {
        name: "vanilla-ts",
        display: "TypeScript",
        color: blue,
      },
      {
        name: `vanilla-ts-${engineeringTag}`,
        display: "TypeScript-Engineering",
        color: yellow,
      },
    ],
  },
  {
    name: "vue",
    display: "Vue",
    color: green,
    variants: [
      {
        name: "vue-ts",
        display: "TypeScript",
        color: blue,
      },
      {
        name: `vue-ts-${engineeringTag}`,
        display: "TypeScript-Engineering",
        color: yellow,
      },
    ],
  },
];

export const renameFiles: Record<string, string | undefined> = {
  _npmrc: ".npmrc",
  _nvmrc: ".nvmrc",
  _gitignore: ".gitignore",
  _gitattributes: ".gitattributes",
  "_biome.json": "biome.json",
  "_lefthook.yml": "lefthook.yml",
  "_package.json": "package.json",
  "_commitlint.config.ts": "commitlint.config.ts",
};
