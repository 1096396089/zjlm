import * as THREE from 'three'

type TextureConfig = {
  flipY?: boolean
  // Use specific filter types to satisfy TS in strict mode
  minFilter?: THREE.MinificationTextureFilter
  magFilter?: THREE.MagnificationTextureFilter
  wrapS?: THREE.Wrapping
  wrapT?: THREE.Wrapping
  setSRGB?: boolean
}

// Global OSS base for static textures/models
const OSS_BASE = import.meta.env.PROD
  ? 'https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/'
  : '/oss/'

// Normalize any project-relative path to the OSS CDN
const resolveToOSS = (url: string): string => {
  if (!url) return url
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  // In dev, allow '/oss/...' to pass-through without duplication
  if (!import.meta.env.PROD && trimmed.startsWith('/oss/')) return trimmed

  // Remove leading './' or '/'
  const withoutLeading = trimmed.replace(/^\.\/+/, '').replace(/^\/+/, '')

  // If the path contains 'tietu/', keep from there to preserve folder structure
  const idx = withoutLeading.indexOf('tietu/')
  const relative = idx >= 0 ? withoutLeading.slice(idx) : withoutLeading

  if (!import.meta.env.PROD && relative.startsWith('oss/')) {
    return '/' + relative
  }

  return OSS_BASE + relative
}

const defaultConfig: Required<TextureConfig> = {
  flipY: false,
  minFilter: THREE.LinearMipmapLinearFilter as THREE.MinificationTextureFilter,
  magFilter: THREE.LinearFilter as THREE.MagnificationTextureFilter,
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping,
  setSRGB: true,
}

let sharedTextureLoader: THREE.TextureLoader | null = null
const getLoader = (): THREE.TextureLoader => {
  if (!sharedTextureLoader) sharedTextureLoader = new THREE.TextureLoader()
  return sharedTextureLoader
}

const texturePromiseCache: Map<string, Promise<THREE.Texture>> = new Map()
const textureResolvedCache: Map<string, THREE.Texture> = new Map()

const applyTextureConfig = (texture: THREE.Texture, cfg?: TextureConfig) => {
  const c = { ...defaultConfig, ...(cfg || {}) }
  // @ts-ignore - support three versions
  if (c.setSRGB) texture.colorSpace = (THREE as any).SRGBColorSpace || (THREE as any).sRGBEncoding
  texture.flipY = c.flipY
  texture.minFilter = c.minFilter
  texture.magFilter = c.magFilter
  texture.wrapS = c.wrapS
  texture.wrapT = c.wrapT
  texture.needsUpdate = true
}

export const loadTextureCached = (url: string, cfg?: TextureConfig): Promise<THREE.Texture> => {
  // 空 URL 直接拒绝，避免 404 泛滥
  if (!url) return Promise.reject(new Error('Empty texture url'))
  const ossUrl = resolveToOSS(url)
  if (textureResolvedCache.has(ossUrl)) {
    const t = textureResolvedCache.get(ossUrl) as THREE.Texture
    applyTextureConfig(t, cfg)
    return Promise.resolve(t)
  }
  if (texturePromiseCache.has(ossUrl)) {
    return texturePromiseCache.get(ossUrl) as Promise<THREE.Texture>
  }
  const loader = getLoader()
  const p = loader.loadAsync(ossUrl).then((tex) => {
    applyTextureConfig(tex, cfg)
    textureResolvedCache.set(ossUrl, tex)
    return tex
  })
  texturePromiseCache.set(ossUrl, p)
  return p
}

export const loadTextureFromCandidates = async (
  candidates: string[],
  cfg?: TextureConfig
): Promise<THREE.Texture> => {
  for (const url of candidates) {
    try {
      const tex = await loadTextureCached(url, cfg)
      return tex
    } catch {
      // try next
    }
  }
  throw new Error('All texture candidates failed to load')
}

export const clearTextureCaches = (): void => {
  texturePromiseCache.clear()
  textureResolvedCache.clear()
}


