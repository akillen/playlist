const playlist = require('./lib/playlist.js');
const commandLineArgs = require('command-line-args');

const optionDefs = [
  { name: 'recursive', alias: 'r', type: Boolean },
  { name: 'dir', type: String, defaultOption: true }
]

const options = commandLineArgs(optionDefs);

const dir = (options.dir || __dirname);
const recursive = options.recursive;

if (recursive) {
  playlist.makeRecursive(dir);
} else {
  playlist.make(dir)
}