const esbuild = require("esbuild");
const path = require("path");

const buildDev = async () => {
  const sourceCodeDirectory = path.resolve(__dirname, "..", "src");
  const buildDevDirectory = path.resolve(__dirname, "..", "build");

  await esbuild.build({
    absWorkingDir: sourceCodeDirectory,
    bundle: true,
    entryPoints: ["index.ts"],
    platform: "node",
    outdir: buildDevDirectory,
    minify: true,
  });

  console.log("[SUCCESS] Source has been built using esbuild");
};

buildDev();
