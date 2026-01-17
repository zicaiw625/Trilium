import BuildHelper from "../../../scripts/build-utils";

const build = new BuildHelper("apps/standalone-desktop");

async function main() {
    build.triggerBuildAndCopyTo("apps/client-standalone", "../resources");
}

main();
