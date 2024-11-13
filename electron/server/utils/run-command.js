import { exec, spawn } from 'child_process';

export function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(new Error(`Command failed: ${stderr || error.message}`))
      else resolve(stdout)
    })
  })
}

export function runCommandInBg(command, args = []) {
  return new Promise((resolve, reject) => {
    spawn(command, args, {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    })

    resolve("")
  })
}
