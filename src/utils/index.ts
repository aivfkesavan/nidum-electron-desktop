
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
