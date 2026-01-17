import { execSync } from "child_process";
import BuildHelper from "../../../scripts/build-utils";

const build = new BuildHelper("apps/standalone-desktop");

async function main() {
    build.triggerBuildAndCopyTo("apps/client-standalone", "../resources");
    execSync("pnpm neu update", { cwd: build.projectDir, stdio: "inherit" });
    execSync("pnpm neu build", { cwd: build.projectDir, stdio: "inherit" });
}

main();
