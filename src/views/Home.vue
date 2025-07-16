<template>
  <div class="relative w-screen h-screen overflow-hidden bg-gray-100">
    <!-- 加载提示 -->
    <div v-if="loading" class="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center text-white z-[100]">
      <div class="w-12 h-12 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-5"></div>
      <p>加载中... {{ loadingProgress }}%</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center text-white z-[100]">
      <p>{{ error }}</p>
      <button @click="retryLoad" class="mt-5 px-5 py-2.5 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-600">重试</button>
    </div>

    <!-- Three.js 渲染容器 -->
    <div ref="containerRef" class="w-full h-full relative"></div>

    <!-- 控制面板切换按钮 -->
    <button 
      @click="toggleControlPanel" 
      class="fixed top-5 right-5 z-20 w-12 h-12 bg-white bg-opacity-90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all duration-200"
    >
      <svg v-if="showControlPanel" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
      </svg>
    </button>

    <!-- 控制面板 -->
    <div 
      v-show="showControlPanel"
      class="absolute top-20 right-5 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-5 shadow-lg max-w-xs z-10 md:max-w-sm lg:max-w-md transition-all duration-300"
    >
      <!-- 颜色控制 -->
      <div class="mb-5">
        <label class="block mb-2 font-semibold text-gray-700">鞋子颜色:</label>
        <div class="flex gap-2.5 flex-wrap">
          <div
            v-for="color in colors"
            :key="color.name"
            :class="['w-10 h-10 rounded-full cursor-pointer border-3 border-transparent transition-all duration-200 hover:scale-110', selectedColor === color.value ? 'border-blue-500 scale-120' : '']"
            :style="{ backgroundColor: color.value }"
            @click="changeColor(color.value)"
          ></div>
        </div>
      </div>

      <!-- 环境控制 -->
      <div class="mb-5">
        <label class="block mb-2 font-semibold text-gray-700">环境:</label>
        <select v-model="selectedEnvironment" @change="changeEnvironment" class="w-full p-2 border border-gray-300 rounded bg-white text-sm">
          <option value="studio">工作室</option>
          <option value="outdoor">户外</option>
          <option value="dark">暗色</option>
        </select>
      </div>

      <!-- 动画控制 -->
      <div class="mb-5">
        <label class="block mb-2 font-semibold text-gray-700">动画:</label>
        <button @click="toggleAnimation" :class="['px-4 py-2 mr-2.5 mb-2.5 border border-gray-300 rounded bg-white cursor-pointer text-sm transition-all duration-200 hover:bg-gray-100', isAnimating ? 'bg-blue-500 text-white border-blue-500' : '']">
          {{ isAnimating ? '暂停' : '播放' }}
        </button>
        <button @click="resetView" class="px-4 py-2 mr-2.5 mb-2.5 border border-gray-300 rounded bg-white cursor-pointer text-sm transition-all duration-200 hover:bg-gray-100">重置视角</button>
      </div>

      <!-- 截图功能 -->
      <div class="mb-0">
        <button @click="takeScreenshot" class="px-4 py-2 mr-2.5 mb-2.5 border border-gray-300 rounded bg-white cursor-pointer text-sm transition-all duration-200 hover:bg-gray-100">截图</button>
        <button @click="toggleFullscreen" class="px-4 py-2 mr-2.5 mb-2.5 border border-gray-300 rounded bg-white cursor-pointer text-sm transition-all duration-200 hover:bg-gray-100">全屏</button>
      </div>
    </div>

    <!-- 手势提示 -->
    <!-- <div v-if="showGestureHint" class="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-5 py-2.5 rounded-full text-sm z-10 animate-pulse">
      <p>👆 拖拽旋转 | 🤏 双指缩放 | 📱 倾斜设备查看</p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

// 响应式数据
const containerRef = ref<HTMLElement>()
const loading = ref(true)
const loadingProgress = ref(0)
const error = ref('')
const selectedColor = ref('#8B4513')
const selectedEnvironment = ref('studio')
const isAnimating = ref(true)
const showGestureHint = ref(true)
const showControlPanel = ref(false)

// Three.js 相关变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let shoeModel: THREE.Group
let mixer: THREE.AnimationMixer
let animationId: number

