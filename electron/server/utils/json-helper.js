import fs from 'fs/promises';

export async function ensureJSON(filePath, defaultContent = {}) {
  try {
    await fs.access(filePath)
  } catch {
    await writeJSON(filePath, defaultContent)
  }
}

export async function readJSON(filePath, defaultContent = {}) {
  try {
    await ensureJSON(filePath, defaultContent)
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    throw new Error(`Error reading JSON file at ${filePath}: ${err.message}`)
  }
}

export async function writeJSON(filePath, content = {}) {
  try {
    const jsonData = JSON.stringify(content, null, 2)
    await fs.writeFile(filePath, jsonData, 'utf8')
  } catch (err) {
    throw new Error(`Error writing to JSON file at ${filePath}: ${err.message}`)
  }
}

export async function updateJSONObj(filePath, newData) {
  try {
    const existingData = await readJSON(filePath)
    const updatedData = { ...existingData, ...newData }
    await writeJSON(filePath, updatedData)
  } catch (err) {
    throw new Error(`Error updating JSON file at ${filePath}: ${err.message}`)
  }
}

export async function updateJSONArr({ filePath, newData, isRemove = false, by = "id" }) {
  try {
    const existingData = await readJSON(filePath)
    let updatedData

    if (isRemove) {
      updatedData = existingData.filter(item => item[by] !== newData[by])

    } else {
      const isItemExists = existingData.some(item => item[by] === newData[by])
      updatedData = isItemExists
        ? existingData.map(item => (item[by] === newData[by] ? { ...item, ...newData } : item))
        : [...existingData, newData]
    }

    if (updatedData) {
      await writeJSON(filePath, updatedData)
    }

  } catch (err) {
    throw new Error(`Error updating JSON file at ${filePath}: ${err.message}`)
  }
}

export async function deleteJSON(filePath) {
  try {
    await fs.unlink(filePath)
  } catch (err) {
    throw new Error(`Error deleting JSON file at ${filePath}: ${err.message}`)
  }
}
