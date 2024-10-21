
function getOrigin(url: string) {
  try {
    const newUrl = new URL(url);
    return newUrl.origin;
  } catch (e) {
    return null;
  }
}

export function groupLinks(payload: string[]) {
  return payload.reduce((prev: any, curr) => {
    const origin = getOrigin(curr);
    if (!origin) return prev
    if (!prev[origin]) {
      prev[origin] = []
    }
    prev[origin].push(curr)

    return prev
  }, {})
}
