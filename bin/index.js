#!/usr/bin/env node
const yargs = require('yargs');
const findUp = require('find-up');
const fs = require('fs');
const svgicon2component = require('../src/index');

const rootDir = process.cwd();
const configPath = findUp.sync(['.svgiconrc', '.svgicon.json']);
const config = configPath
  ? JSON.parse(fs.readFileSync(configPath))
  : {
      src: `${rootDir}/icons/**.svg`,
      outDir: `${rootDir}/icon-components`,
      type: 'react',
    };

const { argv } = yargs
  .options({
    config: {
      alias: 'c',
      desc: 'Set the path of a config file',
      config: true,
    },
    src: {
      alias: 's',
      desc: 'Set the source of svg icon files',
      default: config.src,
    },
    'out-dir': {
      alias: 'o',
      desc: 'Set the output directory',
      default: config.outDir,
    },
    type: {
      alias: 't',
      desc: 'Set the transform component type',
      choices: ['react', 'vue', 'weapp'],
      default: config.type,
    },
  })
  .locale('en')
  .wrap(300);

if (argv.config) {
  const { src, outDir, type } = argv.config;

  argv.src = src || argv.src;
  argv.outDir = outDir || argv.outDir;
  argv.type = type || argv.type;
}

console.log(argv); // eslint-disable-line no-console

try {
  svgicon2component(argv);
} catch (err) {
  console.log(err); // eslint-disable-line no-console
}
