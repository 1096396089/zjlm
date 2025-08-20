<template>
  <div class="w-screen h-screen flex flex-col">
    <div ref="containerRef" class="w-full h-[45%]"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import * as THREE from 'three'
import { getClonedGLTF } from '@/util/gltfCache'
import { loadTextureFromCandidates } from '@/util/textureCache'

const containerRef = ref<HTMLElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId = 0
let shoeModel: THREE.Group | null = null
const textureCache: Record<string, THREE.Texture> = {}

// 基础路径适配（支持子路径部署，与 three.vue 保持一致）
const withBase = (path: string): string => {
  const base = 'https://steppy-dev.oss-cn-guangzhou.aliyuncs.com/lotter'
  const cleaned = path.replace(/^\/+/, '')
  return `${base}/${cleaned}`
}

// 从路由中获取两个区域参数（优先 params，其次 query）。
const route = useRoute()

const pickFirst = (v: unknown): string | undefined => {
  if (typeof v === 'string') return v
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string') return v[0]
  return undefined
}

const resolveAreaParam = (key: 'a' | 'b', fallback: string): string => {
  const fromParams = pickFirst((route.params as any)[key])
  const fromQuery = pickFirst(route.query[key])
  return (fromParams || fromQuery || fallback) as string
}

const aParam = ref<string>(resolveAreaParam('a', 'AC.png'))
const bParam = ref<string>(resolveAreaParam('b', 'BC.png'))

const getTexturePath = (area: 'A' | 'B', filename: string): string => {
  if (!filename) return ''
  // 若传入的是绝对/相对路径，则原样返回
  if (filename.startsWith('http') || filename.startsWith('/') || filename.startsWith('./')) {
    // 同时适配 withBase 版本
    return filename
  }
  // 确保带扩展名
  const finalName = filename.toLowerCase().endsWith('.png') ? filename : `${filename}.png`
  return withBase(`tietu/${area}/${finalName}`)
}

const applyTextureToArea = (area: 'A' | 'B', filename: string) => {
  if (!shoeModel || !filename) return

  const path = getTexturePath(area, filename)

  const tryApply = (texture: THREE.Texture) => {
    // @ts-ignore 兼容不同 three 版本
    texture.colorSpace = (THREE as any).SRGBColorSpace || (THREE as any).sRGBEncoding
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.flipY = false

    shoeModel!.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name.trim() === area) {
          if (Array.isArray(child.material)) {
            child.material = child.material.map((m) => {
              if (m instanceof THREE.MeshStandardMaterial) {
                const nm = m.clone()
                nm.map = texture
                nm.needsUpdate = true
                return nm
              }
              return m
            })
          } else if (child.material instanceof THREE.MeshStandardMaterial) {
            const nm = child.material.clone()
            nm.map = texture
            nm.needsUpdate = true
            child.material = nm
          }
        }
      }
    })
  }

  const candidates: string[] = Array.from(new Set([
    path,
    withBase(path.replace(/^\//, '')),
    '/' + path.replace(/^\//, ''),
    path.replace(/^\//, ''),
    './' + path.replace(/^\//, ''),
  ]))

  loadTextureFromCandidates(candidates)
    .then((texture) => {
      // 缓存并应用
      const key = candidates[0]
      if (key) textureCache[key] = texture
      tryApply(texture)
    })
    .catch(() => {
      // 忽略，维持当前贴图
    })
}

// 关键词匹配贴图（用于 logo/xiedi/xian/xian2/xiedian 等初始贴图）
const applyTextureToMeshesByKeywords = (keywords: string[], texturePath: string) => {
  if (!shoeModel) return
  const tryApply = (texture: THREE.Texture) => {
    // @ts-ignore
    texture.colorSpace = (THREE as any).SRGBColorSpace || (THREE as any).sRGBEncoding
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.flipY = false

    const lowers = keywords.map(k => k.trim().toLowerCase()).filter(Boolean)
    shoeModel!.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshName = (child.name || '').trim()
        const meshLower = meshName.toLowerCase()

        const parentNames: string[] = []
        let p: any = child.parent
        while (p && p !== shoeModel && parentNames.length < 4) {
          if (p.name) parentNames.push(String(p.name).toLowerCase())
          p = p.parent
        }

        const matched = lowers.some(k =>
          meshLower.includes(k) || parentNames.some(n => n.includes(k))
        )

        if (matched) {
          if (child.material instanceof THREE.MeshStandardMaterial) {
            const newMaterial = child.material.clone()
            newMaterial.map = texture
            newMaterial.needsUpdate = true
            child.material = newMaterial
          } else if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                const newMat = mat.clone()
                newMat.map = texture
                newMat.needsUpdate = true
                return newMat
              }
              return mat
            })
          }
        }
      }
    })
  }

  const normalized = texturePath.replace(/^\//, '')
  const candidates: string[] = Array.from(new Set([
    texturePath,
    withBase(normalized),
    '/' + normalized,
    normalized,
    './' + normalized,
  ]))

  loadTextureFromCandidates(candidates)
    .then((texture) => {
      const key = candidates[0]
      if (key) textureCache[key] = texture
      tryApply(texture)
    })
    .catch(() => {
      // 忽略
    })
}

