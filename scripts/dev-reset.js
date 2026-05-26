const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const nextDir = path.join(root, ".next");
const cacheDir = path.join(root, "node_modules", ".cache");

function killPort(port) {
  if (process.platform === "win32") {
    try {
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
      const pids = new Set();
      for (const line of out.split("\n")) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          console.log(`Processo ${pid} na porta ${port} encerrado.`);
        } catch {
          /* ignore */
        }
      }
    } catch {
      console.log(`Nenhum processo na porta ${port}.`);
    }
    return;
  }

  try {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: "ignore", shell: true });
  } catch {
    console.log(`Nenhum processo na porta ${port}.`);
  }
}

console.log("Encerrando processos nas portas 3000 e 3002…");
killPort(3000);
killPort(3002);

for (const dir of [nextDir, cacheDir]) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`${path.basename(dir)} removido.`);
  }
}

console.log("Iniciando next dev na porta 3000…");
console.log("(Se der erro 500, pare com Ctrl+C e rode npm run dev:reset de novo)\n");
execSync("npx next dev -p 3000", {
  stdio: "inherit",
  cwd: root,
  env: { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS || "" },
});
