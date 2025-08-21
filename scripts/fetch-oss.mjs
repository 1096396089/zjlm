#!/usr/bin/env node
// Scan code for OSS references, expand known dynamic sets, and download them locally

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const workspaceRoot = path.resolve(__dirname, '..')

const OSS_BASE = 'https://tc-weshop.oss-cn-beijing.aliyuncs.com/lotter'
const OUTPUT_DIR = path.resolve(workspaceRoot, 'oss_bundle')

const SOURCE_DIRS = [
  path.resolve(workspaceRoot, 'src'),
  path.resolve(workspaceRoot, 'public'),
  path.resolve(workspaceRoot),
]

/**
 * Utilities
 */
const ensureDir = async (dirPath) => {
  await fs.promises.mkdir(dirPath, { recursive: true })
}

const listFilesRecursively = async (dir) => {
  const out = []
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name.startsWith('.')) continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      // skip node_modules and build outputs
      if (/node_modules|dist|.git|.output|.cache|oss_bundle/.test(full)) continue
      out.push(...(await listFilesRecursively(full)))
    } else {
      out.push(full)
    }
  }
  return out
}

const readTextFileSafe = async (p) => {
  try {
    return await fs.promises.readFile(p, 'utf8')
  } catch {
    return ''
  }
}

const unique = (arr) => Array.from(new Set(arr))

const normalizeRel = (rel) => {
  if (!rel) return rel
  const cleaned = rel.replace(/^\/+/, '').replace(/^\.\/+/, '')
  return cleaned
}

const toLocalPathFromUrl = (fullUrl) => {
  // strip base
  const rel = fullUrl.replace(/^https?:\/\/[^/]+\//i, '')
  // Keep URL-encoded names as-is to avoid unicode/encoding pitfalls on Windows
  return path.join(OUTPUT_DIR, rel)
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Collectors
 */
const collectDirectOssUrls = async () => {
  const files = (
    await Promise.all(
      SOURCE_DIRS.map((d) => listFilesRecursively(d).catch(() => []))
    )
  ).flat()

  const urls = []
  const urlRe = new RegExp(
    String.raw`https?:\/\/steppy-dev\.oss-cn-guangzhou\.aliyuncs\.com[^\s"'\)<>]+`,
    'g'
  )
  for (const f of files) {
    const txt = await readTextFileSafe(f)
    if (!txt) continue
    const m = txt.match(urlRe)
    if (m) urls.push(...m)
  }
  return urls
}

const collectWithBaseArgs = async () => {
  const files = (
    await Promise.all(
      SOURCE_DIRS.map((d) => listFilesRecursively(d).catch(() => []))
    )
  ).flat()
  const rels = []
  const re = /withBase\(['"]([^'"\)]+)['"]\)/g
  for (const f of files) {
    const txt = await readTextFileSafe(f)
    if (!txt) continue
    let m
    while ((m = re.exec(txt))) {
      rels.push(m[1])
    }
  }
  return rels.map((r) => `${OSS_BASE}/${normalizeRel(r)}`)
}

const collectKnownTietuDefaults = () => {
  const defaults = [
    'tietu/xiedai.png',
    'tietu/xiedi.png',
    'tietu/xian.png',
    'tietu/xian2.png',
    'tietu/xiedian.png',
  ]
  return defaults.map((r) => `${OSS_BASE}/${r}`)
}

const collectATexturesFromLocal = async () => {
  const dir = path.resolve(workspaceRoot, 'src/assets/tietu/A')
  try {
    const entries = await fs.promises.readdir(dir)
    return entries
      .filter((n) => /\.png$/i.test(n))
      .map((n) => `${OSS_BASE}/tietu/A/${n}`)
  } catch {
    return []
  }
}

const collectBTexturesFromLocal = async () => {
  const dir = path.resolve(workspaceRoot, 'src/assets/tietu/B')
  try {
    const entries = await fs.promises.readdir(dir)
    return entries
      .filter((n) => /\.png$/i.test(n))
      .map((n) => `${OSS_BASE}/tietu/B/${n}`)
  } catch {
    return []
  }
}

const collectCarouselImages = () => {
  const imgs = [1, 2, 3, 4, 5].map(
    (i) => `${OSS_BASE}/xiezipng/${i}.png`
  )
  return imgs
}

const collectXieGltf = () => [`${OSS_BASE}/xie.gltf`]

const headOk = async (url) => {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

const collectIntroAnimationFrames = async () => {
  // Try a safe range and include only existing files
  const maxProbe = 140
  const base = `${OSS_BASE}/animition/%E5%BC%80%E5%A4%B4%E5%8A%A8%E7%94%BB_`
  const urls = []
  const pad = (n) => String(n).padStart(5, '0')
  // Probe concurrently in small batches to avoid hammering
  const batchSize = 16
  for (let start = 0; start < maxProbe; start += batchSize) {
    const tasks = []
    for (let i = start; i < Math.min(maxProbe, start + batchSize); i++) {
      const u = `${base}${pad(i)}.png`
      tasks.push(
        headOk(u).then((ok) => {
          if (ok) urls.push(u)
        })
      )
    }
    await Promise.all(tasks)
    // Small delay to be polite
    await delay(50)
  }
  return urls
}

/**
 * Downloader with concurrency
 */
const downloadAll = async (urls) => {
  const manifest = []
  let completed = 0
  const total = urls.length
  const concurrency = 8
  const queue = urls.slice()

  const work = async () => {
    for (;;) {
      const url = queue.shift()
      if (!url) return
      const local = toLocalPathFromUrl(url)
      try {
        await ensureDir(path.dirname(local))
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const buf = Buffer.from(await res.arrayBuffer())
        await fs.promises.writeFile(local, buf)
        manifest.push({ url, local: path.relative(workspaceRoot, local), size: buf.length })
      } catch (e) {
        manifest.push({ url, error: String(e) })
      } finally {
        completed += 1
        if (completed % 10 === 0 || completed === total) {
          process.stdout.write(`\rDownloaded ${completed}/${total} `.padEnd(40))
        }
      }
    }
  }

  await ensureDir(OUTPUT_DIR)
  await Promise.all(Array.from({ length: concurrency }, work))
  process.stdout.write('\n')
  await fs.promises.writeFile(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), total: manifest.length, items: manifest }, null, 2),
    'utf8'
  )
}

async function main() {
  console.log('Scanning project for OSS assets...')
  const [direct, withBase, aTex, bTex, defaults, carousel, xie] = await Promise.all([
    collectDirectOssUrls(),
    collectWithBaseArgs(),
    collectATexturesFromLocal(),
    collectBTexturesFromLocal(),
    Promise.resolve(collectKnownTietuDefaults()),
    Promise.resolve(collectCarouselImages()),
    Promise.resolve(collectXieGltf()),
  ])

  const introFrames = await collectIntroAnimationFrames()

  let all = [
    ...direct,
    ...withBase,
    ...aTex,
    ...bTex,
    ...defaults,
    ...carousel,
    ...xie,
    ...introFrames,
  ]

  // Filter to this bucket only, normalize and dedupe
  all = unique(
    all
      .filter((u) => u && u.startsWith(OSS_BASE))
      .map((u) => u.replace(/\+$/, ''))
  )

  if (all.length === 0) {
    console.log('No OSS URLs found.')
    return
  }

  console.log(`Found ${all.length} OSS files. Starting download to: ${path.relative(workspaceRoot, OUTPUT_DIR)}`)
  await downloadAll(all)
  console.log('Done. See manifest at oss_bundle/manifest.json')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


