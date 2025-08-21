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

// Global OSS bases (new first, then fallback old)
const NEW_OSS_BASE = 'https://tc-weshop.oss-cn-beijing.aliyuncs.com/lotter/'
const OLD_OSS_BASE = 'https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/lotter/'

// Build candidate URLs for a given url or path, preferring the NEW domain and falling back to OLD
const resolveOssCandidates = (url: string): string[] => {
  if (!url) return []
  const trimmed = url.trim()

  // absolute url → return [new-equivalent, original-if-old]
  if (/^https?:\/\//i.test(trimmed)) {
    // if already new-domain, add old-domain fallback
    if (trimmed.startsWith(NEW_OSS_BASE)) {
      return [trimmed, trimmed.replace(NEW_OSS_BASE, OLD_OSS_BASE)]
    }
    // if old-domain absolute, prefer new first then old
    if (trimmed.startsWith(OLD_OSS_BASE)) {
      return [trimmed.replace(OLD_OSS_BASE, NEW_OSS_BASE), trimmed]
    }
    return [trimmed]
  }

  // relative path → try new then old
  const withoutLeading = trimmed.replace(/^\.\/+/, '').replace(/^\/+/, '')

  // If the path contains 'tietu/', keep from there to preserve folder structure
  const idx = withoutLeading.indexOf('tietu/')
  const relative = idx >= 0 ? withoutLeading.slice(idx) : withoutLeading

  return [NEW_OSS_BASE + relative, OLD_OSS_BASE + relative]
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
  if (!sharedTextureLoader) {
    sharedTextureLoader = new THREE.TextureLoader()
    // Ensure cross-origin images are allowed if server returns proper CORS headers
    // @ts-ignore
    if (typeof (sharedTextureLoader as any).setCrossOrigin === 'function') {
      ;(sharedTextureLoader as any).setCrossOrigin('anonymous')
    } else {
      // Fallback: set on the loader's internal image element factory (best-effort)
      try {
        (THREE as any).LoaderUtils && ((THREE as any).LoaderUtils.crossOrigin = 'anonymous')
      } catch {}
    }
  }
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
  const candidates = resolveOssCandidates(url)

  // return from cache if any candidate already cached
  for (const c of candidates) {
    if (textureResolvedCache.has(c)) {
      const t = textureResolvedCache.get(c) as THREE.Texture
      applyTextureConfig(t, cfg)
      return Promise.resolve(t)
    }
    if (texturePromiseCache.has(c)) {
      return texturePromiseCache.get(c) as Promise<THREE.Texture>
    }
  }

  const loader = getLoader()
  const attempt = async (): Promise<THREE.Texture> => {
    let lastErr: unknown = null
    for (const c of candidates) {
      try {
        const tex = await loader.loadAsync(c)
        applyTextureConfig(tex, cfg)
        textureResolvedCache.set(c, tex)
        return tex
      } catch (e) {
        lastErr = e
      }
    }
    throw lastErr || new Error('Failed to load texture from all candidates')
  }

  const key = candidates[0]
  const p = attempt()
  texturePromiseCache.set(key, p)
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


