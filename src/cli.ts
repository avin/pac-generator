#!/usr/bin/env node

import yargs from 'yargs/yargs';
import path from 'path';
import os from 'os';
import { PacGenerator, PacGeneratorOptions } from './index';
import fs from 'fs/promises';

type Config = PacGeneratorOptions & {
  outputPacFile?: string;
};

const ensureDirectoryExistence = async (filePath: string) => {
  const dirname = path.dirname(filePath);
  try {
    await fs.mkdir(dirname);
  } catch {}
};

void (async () => {
  const argv = await yargs(process.argv.slice(2)).options({
    config: { type: 'string', alias: 'c', default: path.resolve(os.homedir(), '.pac-maker.js') },
  }).argv;

  let config: Config;
  const configPath = path.resolve(argv.config);
  try {
    config = require(configPath) as Config;
  } catch (e) {
    console.error(`Error loading config file ${configPath}`);
    console.error(`Usage: pac-generator --config <path>`);
    process.exit(1);
  }

  const pacGenerator = new PacGenerator(config);
  const pacContent = await pacGenerator.generate();

  if (config.outputPacFile) {
    await ensureDirectoryExistence(config.outputPacFile);
    await fs.writeFile(config.outputPacFile, pacContent);

    console.info('Result:', path.resolve(config.outputPacFile));
  }

  console.log(pacContent);
})();