// 应用默认贴图：AB + public 根目录的 xiedai/xiedi/xian/xian2/xiedian
const applyInitialDefaultTextures = () => {
  // 根据当前参数应用 A/B 默认
  applyTextureToArea('A', aParam.value)
  applyTextureToArea('B', bParam.value)

  const publicDefaults: Array<{ keywords: string[]; path: string }> = [
    { path: withBase('tietu/xiedai.png'), keywords: ['xiedai'] },
    { path: withBase('tietu/xiedi.png'), keywords: ['xiedi', 'logoai'] },
    { path: withBase('tietu/xian.png'), keywords: ['xian'] },
    { path: withBase('tietu/xian2.png'), keywords: ['xian2'] },
    { path: withBase('tietu/xiedian.png'), keywords: ['xiedian'] },
  ]

  publicDefaults.forEach(({ keywords, path }) => applyTextureToMeshesByKeywords(keywords, path))

  // 兜底精确名称
  applyTextureToMeshesByKeywords(['xiedai'], withBase('tietu/xiedai.png'))
  applyTextureToMeshesByKeywords(['xian'], withBase('tietu/xian.png'))
  applyTextureToMeshesByKeywords(['xiedian'], withBase('tietu/xiedian.png'))
}

const init = () => {
  if (!containerRef.value) return

    scene = new THREE.Scene()

    const container = containerRef.value
  camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000)
  camera.position.set(0, 0, 5)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
  const initialWidth = container.clientWidth || window.innerWidth
  const initialHeight = container.clientHeight || Math.max(1, Math.round(window.innerHeight * 0.45))
  renderer.setSize(initialWidth, initialHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

  // 基础灯光
  const ambient = new THREE.AmbientLight(0xffffff, 3)
  scene.add(ambient)
  const dir = new THREE.DirectionalLight(0xffffff, 3)
  dir.position.set(5, 5, 5)
  scene.add(dir)

  // 加载模型（使用缓存）
  getClonedGLTF(withBase('xie.gltf'))
    .then(({ scene: clonedScene }) => {
      shoeModel = clonedScene
      shoeModel.scale.set(11, 11, 11)
      scene.add(shoeModel)

      // 自动框选模型，确保可见
      try {
        const box = new THREE.Box3().setFromObject(shoeModel)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = (camera.fov * Math.PI) / 180
        const dist = (maxDim / 2) / Math.tan(fov / 2)
        camera.position.set(center.x, center.y, center.z + dist * 1.4)
        camera.lookAt(center)
        camera.updateProjectionMatrix()
      } catch (e) {
        console.warn('无法自动框选模型:', e)
      }

      // 初始贴图：A/B + logo/xiedi/xian/xiedian 等
      applyInitialDefaultTextures()
      console.log('模型已加载，已应用默认贴图 A:', aParam.value, 'B:', bParam.value)
    })
    .catch((err) => {
      console.error('模型加载失败 xie.gltf:', err)
    })

  const onResize = () => {
    if (!containerRef.value) return
    const el = containerRef.value
    const w = el.clientWidth || window.innerWidth
    const h = el.clientHeight || Math.max(1, Math.round(window.innerHeight * 0.45))
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  // 当容器尺寸首次计算为 0 时，使用 ResizeObserver 监听，尺寸一旦非 0 就重设
  let ro: ResizeObserver | null = null
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(() => {
      onResize()
    })
    ro.observe(container)
  }

  const renderLoop = () => {
    animationId = requestAnimationFrame(renderLoop)
  renderer.render(scene, camera)
}
  renderLoop()

  // 清理函数
  cleanup = () => {
    window.removeEventListener('resize', onResize)
    if (animationId) cancelAnimationFrame(animationId)
    if (renderer) renderer.dispose()
    if (ro) ro.disconnect()
  }
}

let cleanup: () => void = () => {}

onMounted(async () => {
  // 等待一帧，确保 Tailwind 类已应用并参与布局
  await nextTick()
  init()
})

// 监听路由变化，支持在同页内切换不同参数
watch(
  () => route.fullPath,
  () => {
    const nextA = resolveAreaParam('a', aParam.value)
    const nextB = resolveAreaParam('b', bParam.value)
    aParam.value = nextA
    bParam.value = nextB
    if (shoeModel) {
      applyTextureToArea('A', aParam.value)
      applyTextureToArea('B', bParam.value)
    }
  }
)

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
</style>


