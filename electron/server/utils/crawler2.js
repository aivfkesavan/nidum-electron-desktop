import { chromium } from 'playwright';
import fs from 'fs/promises';

import { createPath } from './path-helper';
import logger from './logger';

function normalizeUrl(url) {
  try {
    const normalizedUrl = new URL(url)
    if (normalizedUrl.pathname !== '/') {
      normalizedUrl.pathname = normalizedUrl.pathname.replace(/\/$/, '')
    }
    return normalizedUrl.href
  } catch (error) {
    console.error(`Invalid URL encountered: ${url}`)
    return url
  }
}

function convertUrlsToFilenames(url) {
  const urlObject = new URL(url)

  let pathname = urlObject.pathname.replace(/^\/|\/$/g, '')

  let filename = pathname.replace(/\//g, '_')

  return filename
}

async function extractSublinks(page, url) {
  let sublinks = []

  try {
    const linkElements = await page.locator('a').all()
    const allLinks = await Promise.all(linkElements.map(el => el.getAttribute('href')))

    sublinks = allLinks
      .filter(link => link && (link.startsWith('/') || link.startsWith(url)))
      .map(link => {
        if (link.startsWith('/')) return new URL(link, url).href
        return link
      })
      .map(normalizeUrl)

    sublinks = [...new Set(sublinks)]

  } catch (error) {
    console.error(`Error extracting sublinks from ${url}: ${error.message}`)
  }

  return sublinks
}

export async function getSublinks({ url, excludedLinks = [], maxRequestsPerCrawl = 5 }) {
  try {
    const visitedUrls = new Set()
    const urlsToVisit = [normalizeUrl(url)]
    const excludedNormalized = new Set(excludedLinks.map(normalizeUrl))

    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    const allSublinks = new Set()
    let requestCount = 0

    while (urlsToVisit.length > 0 && requestCount < maxRequestsPerCrawl) {
      const currentUrl = urlsToVisit.shift()
      const normalizedUrl = normalizeUrl(currentUrl)

      if (visitedUrls.has(normalizedUrl) || excludedNormalized.has(normalizedUrl)) continue
      visitedUrls.add(normalizedUrl)

      try {
        await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded' })
        requestCount++;

        const sublinks = await extractSublinks(page, normalizedUrl)
        sublinks.forEach(link => {
          if (!visitedUrls.has(normalizeUrl(link)) && !excludedNormalized.has(normalizeUrl(link))) {
            allSublinks.add(link)
          }
        })

        if (requestCount < maxRequestsPerCrawl) {
          urlsToVisit.push(...sublinks.filter(link => !visitedUrls.has(normalizeUrl(link)) && !excludedNormalized.has(normalizeUrl(link))))
        }

      } catch (error) {
        console.error(`Failed to crawl ${normalizedUrl}: ${error.message}`)
      }
    }

    await browser.close()

    const final = [...allSublinks]
    return final

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    console.log(error)
    return []
  }
}

export async function crawlWebsite({ url, maxRequestsPerCrawl = 50, folderName }) {
  try {
    const visitedUrls = new Set()
    const urlsToVisit = [normalizeUrl(url)]

    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    await fs.mkdir(createPath([folderName]), { recursive: true })

    while (urlsToVisit.length > 0 && visitedUrls.size < maxRequestsPerCrawl) {
      const currentUrl = urlsToVisit.shift()
      const normalizedUrl = normalizeUrl(currentUrl)

      if (visitedUrls.has(normalizedUrl)) continue
      visitedUrls.add(normalizedUrl)

      try {
        await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded' })
        const content = await page.innerText('body')

        const base = normalizedUrl.replace(url, "").replace(/^\/|\/$/g, "").replaceAll("/", "_") || "root";

        const resultPath = createPath([folderName, `${base}.txt`])
        await fs.writeFile(resultPath, JSON.stringify(content, null, 2))

        if (visitedUrls.size < maxRequestsPerCrawl && urlsToVisit.length < maxRequestsPerCrawl) {
          const sublinks = await extractSublinks(page, normalizedUrl)
          urlsToVisit.push(...sublinks.filter(link => !visitedUrls.has(normalizeUrl(link))))
        }
      } catch (error) {
        console.error(`Failed to crawl ${normalizedUrl}: ${error.message}`)
      }
    }

    await browser.close()

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    console.log(error)
  }
}


export async function crawlWebsite2({ urls, folderName }) {
  try {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    await fs.mkdir(createPath([folderName]), { recursive: true })
    await fs.mkdir(createPath(["crawled"]), { recursive: true })

    for await (const url of urls) {
      const normalizedUrl = normalizeUrl(url)
      await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded' })
      const content = await page.innerText('body')

      const base = convertUrlsToFilenames(url)

      const resultPath = createPath([folderName, `${base}.txt`])
      await fs.writeFile(resultPath, JSON.stringify(content, null, 2))
    }

    await browser.close()
    const filePath = createPath(["crawled", `${folderName}.json`])
    const content = [...urls]

    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      let data = JSON.parse(fileData)
      if (data && Array.isArray(data)) {
        content.push(...data)
      }

    } catch (err) {
      console.log("file is not exists", err)
    }

    let finalContents = [...new Set(content)]
    await fs.writeFile(filePath, JSON.stringify(finalContents, null, 2), 'utf8');

  } catch (error) {
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    console.log(error)
  }
}
