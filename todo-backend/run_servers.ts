import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const backendCmd = [
  "deno",
  "run",
  "--allow-net",
  "--allow-read",
  "--allow-env",
  "main.ts",
];

const frontendCmd = [
  "npm",
  "run",
  "dev",
];

function runCommand(cmd: string[], name: string, cwd?: string) {
  const process = Deno.run({
    cmd,
    cwd,
    stdout: "piped",
    stderr: "piped",
  });

  (async () => {
    for await (const line of readLines(process.stdout)) {
      console.log(`[${name}] ${line}`);
    }
  })();

  (async () => {
    for await (const line of readLines(process.stderr)) {
      console.error(`[${name} ERROR] ${line}`);
    }
  })();

  return process;
}

console.log("🚀 Starting backend and frontend servers...\n");

const backendProcess = runCommand(backendCmd, "BACKEND");
const frontendProcess = runCommand(frontendCmd, "FRONTEND", "../todo-frontend");

await Promise.all([
  backendProcess.status(),
  frontendProcess.status(),
]);