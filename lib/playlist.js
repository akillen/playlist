const id3 = require('id3-parser');
const path = require('path');
const fs = require('fs');


var make = function (workingDir) {

  var dir = fs.readdirSync(workingDir);
  var songs = dir.filter(el => { return path.extname(el) == '.mp3'; });
  if(songs.length <= 0){
    return; //no songs here!
  }
  console.log('Found: %s songs.', songs.length);
  var files = [];
  dir.forEach((file, inx, arr) => {
    fs.readFile(path.join(workingDir, file), (err, mp3) => {
      if (err) {
        console.log(err);
      }

      id3.parse(mp3).then(tag => {
        if (typeof tag != 'undefined' && tag.version) {
          tag.filename = file;
          files.push(tag);
        }

        if (files.length == songs.length) {
          files.sort(trackCompare);
          makeM3u(files.map(file => {
            return file.filename;
          }), dir, workingDir);
        }
      }).catch(err => {
        console.log(err);
      });
    });
  });
}

exports.make = make;

var makeRecursive = function (workingDir) {
  console.log('makeRecursive in %s', workingDir);
  fs.readdir(workingDir, (err, files) => {
    files.forEach(file => {
      if (fs.stat(path.join(workingDir, file), (err, stats) => {
        if (err) {
          console.error(err);
        } else if (stats.isDirectory()) {
          makeRecursive(path.join(workingDir, file));
        }
      }));
    });
  });
  make(workingDir);
}

exports.makeRecursive = makeRecursive;

function makeM3u(files, dir, workingDir) {
  if (dir.findIndex(isM3u) >= 0) {
    console.warn('m3u file already exists in this location');
  } else {
    console.log(workingDir);
    var filename = workingDir.split('/').slice(-1)[0];
    console.log(filename);
    fs.writeFile(path.join(workingDir, filename + '.m3u'), files.join('\n'),
      err => {
        if (err) {
          console.log(err);
        } else {
          console.log('Playlist written');
        }
      });
  }
}

function isM3u(filename) {
  return path.extname(filename) == '.m3u';
}

function trackCompare(a, b) {
  let atrack = Number(a.track.split('/')[0]);
  let btrack = Number(b.track.split('/')[0]);

  if (atrack < btrack)
    return -1;
  if (atrack == btrack)
    return 0;
  if (atrack > btrack)
    return 1;
}