// 颜色选项
const colors = [
  { name: '棕色', value: '#8B4513' },
  { name: '黑色', value: '#000000' },
  { name: '白色', value: '#FFFFFF' },
  { name: '红色', value: '#FF0000' },
  { name: '蓝色', value: '#0000FF' },
  { name: '绿色', value: '#00FF00' },
]

// 切换控制面板显示
const toggleControlPanel = () => {
  showControlPanel.value = !showControlPanel.value
}

// 初始化Three.js
const initThree = async () => {
  if (!containerRef.value) return

  try {
    // 创建场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    // 创建相机
    const container = containerRef.value
    camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 10)

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true // 用于截图
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    container.appendChild(renderer.domElement)

    // 创建控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.enablePan = false
    controls.maxDistance = 20
    controls.minDistance = 4

    // 添加光照
    setupLighting()

    // 加载模型
    await loadShoeModel()

    // 开始渲染循环
    animate()

    // 设置响应式
    setupResponsive()

    // 添加设备方向控制（移动端）
    setupDeviceOrientation()

    loading.value = false
    
    // 3秒后隐藏手势提示
    setTimeout(() => {
      showGestureHint.value = false
    }, 3000)

  } catch (err) {
    console.error('初始化Three.js失败:', err)
    error.value = '初始化失败，请刷新页面重试'
    loading.value = false
  }
}

// 设置光照
const setupLighting = () => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  // 主光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  // 补充光源
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
  fillLight.position.set(-5, 0, -5)
  scene.add(fillLight)
}

// 加载鞋子模型
const loadShoeModel = async () => {
  const loader = new GLTFLoader()
  
  return new Promise((resolve, reject) => {
    loader.load(
      '/xie.gltf',
      (gltf) => {
        shoeModel = gltf.scene
        
        // 设置模型属性 - 进一步增大缩放比例
        shoeModel.scale.set(10, 10, 10)
        shoeModel.position.set(0, -1, 0)
        
        // 调整鞋子方向 - 让它横向显示
        // shoeModel.rotation.x = -Math.PI / 2  // 绕X轴旋转-90度
        // shoeModel.rotation.y = 0
        // shoeModel.rotation.z = 0
        
        // 遍历模型，设置材质和阴影
        shoeModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
            
            // 如果是鞋子主体，设置可变色材质
            if (child.material) {
              child.material.needsUpdate = true
            }
          }
        })
        
        scene.add(shoeModel)
        
        // 如果有动画，设置动画混合器
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(shoeModel)
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip)
            action.play()
          })
        }
        
        resolve(gltf)
      },
      (progress) => {
        loadingProgress.value = Math.round((progress.loaded / progress.total) * 100)
      },
      (err) => {
        console.error('模型加载失败:', err)
        reject(err)
      }
    )
  })
}

// 渲染循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  // 更新控制器
  controls.update()
  
  // 更新动画
  if (mixer && isAnimating.value) {
    mixer.update(0.016)
  }
  
  // 自动旋转
  if (shoeModel && isAnimating.value) {
    shoeModel.rotation.y += 0.005
  }
  
  // 渲染
  renderer.render(scene, camera)
}

// 改变颜色
const changeColor = (color: string) => {
  selectedColor.value = color
  
  if (shoeModel) {
    shoeModel.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // 这里可以根据实际模型结构调整
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.setHex(parseInt(color.replace('#', '0x')))
        }
      }
    })
  }
}

// 改变环境
const changeEnvironment = () => {
  const environments: { [key: string]: number } = {
    studio: 0xf0f0f0,
    outdoor: 0x87CEEB,
    dark: 0x222222
  }
  
  scene.background = new THREE.Color(environments[selectedEnvironment.value])
}

// 切换动画
const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value
}

// 重置视角
const resetView = () => {
  camera.position.set(0, 0, 10)
  controls.reset()
  if (shoeModel) {
    shoeModel.rotation.set(-Math.PI / 2, 0, 0)
  }
}

// 截图
const takeScreenshot = () => {
  const canvas = renderer.domElement
  const link = document.createElement('a')
  link.download = 'shoe-screenshot.png'
  link.href = canvas.toDataURL()
  link.click()
}

// 全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    containerRef.value?.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 重试加载
const retryLoad = () => {
  error.value = ''
  loading.value = true
  loadingProgress.value = 0
  initThree()
}

