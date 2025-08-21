import * as THREE from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js'

// Cache for GLTF load promises and resolved GLTFs
const gltfPromiseCache: Map<string, Promise<GLTF>> = new Map()
const gltfResolvedCache: Map<string, GLTF> = new Map()

// Global OSS bases (new first, then fallback old)
const NEW_OSS_BASE = 'https://tc-weshop.oss-cn-beijing.aliyuncs.com/lotter/'
const OLD_OSS_BASE = 'https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/lotter/'

// Build candidate URLs for a given GLTF path/URL; prefer NEW domain then OLD
const resolveOssCandidates = (url: string): string[] => {
  if (!url) return []
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    if (trimmed.startsWith(NEW_OSS_BASE)) return [trimmed, trimmed.replace(NEW_OSS_BASE, OLD_OSS_BASE)]
    if (trimmed.startsWith(OLD_OSS_BASE)) return [trimmed.replace(OLD_OSS_BASE, NEW_OSS_BASE), trimmed]
    return [trimmed]
  }
  const withoutLeading = trimmed.replace(/^\.\/+/, '').replace(/^\/+/, '')
  return [NEW_OSS_BASE + withoutLeading, OLD_OSS_BASE + withoutLeading]
}

let sharedLoader: GLTFLoader | null = null
const getLoader = (): GLTFLoader => {
  if (!sharedLoader) {
    sharedLoader = new GLTFLoader()
  }
  return sharedLoader
}

/**
 * Load a GLTF once per URL. Subsequent calls return the same in-memory parsed result without re-fetching.
 */
export const loadGLTFOnce = (url: string): Promise<GLTF> => {
  const candidates = resolveOssCandidates(url)
  for (const c of candidates) {
    if (gltfResolvedCache.has(c)) return Promise.resolve(gltfResolvedCache.get(c) as GLTF)
    if (gltfPromiseCache.has(c)) return gltfPromiseCache.get(c) as Promise<GLTF>
  }
  const loader = getLoader()
  const attempt = async (): Promise<GLTF> => {
    let lastErr: unknown = null
    for (const c of candidates) {
      try {
        const gltf = await loader.loadAsync(c)
        gltfResolvedCache.set(c, gltf)
        return gltf
      } catch (e) {
        lastErr = e
      }
    }
    throw lastErr || new Error('Failed to load GLTF from all candidates')
  }
  const key = candidates[0]
  const p = attempt()
  gltfPromiseCache.set(key, p)
  return p
}

/**
 * Get a deep-cloned THREE.Group for use in a scene, derived from the cached GLTF scene.
 * Materials are cloned to avoid cross-instance side effects when changing textures.
 */
export const getClonedModel = async (url: string): Promise<THREE.Group> => {
  const gltf = await loadGLTFOnce(url)
  // Use SkeletonUtils.clone for safety with skinned meshes; falls back for normal meshes
  const cloned = skeletonClone(gltf.scene) as THREE.Group

  // Ensure materials are not shared between pages/scenes
  cloned.traverse((child: any) => {
    if (child && child.isMesh) {
      if (Array.isArray(child.material)) {
        child.material = child.material.map((mat: THREE.Material) => mat && (mat as any).isMaterial ? (mat as THREE.Material).clone() : mat)
      } else if (child.material && (child.material as any).isMaterial) {
        child.material = (child.material as THREE.Material).clone()
      }
    }
  })

  return cloned
}

/**
 * Get a cloned GLTF-like object containing a deep-cloned scene and original animations.
 */
export const getClonedGLTF = async (
  url: string
): Promise<{ scene: THREE.Group; animations: THREE.AnimationClip[] }> => {
  const gltf = await loadGLTFOnce(url)
  const scene = await getClonedModel(url)
  return { scene, animations: gltf.animations || [] }
}

/**
 * Optionally allow preloading ahead of time.
 */
export const preloadGLTF = (url: string): void => {
  void loadGLTFOnce(url)
}

/**
 * Clear caches (not typically needed at runtime, but provided for completeness).
 */
export const clearGLTFCaches = (): void => {
  gltfPromiseCache.clear()
  gltfResolvedCache.clear()
}


