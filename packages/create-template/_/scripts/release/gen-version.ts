import { writeFile } from "node:fs/promises";

import path from "node:path";
import consola from "consola";
import { mainRoot } from "../utils/paths";

export async function genVersion(version?: string) {
  if (version) {
    consola.info(`Version: ${version}`);
    await writeFile(
      path.resolve(mainRoot, "version.ts"),
      `export const version = "${version}";\n`,
    );
  }
}