// 响应式设置
const setupResponsive = () => {
  const handleResize = () => {
    if (!containerRef.value) return
    
    const container = containerRef.value
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }
  
  window.addEventListener('resize', handleResize)
  
  // 监听容器大小变化
  const resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(containerRef.value!)
}

// 设备方向控制（移动端）
const setupDeviceOrientation = () => {
  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  if (isMobile && 'DeviceOrientationEvent' in window) {
    // 请求设备方向权限（iOS 13+）
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            addOrientationListener()
          }
        })
        .catch(console.error)
    } else {
      addOrientationListener()
    }
  }
  
  function addOrientationListener() {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (shoeModel && event.beta && event.gamma) {
        const beta = event.beta * Math.PI / 180
        const gamma = event.gamma * Math.PI / 180
        
        shoeModel.rotation.x = beta * 0.1
        shoeModel.rotation.z = gamma * 0.1
      }
    }
    
    window.addEventListener('deviceorientation', handleOrientation)
  }
  
  // 添加触摸优化
  if (containerRef.value) {
    const canvas = containerRef.value.querySelector('canvas')
    if (canvas) {
      // 防止页面滚动
      canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false })
      canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })
      canvas.addEventListener('touchend', (e) => e.preventDefault(), { passive: false })
      
      // 添加触摸反馈
      canvas.style.touchAction = 'none'
    }
  }
}

// 生命周期
onMounted(async () => {
  await nextTick()
  initThree()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (controls) {
    controls.dispose()
  }
})
</script>

<style>
/* 移动端适配 */
@media (max-width: 768px) {
  .shoe-viewer {
    height: 100vh;
    height: 100dvh;
  }
  
  .control-panel {
    position: fixed !important;
    bottom: 20px !important;
    left: 10px !important;
    right: 10px !important;
    top: auto !important;
    max-height: 40vh !important;
    overflow-y: auto !important;
    padding: 15px !important;
    max-width: none !important;
  }
  
  .control-panel .color-option {
    width: 35px !important;
    height: 35px !important;
    margin: 2px !important;
  }
  
  .control-panel button {
    padding: 8px 12px !important;
    font-size: 12px !important;
    min-height: 36px !important;
  }
  
  .control-panel select {
    font-size: 14px !important;
    min-height: 36px !important;
  }
  
  .gesture-hint {
    bottom: 200px !important;
    left: 10px !important;
    right: 10px !important;
    transform: none !important;
    text-align: center !important;
    font-size: 12px !important;
    padding: 8px 15px !important;
  }
  
  .canvas-container {
    height: calc(100vh - 180px) !important;
    height: calc(100dvh - 180px) !important;
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .control-panel {
    padding: 10px !important;
  }
  
  .control-panel .color-option {
    width: 30px !important;
    height: 30px !important;
  }
  
  .control-panel button {
    padding: 6px 10px !important;
    font-size: 11px !important;
    margin-right: 5px !important;
    margin-bottom: 8px !important;
  }
  
  .gesture-hint {
    font-size: 11px !important;
    padding: 6px 12px !important;
  }
}

/* 横屏适配 */
@media (orientation: landscape) and (max-height: 600px) {
  .control-panel {
    position: fixed !important;
    right: 10px !important;
    top: 10px !important;
    bottom: 10px !important;
    left: auto !important;
    width: 280px !important;
    max-height: none !important;
    overflow-y: auto !important;
  }
  
  .canvas-container {
    height: 100vh !important;
    height: 100dvh !important;
    padding-right: 300px !important;
  }
  
  .gesture-hint {
    bottom: 20px !important;
    left: 20px !important;
    right: 320px !important;
    transform: none !important;
  }
}

/* 全屏模式 */
:fullscreen .control-panel {
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  z-index: 1000 !important;
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .control-panel button:hover {
    background: white !important;
  }
  
  .control-panel button:active {
    background: #e0e0e0 !important;
    transform: scale(0.95) !important;
  }
  
  .color-option:hover {
    transform: none !important;
  }
  
  .color-option:active {
    transform: scale(0.9) !important;
  }
}

/* 无障碍适配 */
@media (prefers-reduced-motion: reduce) {
  .animate-spin {
    animation: none !important;
  }
  
  .animate-pulse {
    animation: none !important;
    opacity: 1 !important;
  }
  
  .transition-all {
    transition: none !important;
  }
}
</style>