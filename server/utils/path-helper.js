const path = require('path');
const os = require('os');

const homeDirectory = os.homedir()

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

function getWhisperPath() {
  return createPath(["whisper"])
}

module.exports = {
  getRoot,
  createPath,
  getRagPath,
  getWhisperPath,
}