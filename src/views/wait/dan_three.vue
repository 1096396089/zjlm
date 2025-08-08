<template>
  <div class="w-full h-full relative">
    <div ref="containerRef" class="w-full h-full"></div>

    <div v-if="debugMode"
      class="absolute top-2 right-2 z-20 bg-white/85 backdrop-blur rounded-md shadow p-3 text-xs space-y-2 w-60">
      <div class="font-semibold">Camera (XYZ)</div>
      <div class="grid grid-cols-[18px_1fr] items-center gap-2">
        <label class="text-gray-600">X</label>
        <input type="range" min="-50" max="50" step="0.01" v-model.number="camX" />
        <span></span>
        <input type="number" step="0.01" v-model.number="camX" class="w-full border rounded px-1 py-0.5" />

        <label class="text-gray-600">Y</label>
        <input type="range" min="-50" max="50" step="0.01" v-model.number="camY" />
        <span></span>
        <input type="number" step="0.01" v-model.number="camY" class="w-full border rounded px-1 py-0.5" />

        <label class="text-gray-600">Z</label>
        <input type="range" min="-50" max="50" step="0.01" v-model.number="camZ" />
        <span></span>
        <input type="number" step="0.01" v-model.number="camZ" class="w-full border rounded px-1 py-0.5" />
      </div>
      <div class="font-semibold pt-1">Model offset</div>
      <div class="grid grid-cols-[18px_1fr] items-center gap-2">
        <label class="text-gray-600">X</label>
        <input type="range" min="-5" max="5" step="0.01" v-model.number="shoeOffsetX" />
        <span></span>
        <input type="number" step="0.01" v-model.number="shoeOffsetX" class="w-full border rounded px-1 py-0.5" />

        <label class="text-gray-600">Y</label>
        <input type="range" min="-5" max="5" step="0.01" v-model.number="shoeOffsetY" />
        <span></span>
        <input type="number" step="0.01" v-model.number="shoeOffsetY" class="w-full border rounded px-1 py-0.5" />
      </div>
      <div class="flex gap-2">
        <button class="px-2 py-1 rounded bg-gray-100" @click="resetCamera">重置</button>
        <button class="px-2 py-1 rounded bg-gray-100" @click="copyCamera">复制</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const containerRef = ref<HTMLElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId = 0
let shoeModel: THREE.Group | null = null
let focusCenter = new THREE.Vector3(0, 0, 0)
// 模型偏移
const shoeOffsetX = ref(-10)
const shoeOffsetY = ref(0)

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

// 调试开关：?debug=1
const debugMode = computed(() => {
  const v = (route.query.debug as string) || ''
  return v === '1' || v.toLowerCase() === 'true'
})

// 可调相机坐标
const camX = ref(0)
const camY = ref(0)
const camZ = ref(5)

const applyCam = () => {
  if (!camera) return
  camera.position.set(camX.value, camY.value, camZ.value)
  camera.lookAt(focusCenter)
}

watch([camX, camY, camZ], applyCam)

// 应用模型偏移
watch([shoeOffsetX, shoeOffsetY], () => {
  if (!shoeModel) return
  shoeModel.position.x = shoeOffsetX.value
  shoeModel.position.y = shoeOffsetY.value
})

const getTexturePath = (area: 'A' | 'B', filename: string): string => {
  if (!filename) return ''
  // 若传入的是绝对/相对路径，则原样返回
  if (filename.startsWith('http') || filename.startsWith('/') || filename.startsWith('./')) {
    return filename
  }
  // 确保带扩展名
  const finalName = filename.toLowerCase().endsWith('.png') ? filename : `${filename}.png`
  return `/tietu/${area}/${finalName}`
}

const applyTextureToArea = (area: 'A' | 'B', filename: string) => {
  if (!shoeModel || !filename) return

  const loader = new THREE.TextureLoader()
  const path = getTexturePath(area, filename)
  loader.load(
    path,
    (texture) => {
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      texture.flipY = false
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter

      let applied = false
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
            applied = true
          }
        }
      })

      if (!applied) {
        // 没找到对应区域，不报错，只忽略
      }
    },
    undefined,
    () => {
      // 贴图加载失败时忽略
    }
  )
}

const init = () => {
  if (!containerRef.value) return

  scene = new THREE.Scene()

  const container = containerRef.value
  camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000)
  camera.position.set(camX.value, camY.value, camZ.value)

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

  // 加载模型
  const loader = new GLTFLoader()
  loader.load(
    '/xie1.gltf',
    (gltf) => {
      shoeModel = gltf.scene
      shoeModel.scale.set(14, 14, 14)
      // 轻微俯视，脚尖朝右下，接近设计图
      shoeModel.rotation.set(0, -0.65, -0.32)

      scene.add(shoeModel)

      // 自动框选模型，确保可见
      try {
        const box = new THREE.Box3().setFromObject(shoeModel)
        const center = box.getCenter(new THREE.Vector3())
        focusCenter.copy(center)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = (camera.fov * Math.PI) / 180
        const dist = (maxDim / 2) / Math.tan(fov / 2)
        if (!debugMode.value) {
          // 相机略向左上偏移并更接近主体（默认构图）
          camera.position.set(
            center.x - size.x * 0.06,
            center.y + size.y * 0.06,
            center.z + dist * 0.95
          )
          camX.value = camera.position.x
          camY.value = camera.position.y
          camZ.value = camera.position.z
        }
        camera.lookAt(center.x, center.y + size.y * 0.02, center.z)
        camera.updateProjectionMatrix()

      } catch (e) {
        console.warn('无法自动框选模型:', e)
      }

      // 应用查询参数贴图
      applyTextureToArea('A', aParam.value)
      applyTextureToArea('B', bParam.value)
      console.log('模型已加载，已应用贴图 A:', aParam.value, 'B:', bParam.value)
    },
    undefined,
    (err) => {
      console.error('模型加载失败 /xie1.gltf:', err)
    }
  )

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

let cleanup: () => void = () => { }

onMounted(async () => {
  // 等待一帧，确保 Tailwind 类已应用并参与布局
  await nextTick()
  init()
})

const resetCamera = () => {
  camX.value = 0
  camY.value = 0
  camZ.value = 5
  applyCam()
}

const copyCamera = async () => {
  const text = `camera.position.set(${camX.value.toFixed(3)}, ${camY.value.toFixed(3)}, ${camZ.value.toFixed(3)})`
  try {
    await navigator.clipboard.writeText(text)
    // no-op: 静默复制
  } catch { }
}

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
