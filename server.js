const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var fs = require('fs')
const MemoryFS = require('memory-fs');
const LinkFS = require('linkfs');
const UnionFS = require('unionfs');
const webpack = require('webpack');
const config = require('./webpack.request.config.js')

app.use(express.static('dist'));
app.use(bodyParser.json());


const linkfs = LinkFS.link;
const unionfs = UnionFS.ufs;
const compiler = webpack(config);

// const lfs = linkfs(fs, ['/node_modules', './node_modules'])
// listFiles(lfs,"/")
console.log("============================")
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/upload', function(request, response) {
  response.sendFile(__dirname + '/public/upload.html');
});

app.post('/api/upload', function(request, response) {
  const code = request.body.code
  const memfs =  new MemoryFS();

  memfs.writeFileSync("/index.js", code, {encoding: "utf8"});
  // const babel = fs.readFileSync('.babelrc', 'utf8');
  // memfs.writeFileSync("/.babelrc", babel, {encoding: "utf8"});
  const content = memfs.readFileSync('/index.js', 'utf8');
  console.log("Content: ", content);
  const vfs = unionfs.use(fs).use(memfs)

  compiler.inputFileSystem = vfs;
  compiler.outputFileSystem = memfs;

  compiler.run((err, stats) => {
    listFiles(memfs,"/")
    const info = stats.toJson();
    console.log(stats.toString())
    if (stats.hasErrors()) {
      console.log("Has errors: ")
      // console.error(JSON.stringify(info.errors, null, 4));
    } else if (stats.hasWarnings()) {
      console.log("Has warnings: ")
      console.warn(info.warnings);
    } else {
      console.log("Compiled successfully")
      const content = memfs.readFileSync('/user-bundle.js', 'utf8');
      fs.writeFileSync("./user-bundle.js", content);
    }
  });

  response.status(200).send();
});


const listener = app.listen('8080', function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

function listFiles(fs, path) {
  fs.readdir(path, function(err, items) {
    console.log("Files:")
    // console.log(items);
    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
    }
});
}