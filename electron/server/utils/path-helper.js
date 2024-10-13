import { existsSync, mkdirSync } from 'fs';
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

export function checkIsDirExists(dir = "") {
  const directoryPath = dir || getRoot()
  if (!existsSync(directoryPath)) {
    try {
      mkdirSync(directoryPath, { recursive: true });
      console.log(`Directory created: ${directoryPath}`);
    } catch (err) {
      console.error(`Error creating directory: ${err.message}`);
    }
  } else {
    console.log(`Directory already exists: ${directoryPath}`);
  }
}