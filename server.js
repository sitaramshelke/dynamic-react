const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
const MemoryFS = require("memory-fs");
const LinkFS = require("linkfs");
const UnionFS = require("unionfs");
const webpack = require("webpack");
const config = require("./webpack.request.config.js");
let userBundle = require("./src/datastore.js");
const formatMessages = require('webpack-format-messages');
let test = userBundle;
app.use(express.static("dist"));
app.use(bodyParser.json());

const linkfs = LinkFS.link;
const unionfs = UnionFS.ufs;

console.log("============================");
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/scripts/:filename", function(request, response) {
  response.set("Content-Type", "application/javascript");
  response.send(test);
});

app.get("/upload", function(request, response) {
  response.sendFile(__dirname + "/public/upload.html");
});

app.post("/api/upload", function(request, response) {
  const code = request.body.code;
  const memfs = new MemoryFS();
  const compiler = webpack(config);
  const lfs = linkfs(fs, ["/node_modules", "./node_modules"]);

  console.log("writing index.js");
  listFiles(memfs, "/");
  memfs.writeFileSync("/index.js", code, { encoding: "utf8" });
  // const content = memfs.readFileSync('/index.js', 'utf8');
  // console.log("Content: ", content);
  const vfs = unionfs.use(lfs).use(memfs);

  compiler.inputFileSystem = vfs;
  compiler.outputFileSystem = memfs;

  compiler.run((err, stats) => {
    const info = stats.toJson();
    const messages = formatMessages(stats);
    let userErrors = [];
    debugger
    console.log("===============")
    if (stats.hasErrors()) {
      console.log("Has errors: ");
      // console.error(info.errors);
      const errors = stats.compilation.errors;
      for (let i = 0; i < errors.length; i++) {
        const error = errors[i].error;
        const userError = {...error}
        let message = error.message;
        userError.message = message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
        userErrors.push(userError);
        response.set("Content-Type", "application/json");
        response.status(200).send({errors: userErrors});
      }
      // console.log(userErrors);
    } else if (stats.hasWarnings()) {
      console.log("Has warnings: ");
      console.warn(info.warnings);
    } else {
      // console.log(stats)
      console.log("Compiled successfully");
      // listFiles(memfs,"/")
      const content = memfs.readFileSync("/user-bundle.js", "utf8");
      // fs.writeFileSync("./user-bundle.js", content);
      test = content;
      response.status(200).send({sucess: true});
    }
  });
});

const listener = app.listen("8080", function() {
  console.log("Your app is listening on port " + listener.address().port);
});

// listFiles(memfs,"/")
function listFiles(fs, path) {
  fs.readdir(path, function(err, items) {
    console.log("Files:");
    // console.log(items);
    for (var i = 0; i < items.length; i++) {
      console.log(items[i]);
    }
  });
}
