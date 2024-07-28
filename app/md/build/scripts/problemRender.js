const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const jsx = require("react-jsx");

const template = fs.readFileSync(
  path.resolve(__dirname, "../template/problem.js"),
  "utf-8"
);
const render = jsx.server(template, {
  filename: "problem.js",
  debug: true,
  raw: true,
});

const ROOT_DIR = path.resolve(__dirname, "../../");

function getPath(id, slug) {
  return path.resolve(ROOT_DIR, "./docs/problem", `${slug}.js`);
}

function problemRender(problem) {
  fse.outputFileSync(
    getPath(problem.id, problem.slug),
    "<!DOCTYPE html>" +
      render(problem, {
        html: true,
      })
  );
}

module.exports = problemRender;
