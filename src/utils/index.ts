import { customAlphabet } from 'nanoid';

export const delay = (ms: number = 1000) => new Promise(res => setTimeout(res, ms))

export function generateNumberArray(n: number): number[] {
  if (n <= 0) throw new Error("Input must be a positive integer.")
  return Array.from({ length: n }, (_, i) => i + 1)
}

export function isWithinTokenLimit(txt: string, limit: number) {
  let j = txt.split(/\W+/).filter(Boolean)
  return j.length <= limit
}

export function bytesToSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const units: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
  const exponent: number = Math.floor(Math.log(bytes) / Math.log(1024));
  const size: string = (bytes / Math.pow(1024, exponent)).toFixed(2);

  return size + " " + units[exponent];
}

export function genMongoId() {
  const hexAlphabet = '0123456789abcdef'
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')

  const randomPart = customAlphabet(hexAlphabet, 16)()
  return timestamp + randomPart
}

type item = {
  at: string
}
export function findLatest<T extends item>(items: T[]): T {
  return items.reduce((latest, current) => {
    return current.at > latest.at ? current : latest;
  }, items[0])
}

export function basicTokenizer(inputText: string): number {
  const words = inputText.split(/[.?!]+/)?.[0].split(/\s+/)
  if (!words) return 12

  const tokenPerWord = 1 / 4
  const additionalTokens = words.length * tokenPerWord

  const totalTokens = 12 + additionalTokens
  return parseFloat(totalTokens.toFixed(2))
}

export function getRandNumber(min: number = 20, max: number = 70): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
