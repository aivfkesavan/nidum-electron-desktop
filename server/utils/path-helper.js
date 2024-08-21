import path from 'path';
import os from 'os';

const homeDirectory = os.homedir()

const mainPath = ".nidum"

export function getRoot() {
  return path.join(homeDirectory, mainPath)
}

export function createPath(newPath = []) {
  return path.join(getRoot(), ...newPath)
}

export function getRagPath(newPath = "") {
  return createPath([newPath, "index-store"])
}

export function getWhisperPath() {
  return createPath(["whisper"])
}
