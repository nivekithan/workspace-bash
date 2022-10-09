import { readFileSync, writeFileSync } from "fs";
import { z } from "zod";

type EnvVarName =
  | "WORKSPACE_CONFIG"
  | "WORKSPACE_OUTPUT"
  | "WORKSPACE_ACTIVE"
  | "WORKSPACE_DEFAULT_ACTIVE";

const getEnvVar = (envVarName: EnvVarName) => {
  const err = tryGetEnvVar(envVarName);

  if (err instanceof Error) {
    throw err;
  }

  return err;
};

const tryGetEnvVar = (envVarName: EnvVarName) => {
  const envVar = process.env[envVarName];

  if (envVar === undefined) {
    return new Error(`Environment variable ${envVarName} is not set`);
  }

  return envVar;
};

const configPath = getEnvVar("WORKSPACE_CONFIG");

const configSchema = z.object({
  workspace: z.record(
    z.union([z.record(z.union([z.string(), z.undefined()])), z.undefined()])
  ),
  activeWorkspace: z.union([z.undefined(), z.string()]),
});

const tryConfig = configSchema.safeParse(
  JSON.parse(readFileSync(configPath, { encoding: "utf-8" }))
);

if (!tryConfig.success) {
  throw new Error(`Config on path ${configPath} is invalid`);
}

const config = tryConfig.data;

const commandLineArgument = process.argv.slice(2)[0] as string | undefined;
const isCommandLineArgumentPassed = commandLineArgument !== undefined;

if (isCommandLineArgumentPassed) {
  config.activeWorkspace = commandLineArgument;
  console.log(`New Active workspace ${config.activeWorkspace}`);
  const newConfigFileContent = JSON.stringify(config, null, 2);
  writeFileSync(configPath, newConfigFileContent, {
    encoding: "utf-8",
  });
}

const outputFileLines = ["#!/bin/bash", ""];

const activeWorkspaceName = (() => {
  const activeWorkspace = config.activeWorkspace;
  const isActiveWorkspacePresent = activeWorkspace !== undefined;

  if (isActiveWorkspacePresent) {
    return activeWorkspace;
  }

  return getEnvVar("WORKSPACE_DEFAULT_ACTIVE");
})();

const activeWorkspaceEnvMap = config.workspace[activeWorkspaceName];

if (activeWorkspaceEnvMap === undefined) {
  throw new Error(
    `Unable to find any workspace with name ${activeWorkspaceName} `
  );
}

for (const envVarName in activeWorkspaceEnvMap) {
  const envVarValue = activeWorkspaceEnvMap[envVarName];

  outputFileLines.push(`export ${envVarName}="${envVarValue}"`);
}

outputFileLines.push("");

const outputFileContent = outputFileLines.join("\n");
writeFileSync(getEnvVar("WORKSPACE_OUTPUT"), outputFileContent, {
  encoding: "utf-8",
});
