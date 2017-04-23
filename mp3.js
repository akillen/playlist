const id3 = require('id3-parser');
const path = require('path');
const fs = require('fs');
const workingDir = (process.argv[2] || __dirname);

var dir = fs.readdirSync(workingDir);

console.log(dir);
var files = [];
dir.forEach((file, inx, arr) => {
  fs.readFile(path.join(workingDir, file), (err, mp3) => {
    if (err)
      console.log(err);
    //push to array
    id3.parse(mp3).then(tag => {
      if (typeof tag != 'undefined' && tag.version) {
        tag.filename = file;
        files.push(tag);
      }
      if (files.length == dir.length - 1) {
        files.sort((a, b) => {
          let atrack = Number(a.track.split('/')[0]);
          let btrack = Number(b.track.split('/')[0]);

          if (atrack < btrack)
            return -1;
          if (atrack == btrack)
            return 0;
          if (atrack > btrack)
            return 1;
        });
        console.log(files);
        makeM3u(files.map(file => {
          return file.filename;
        }));
      }
    }).catch(err => {
      console.log(err);
    });
  });
});

function makeM3u(files) {
  console.log(files);
  fs.writeFile(workingDir.substr(0, workingDir.length - 1) + '.m3u', files.join('\n'), err => { console.log(err); });
}