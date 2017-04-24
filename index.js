const playlist = require('./lib/playlist.js');

const dir = (process.argv[2] || __dirname);
const recursive = process.argv.indexOf('-r') > 0;

if (recursive) {
  playlist.makeRecursive(dir);
} else {
  console.log('Working directory: %s', dir);
  playlist.make(dir)
}