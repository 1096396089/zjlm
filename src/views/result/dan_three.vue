<template>
  <div class="">
    <div ref="containerRef" class="w-full h-[60%]"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import * as THREE from 'three'
import { getClonedGLTF } from '@/util/gltfCache'
import { loadTextureFromCandidates } from '@/util/textureCache'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const containerRef = ref<HTMLElement | null>(null)
const emit = defineEmits<{ (e: 'loaded'): void }>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId = 0
let shoeModel: THREE.Group | null = null
const textureCache: Record<string, THREE.Texture> = {}
let pmremGenerator: THREE.PMREMGenerator | null = null
let roomEnvironment: RoomEnvironment | null = null
let controls: OrbitControls | null = null


const rotX = ref(0)
const rotY = ref(2.3)
const rotZ = ref(0)

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
      const key = candidates[0]
      if (key) textureCache[key] = texture
      tryApply(texture)
    })
    .catch(() => { })
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
    .catch(() => { })
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
  camera = new THREE.PerspectiveCamera(20, container.clientWidth / container.clientHeight, 0.1, 1000)
  camera.position.set(0, 0, 5)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
  const initialWidth = container.clientWidth || window.innerWidth
  const initialHeight = container.clientHeight || Math.max(1, Math.round(window.innerHeight * 0.45))
  renderer.setSize(initialWidth, initialHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.35
    ; (renderer as any).physicallyCorrectLights = true
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)
    // 避免浏览器默认触控行为影响自定义捏合缩放
    ; (renderer.domElement.style as any).touchAction = 'none'

  // 相机手势控制：开启缩放（包括双指捏合），关闭旋转/平移
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false
  controls.enableRotate = false
  controls.enablePan = false
  controls.enableDamping = false
  controls.dampingFactor = 1.4

  // 环境贴图（提升整体亮度与金属/塑料质感）
  pmremGenerator = new THREE.PMREMGenerator(renderer)
  // @ts-ignore 兼容不同 three 版本的 RoomEnvironment 构造
  roomEnvironment = new RoomEnvironment(renderer)
  const envTexture = pmremGenerator.fromScene(roomEnvironment as unknown as THREE.Scene, 0.04).texture
  scene.environment = envTexture

  // 基础与补光灯光
  const ambient = new THREE.AmbientLight(0xffffff, 2.2)
  scene.add(ambient)
  const hemi = new THREE.HemisphereLight(0xffffff, 0x666666, 0.8)
  hemi.position.set(0, 5, 0)
  scene.add(hemi)
  const dir = new THREE.DirectionalLight(0xffffff, 2.2)
  dir.position.set(5, 7, 6)
  scene.add(dir)
  const fill = new THREE.DirectionalLight(0xffffff, 1.2)
  fill.position.set(-4, 3, -3)
  scene.add(fill)

  // 加载模型（使用缓存）
  getClonedGLTF(withBase('xie.gltf'))
    .then(({ scene: clonedScene }) => {
      shoeModel = clonedScene
      shoeModel.scale.set(11, 11, 11)
      shoeModel.rotation.set(rotX.value, rotY.value, rotZ.value)
      scene.add(shoeModel)

      // 提升基于环境光的反射强度
      shoeModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach((m: any) => {
            if (m) {
              m.envMapIntensity = 1.2
              m.needsUpdate = true
            }
          })
        }
      })

      // 自动框选模型，确保可见
      try {
        const box = new THREE.Box3().setFromObject(shoeModel)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = (camera.fov * Math.PI) / 180
        const dist = (maxDim / 2) / Math.tan(fov / 2)
        camera.position.set(center.x, center.y, center.z + dist * 1.1)
        camera.lookAt(center)
        camera.updateProjectionMatrix()
        if (controls) {
          controls.target.copy(center)
          controls.minDistance = dist * 0.6
          controls.maxDistance = dist * 2.0
          controls.update()
        }
        // 使用调整焦段(视场角)方式实现“拉近”效果，而非移动相机距离
        const setFov = (nf: number) => {
          const minFov = 20
          const maxFov = 70
          camera.fov = Math.min(maxFov, Math.max(minFov, nf))
          camera.updateProjectionMatrix()
        }
        setFov(20)
      } catch (e) {
        console.warn('无法自动框选模型:', e)
      }

      // 初始贴图：A/B + logo/xiedi/xian/xiedian 等
      applyInitialDefaultTextures()
      console.log('模型已加载，已应用默认贴图 A:', aParam.value, 'B:', bParam.value)
      // 通知父组件加载完成，用于隐藏“加载中”占位并显示画面
      emit('loaded')
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

  // 通过修改相机 FOV 实现滚轮与双指缩放
  const dom = renderer.domElement
  let pinchStartDistance = 0
  let pinchStartFov = camera.fov
  const clampFov = (nf: number) => Math.min(70, Math.max(20, nf))
  const applyFov = (nf: number) => {
    camera.fov = clampFov(nf)
    camera.updateProjectionMatrix()
  }

  const onWheel = (e: WheelEvent) => {
    e.preventDefault()
    const sensitivity = 0.05
    applyFov(camera.fov + e.deltaY * sensitivity)
  }
  const distanceBetweenTouches = (t1: Touch, t2: Touch) => {
    const dx = t1.clientX - t2.clientX
    const dy = t1.clientY - t2.clientY
    return Math.hypot(dx, dy)
  }
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDistance = distanceBetweenTouches(e.touches[0], e.touches[1])
      pinchStartFov = camera.fov
    }
  }
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistance > 0) {
      e.preventDefault()
      const current = distanceBetweenTouches(e.touches[0], e.touches[1])
      if (current > 0) {
        const ratio = pinchStartDistance / current
        applyFov(pinchStartFov * ratio)
      }
    }
  }
  const onTouchEnd = () => {
    pinchStartDistance = 0
  }
  dom.addEventListener('wheel', onWheel, { passive: false })
  dom.addEventListener('touchstart', onTouchStart, { passive: true })
  dom.addEventListener('touchmove', onTouchMove, { passive: false })
  dom.addEventListener('touchend', onTouchEnd, { passive: true })

  const renderLoop = () => {
    animationId = requestAnimationFrame(renderLoop)
    if (controls) controls.update()
    renderer.render(scene, camera)
  }
  renderLoop()

  // 清理函数
  cleanup = () => {
    window.removeEventListener('resize', onResize)
    if (animationId) cancelAnimationFrame(animationId)
    if (renderer) renderer.dispose()
    if (pmremGenerator) { pmremGenerator.dispose(); pmremGenerator = null }
    if (roomEnvironment && (roomEnvironment as any).dispose) { (roomEnvironment as any).dispose(); roomEnvironment = null }
    // @ts-ignore
    if (scene) scene.environment = null
    if (ro) ro.disconnect()
    if (renderer && renderer.domElement) {
      const d = renderer.domElement
      d.removeEventListener('wheel', onWheel as any)
      d.removeEventListener('touchstart', onTouchStart as any)
      d.removeEventListener('touchmove', onTouchMove as any)
      d.removeEventListener('touchend', onTouchEnd as any)
    }
    if (controls) { controls.dispose(); controls = null }
  }
}

let cleanup: () => void = () => { }

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

<style scoped></style>
