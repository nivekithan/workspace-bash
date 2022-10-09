const esbuild = require("esbuild");
const path = require("path");

const buildDev = async () => {
  const sourceCodeDirectory = path.resolve(__dirname, "..", "src");
  const buildDevDirectory = path.resolve(__dirname, "..", "buildDev");

  await esbuild.build({
    absWorkingDir: sourceCodeDirectory,
    bundle: true,
    watch: {
      onRebuild(err, res) {
        if (err) {
          console.log(`[ERROR] ESBuild failed on rebuilding \n${err}`);
          return;
        }

        console.log(`[SUCCESS] Sucessfull Rebuild`);
      },
    },
    entryPoints: ["index.ts"],
    platform: "node",
    outdir: buildDevDirectory,
  });

  console.log("[SUCCESS] Built and watching source code for further changes");
};

buildDev();
