import * as THREE from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js'

// Cache for GLTF load promises and resolved GLTFs
const gltfPromiseCache: Map<string, Promise<GLTF>> = new Map()
const gltfResolvedCache: Map<string, GLTF> = new Map()

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
  if (gltfResolvedCache.has(url)) {
    return Promise.resolve(gltfResolvedCache.get(url) as GLTF)
  }
  if (gltfPromiseCache.has(url)) {
    return gltfPromiseCache.get(url) as Promise<GLTF>
  }
  const loader = getLoader()
  const p = loader.loadAsync(url).then((gltf) => {
    gltfResolvedCache.set(url, gltf)
    return gltf
  })
  gltfPromiseCache.set(url, p)
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


