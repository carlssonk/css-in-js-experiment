const { promises: fs } = require("fs");
// const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api", (req, res) => {
  const { sheet } = req.body;
  fs.writeFile("stylesheet.css", sheet);
  res.send("ok");
});

console.log(process.cwd() + "\\src");
fs.watch(process.cwd() + "/src", function (event, filename) {
  console.log("event is: " + event);
  if (filename) {
    console.log("filename provided: " + filename);
  } else {
    console.log("filename not provided");
  }
});

console.log(__dirname);
console.log(process.cwd());
// console.log(path.basename(__dirname) + "/" + path.basename("src"));

app.listen(1337, () => console.log("stilx server running on 1337..."));
