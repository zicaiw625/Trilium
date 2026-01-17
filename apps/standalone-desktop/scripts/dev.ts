import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

function main() {
    patchTemplate();
    console.warn("Make sure to run the Vite dev server in a separate terminal:");
    console.warn("  cd apps/client-standalone");
    console.warn("  pnpm dev");
    execSync("pnpm neu run", { stdio: "inherit" });
}

function patchTemplate() {
    const template = JSON.parse(readFileSync("neutralino.template.config.json", "utf-8"));
    template.url = "http://localhost:5173/";
    writeFileSync("neutralino.config.json", JSON.stringify(template, null, 2), "utf-8");
}

main();
