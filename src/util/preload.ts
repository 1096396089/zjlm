// Preload key GLTFs and frequently-used textures as early as possible
// to achieve seamless usage across pages.

import { preloadGLTF } from '@/util/gltfCache'

const withBase = (path: string): string => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '')
  const cleaned = path.replace(/^\/+/, '')
  return `${base}/${cleaned}`
}

const unique = (arr: string[]): string[] => Array.from(new Set(arr.filter(Boolean)))

const preloadImages = (urls: string[]): void => {
  unique(urls).forEach((url) => {
    try {
      const img = new Image()
      img.decoding = 'async'
      img.loading = 'eager'
      img.src = url
      // Ignore load errors; goal is best-effort warm cache
    } catch {
      // noop
    }
  })
}

const getCandidateTextureUrls = (): string[] => {
  const publicDefaults = [
    withBase('tietu/xiedai.png'),
    withBase('tietu/xiedi.png'),
    withBase('tietu/xian.png'),
    withBase('tietu/xian2.png'),
    withBase('tietu/xiedian.png'),
  ]

  // Default A/B textures commonly used initially (best-effort)
  const abDefaults = [
    withBase('tietu/A/AC.png'),
    withBase('tietu/B/BC.png'),
  ]

  // Public A/B numbered selections (exist in public/)
  const aChoices = Array.from({ length: 6 }, (_, i) => withBase(`tietu/A/A${i + 1}.png`))
  const bChoices = Array.from({ length: 6 }, (_, i) => withBase(`tietu/B/B${i + 1}.png`))

  return unique([...publicDefaults, ...abDefaults, ...aChoices, ...bChoices])
}

const preloadGltfs = (): void => {
  // Warm the shared GLTF cache so first scene mount is instant
  ;['xie.gltf', 'xie1.gltf', 'xie13.gltf']
    .map((name) => withBase(name))
    .forEach((url) => {
      try {
        preloadGLTF(url)
      } catch {
        // Ignore; continue preloading others
      }
    })
}

export const preloadOnAppStart = (): void => {
  const run = () => {
    // 1) GLTFs via GLTFLoader (also fills our in-memory cache)
    preloadGltfs()
    // 2) Textures via <img> to populate the browser HTTP cache
    preloadImages(getCandidateTextureUrls())
  }

  // Do not block initial render; schedule when the browser is idle
  if (typeof (window as any).requestIdleCallback === 'function') {
    ;(window as any).requestIdleCallback(run, { timeout: 1500 })
  } else {
    setTimeout(run, 0)
  }
}


