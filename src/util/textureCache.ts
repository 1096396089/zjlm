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
  if (textureResolvedCache.has(url)) {
    const t = textureResolvedCache.get(url) as THREE.Texture
    applyTextureConfig(t, cfg)
    return Promise.resolve(t)
  }
  if (texturePromiseCache.has(url)) {
    return texturePromiseCache.get(url) as Promise<THREE.Texture>
  }
  const loader = getLoader()
  const p = loader.loadAsync(url).then((tex) => {
    applyTextureConfig(tex, cfg)
    textureResolvedCache.set(url, tex)
    return tex
  })
  texturePromiseCache.set(url, p)
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


