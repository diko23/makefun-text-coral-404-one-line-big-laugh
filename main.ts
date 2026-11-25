import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ENTRY_LINE: string =
  "I listed my landlord as my emergency contact; nobody else is half as invested in me surviving until the first.";
const MAX_ENTRY_CHARS: number = 200;

function resolveOutputPath(env: NodeJS.ProcessEnv): string {
  const configuredDir: string | undefined = env.MAKEFUN_OUTPUT_DIR;
  const outputDir: string =
    configuredDir !== undefined && configuredDir.trim().length > 0
      ? configuredDir.trim()
      : "/output";
  return join(outputDir, "entry.txt");
}

function validateEntryLine(text: string): string {
  const normalized: string = text.trim();
  if (
    normalized.length === 0 ||
    normalized.length > MAX_ENTRY_CHARS ||
    normalized.includes("\n") ||
    normalized.includes("\r")
  ) {
    throw new Error(`Entry line violates gate constraints (length=${normalized.length})`);
  }
  return normalized;
}

function writeEntryFile(outputPath: string, text: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, text, { encoding: "utf8" });
  chmodSync(outputPath, 0o644);
}

try {
  const line: string = validateEntryLine(ENTRY_LINE);
  const outputPath: string = resolveOutputPath(process.env);
  writeEntryFile(outputPath, line);
} catch (error: unknown) {
  const message: string = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
