#!/usr/bin/env node

const optimist = require('optimist');

const FileLoader = require('./file-loader');
const Simulation = require('./simulation');

const SIMULATION_TIME = 2500; // ms

const log = console.log;
const noop = () => void 0;

async function main() {
  const fileLoader = new FileLoader();
  const filePaths = Array.from(optimist.argv._);

  console.log('Generating tests for:', filePaths);
  console.log('');

  const files = await fileLoader.load(filePaths);
  const sim = new Simulation(filePaths, files, fileLoader);
  await sim.readyPromise;

  console.log('pre run: global.lineCounter', global.lineCounter);
  console.log = noop;
  const results = await sim.run(SIMULATION_TIME);
  await fileLoader.save(results);
  // console.log('run: global.lineCounter', global.lineCounter);
  // console.log('run: this.lineCounter.stats', this.lineCounter.stats);

  setTimeout(function() {
    console.log = log;
    console.log('Test generation finished');
    console.log('global.lineCounter', global.lineCounter);
  }, 100);
}

main();
