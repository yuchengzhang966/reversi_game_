module.exports = (io) => {
  const fs = require("fs");
  const path = require("path");
  const eventsPath = path.resolve(__dirname);
  console.log(eventsPath);
  fs.readdir(eventsPath, (err, files) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    files.map((fileName) => {
      if (fileName !== "index.js") {
        console.log(path.resolve(__dirname, fileName));
        module.exports[fileName] = require(path.resolve(__dirname, fileName));
      }
    });
  });
};
