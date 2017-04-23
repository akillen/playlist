const id3 = require('id3-parser');
const path = require('path');
const fs = require('fs');
const workingDir = (process.argv[2] || __dirname);

var dir = fs.readdirSync(workingDir);
console.log(dir);

var files = [];
dir.forEach((file, inx, arr) => {
  fs.readFile(path.join(workingDir,file), (err, buff)=>{
    //push to array
    id3.parse(mp3).then(tag => { 
      console.log(`pushed ${tag.title}`);
      files.push(tag);
    });
  });
});

while(files.length < dir.length-1){

}
console.log(files);