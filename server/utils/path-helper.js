const os = require('os');
const path = require('path');

const homeDirectory = os.homedir();

const mainPath = ".nidum"

function getRoot() {
  return path.join(homeDirectory, mainPath)
}

function createPath(newPath = []) {
  return path.join(getRoot(), ...newPath)
}

function getRagPath(newPath = "") {
  return createPath([newPath, "index-store"])
}

module.exports = {
  getRoot,
  createPath,
  getRagPath,
}