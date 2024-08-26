
export const executableLinks = {
  darwin: "https://production.haive.in:5000/download/nidum",
  linux: "https://production.haive.in:5000/download/nidum",
  win32: "https://production.haive.in:5000/download/nidum.exe",
}

export const executableNames = {
  darwin: "nidum",
  linux: "nidum",
  win32: "nidum.exe",
}

export const executabeCommand = {
  darwin: (fullPath) => `OLLAMA_HOST=127.0.0.1:11490 ${fullPath} serve`,
  linux: (fullPath) => `OLLAMA_HOST=127.0.0.1:11490 ${fullPath} serve`,
  win32: (fullPath) => `set OLLAMA_HOST=127.0.0.1:11490 && ${fullPath} serve`,
}
