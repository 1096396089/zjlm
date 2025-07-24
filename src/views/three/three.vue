<template>
    <div class="relative w-screen h-screen overflow-hidden ">
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
      <div ref="containerRef" class="w-full h-[45%] relative" style="background: transparent;"></div>

      <!-- 设置按钮 -->
      <button 
        @click="toggleControlPanel" 
        class="fixed top-5 right-5 z-20 w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      <!-- 高级设置面板 -->
      <div 
        v-show="showControlPanel"
        class="fixed top-16 right-5 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs z-10 transition-all duration-300 max-h-[70vh] overflow-y-auto"
      >
        <!-- 相机位置控制 -->
        <div class="mb-4">
          <label class="block mb-2 font-semibold text-gray-700 text-sm">相机位置:</label>
          <div class="space-y-2">
            <div>
              <label class="block text-xs text-gray-600 mb-1">X轴: {{ cameraPosition.x.toFixed(1) }}</label>
              <input 
                type="range" 
                v-model.number="cameraPosition.x" 
                min="-20" 
                max="20" 
                step="0.1"
                @input="updateCameraPosition"
                class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              >
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Y轴: {{ cameraPosition.y.toFixed(1) }}</label>
              <input 
                type="range" 
                v-model.number="cameraPosition.y" 
                min="-20" 
                max="20" 
                step="0.1"
                @input="updateCameraPosition"
                class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              >
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Z轴: {{ cameraPosition.z.toFixed(1) }}</label>
              <input 
                type="range" 
                v-model.number="cameraPosition.z" 
                min="2" 
                max="10" 
                step="0.1"
                @input="updateCameraPosition"
                class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              >
            </div>
          </div>
        </div>

        <!-- 灯光控制 -->
        <div class="mb-4">
          <label class="block mb-2 font-semibold text-gray-700 text-sm">灯光强度:</label>
          <div class="space-y-2">
            <div>
              <label class="block text-xs text-gray-600 mb-1">环境光: {{ lightingIntensity.ambient.toFixed(1) }}</label>
              <input 
                type="range" 
                v-model.number="lightingIntensity.ambient" 
                min="0" 
                max="3" 
                step="0.1"
                @input="updateLightingIntensity"
                class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              >
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">主光源: {{ lightingIntensity.directional.toFixed(1) }}</label>
              <input 
                type="range" 
                v-model.number="lightingIntensity.directional" 
                min="0" 
                max="3" 
                step="0.1"
                @input="updateLightingIntensity"
                class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              >
            </div>
          </div>
        </div>

        <!-- 其他控制 -->
        <div class="space-y-2">
          <button @click="toggleAnimation" :class="['w-full px-3 py-2 text-xs rounded border', isAnimating ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300']">
            {{ isAnimating ? '暂停旋转' : '开始旋转' }}
          </button>
          <button @click="resetView" class="w-full px-3 py-2 text-xs rounded border bg-white text-gray-700 border-gray-300">重置视角</button>
          <button @click="takeScreenshot" class="w-full px-3 py-2 text-xs rounded border bg-white text-gray-700 border-gray-300">截图</button>
        </div>
      </div>

      <!-- 主要控制面板 -->
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl">
        <!-- 操作提示 -->
        <div class="text-center py-4 border-b border-gray-100">
          <p class="text-gray-600 text-sm">拖动旋转鞋子，双指放大</p>
          <div class="flex justify-center mt-2">
            <div class="w-8 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <!-- 颜色选择区域 -->
        <div class="p-6 space-y-6">
          <!-- 区域1 颜色选择 -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800">区域1</h3>
              <span class="text-sm text-gray-500">当前: {{ selectedATexture.replace('.png', '') }}</span>
            </div>
            <div class="flex justify-center space-x-4">
              <div 
                v-for="(texture, index) in aTextureNames" 
                :key="texture"
                @click="switchToATexture(texture)"
                :class="[
                  'w-12 h-12 rounded-full border-4 transition-all duration-200 cursor-pointer flex items-center justify-center relative overflow-hidden',
                  selectedATexture === texture ? 'border-blue-500 shadow-lg transform scale-110' : 'border-gray-300 hover:border-gray-400'
                ]"
                :style="{ backgroundColor: getColorForTexture('A', texture) }"
              >
                <!-- 选中指示器 -->
                <div v-if="selectedATexture === texture" class="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <!-- 颜色名称标签 -->
                <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                  {{ getColorName('A', texture) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 分隔线 -->
          <div class="border-t border-gray-200"></div>

          <!-- 区域2 颜色选择 -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800">区域2</h3>
              <span class="text-sm text-gray-500">当前: {{ selectedBTexture.replace('.png', '') }}</span>
            </div>
            <div class="flex justify-center space-x-4">
              <div 
                v-for="(texture, index) in bTextureNames" 
                :key="texture"
                @click="switchToBTexture(texture)"
                :class="[
                  'w-12 h-12 rounded-full border-4 transition-all duration-200 cursor-pointer flex items-center justify-center relative overflow-hidden',
                  selectedBTexture === texture ? 'border-green-500 shadow-lg transform scale-110' : 'border-gray-300 hover:border-gray-400'
                ]"
                :style="{ backgroundColor: getColorForTexture('B', texture) }"
              >
                <!-- 选中指示器 -->
                <div v-if="selectedBTexture === texture" class="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <!-- 颜色名称标签 -->
                <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                  {{ getColorName('B', texture) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 定制完成按钮 -->
          <div class="pt-4">
            <button 
              @click="completeCustomization"
              class="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
            >
              定制完成
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import * as THREE from 'three'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
  
  // 环境检测和路径适配工具
  const getTexturePath = (folder: 'A' | 'B', filename: string): string => {
    // 检测环境
    const isDev = import.meta.env.DEV
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    
    // 生产环境路径
    const prodPath = `/tietu/${folder}/${filename}`
    
    // 开发环境路径
    const devPath = `/tietu/${folder}/${filename}`

    
    return isDev ? devPath : prodPath
  }
  
  // 响应式数据
  const containerRef = ref<HTMLElement>()
  const loading = ref(true)
  const loadingProgress = ref(0)
  const error = ref('')
  const selectedEnvironment = ref('studio')
  const isAnimating = ref(true)
  const showGestureHint = ref(true)
  const showControlPanel = ref(false)
  const cameraPosition = ref({ x: 0, y: 0, z: 5 })
  
  // A和B贴图文件名数组
  const aTextureNames = ['A6C.png', 'A5C.png', 'A4C.png', 'A3C.png', 'A2C.png', 'AC.png',]
  const bTextureNames = ['B6C.png', 'B5C.png', 'B4C.png', 'B3C.png', 'B2C.png', 'BC.png',]
  
  // 当前选中的贴图
  const selectedATexture = ref('AC.png')
  const selectedBTexture = ref('BC.png')
  
  // 贴图缓存
  const textureCache: Record<string, THREE.Texture> = {}
  
  // 添加灯光强度控制
  const lightingIntensity = ref({
    ambient: 3.0,
    directional: 3.0,
    fill: 2.0,
    additional:1.5
  })
  
  // 添加Mesh列表
  const meshList = ref<Array<{name: string, index: number, mesh: THREE.Mesh}>>([])
  

  
  // Three.js 相关变量
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let controls: OrbitControls
  let shoeModel: THREE.Group
  let mixer: THREE.AnimationMixer
  let animationId: number
  
  // 添加灯光对象引用
  let ambientLight: THREE.AmbientLight
  let directionalLight: THREE.DirectionalLight
  let fillLight: THREE.DirectionalLight
  let topLight: THREE.DirectionalLight
  let bottomLight: THREE.DirectionalLight
  let leftLight: THREE.DirectionalLight
  let rightLight: THREE.DirectionalLight
  let spotLight: THREE.SpotLight
  
  // 切换控制面板显示
  const toggleControlPanel = () => {
    showControlPanel.value = !showControlPanel.value
  }
  
  // 更新相机位置
  const updateCameraPosition = () => {
    if (camera) {
      camera.position.set(cameraPosition.value.x, cameraPosition.value.y, cameraPosition.value.z)
      camera.updateProjectionMatrix()
    }
  }
  
  // 更新灯光强度
  const updateLightingIntensity = () => {
    if (ambientLight) ambientLight.intensity = lightingIntensity.value.ambient
    if (directionalLight) directionalLight.intensity = lightingIntensity.value.directional
    if (fillLight) fillLight.intensity = lightingIntensity.value.fill
    if (topLight) topLight.intensity = lightingIntensity.value.additional
    if (bottomLight) bottomLight.intensity = lightingIntensity.value.additional * 0.8
    if (leftLight) leftLight.intensity = lightingIntensity.value.additional
    if (rightLight) rightLight.intensity = lightingIntensity.value.additional
    if (spotLight) spotLight.intensity = lightingIntensity.value.directional * 0.8
  }
  
  // 获取指定Mesh的函数
  const getMeshByName = (name: string): THREE.Mesh | null => {
    const found = meshList.value.find(item => item.name === name)
    return found ? found.mesh : null
  }
  
  const getMeshByIndex = (index: number): THREE.Mesh | null => {
    const found = meshList.value.find(item => item.index === index)
    return found ? found.mesh : null
  }
  

  
  const switchToATexture = (textureName: string) => {
    if (!aTextureNames.includes(textureName)) {
      return
    }
    
    selectedATexture.value = textureName
    
    // 使用环境适配的路径
    const texturePath = getTexturePath('A', textureName)
    applyTextureToMeshA(texturePath)
  }
  

  
  const switchToBTexture = (textureName: string) => {
    if (!bTextureNames.includes(textureName)) {
      return
    }
    
    selectedBTexture.value = textureName

    
    // 使用环境适配的路径
    const texturePath = getTexturePath('B', textureName)
    applyTextureToMeshB(texturePath)
  }
  
  // 应用贴图到A mesh
  const applyTextureToMeshA = (texturePath: string) => {
    if (!shoeModel) return
    
    const textureLoader = new THREE.TextureLoader()
    
    // 添加错误处理和备用路径
    const tryLoadTexture = (path: string, fallbackPaths: string[] = []) => {
      textureLoader.load(
        path,
        (texture) => {
          // 成功加载贴图
          // UV贴图设置 - 不重复，按UV坐标映射
          texture.wrapS = THREE.ClampToEdgeWrapping
          texture.wrapT = THREE.ClampToEdgeWrapping
          texture.repeat.set(1, 1)
          texture.offset.set(0, 0)
          texture.minFilter = THREE.LinearMipmapLinearFilter
          texture.magFilter = THREE.LinearFilter
          texture.flipY = false // 根据需要调整Y轴翻转
          
          let appliedCount = 0
          
          // 查找名称为'A'的mesh（精确匹配）
          shoeModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const meshName = child.name.trim()
              // 精确匹配名称为"A"的Mesh
              if (meshName === 'A') {
                
                if (child.material instanceof THREE.MeshStandardMaterial) {
                  // 克隆材质避免影响其他使用相同材质的对象
                  const newMaterial = child.material.clone()
                  newMaterial.map = texture
                  newMaterial.needsUpdate = true
                  child.material = newMaterial
                  appliedCount++
                } else if (Array.isArray(child.material)) {
                  // 如果是材质数组，更新所有材质
                  child.material = child.material.map((mat) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      const newMat = mat.clone()
                      newMat.map = texture
                      newMat.needsUpdate = true
                      return newMat
                    }
                    return mat
                  })
                  appliedCount++
                }
              }
            }
          })
          
          if (appliedCount === 0) {
            shoeModel.traverse((child) => {
              if (child instanceof THREE.Mesh) {
              }
            })
          } else {
          }
        },
        (progress) => {
          console.log(`A贴图加载进度: ${path}`, progress)
        },
        (error) => {
          console.error(`A贴图加载失败: ${path}`, error)
          
          // 尝试备用路径
          if (fallbackPaths.length > 0) {
            const nextPath = fallbackPaths.shift()!
            tryLoadTexture(nextPath, fallbackPaths)
          } else {
          }
        }
      )
    }
    
    // 定义多个可能的路径
    const fileName = texturePath.split('/').pop()!
    const possiblePaths = [
      texturePath, // 主路径
      `/assets/tietu/A/${fileName}`, // 备用路径1
      `./tietu/A/${fileName}`, // 备用路径2
      `./src/assets/tietu/A/${fileName}` // 备用路径3
    ]
    
    const mainPath = possiblePaths.shift()!
    tryLoadTexture(mainPath, possiblePaths)
  }
  
  // 应用贴图到B mesh
  const applyTextureToMeshB = (texturePath: string) => {
    if (!shoeModel) return
    
    const textureLoader = new THREE.TextureLoader()
    
    // 添加错误处理和备用路径
    const tryLoadTexture = (path: string, fallbackPaths: string[] = []) => {
      textureLoader.load(
        path,
        (texture) => {
          // 成功加载贴图
          
          // UV贴图设置 - 不重复，按UV坐标映射
          texture.wrapS = THREE.ClampToEdgeWrapping
          texture.wrapT = THREE.ClampToEdgeWrapping
          texture.repeat.set(1, 1)
          texture.offset.set(0, 0)
          texture.minFilter = THREE.LinearMipmapLinearFilter
          texture.magFilter = THREE.LinearFilter
          texture.flipY = false // 根据需要调整Y轴翻转
          
          let appliedCount = 0
          
          // 查找名称为'B'的mesh（精确匹配）
          shoeModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const meshName = child.name.trim()
              // 精确匹配名称为"B"的Mesh
              if (meshName === 'B') {

                if (child.material instanceof THREE.MeshStandardMaterial) {
                  // 克隆材质避免影响其他使用相同材质的对象
                  const newMaterial = child.material.clone()
                  newMaterial.map = texture
                  newMaterial.needsUpdate = true
                  child.material = newMaterial
                  appliedCount++
                } else if (Array.isArray(child.material)) {
                  // 如果是材质数组，更新所有材质
                  child.material = child.material.map((mat) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      const newMat = mat.clone()
                      newMat.map = texture
                      newMat.needsUpdate = true
                      return newMat
                    }
                    return mat
                  })
                  appliedCount++
                }
              }
            }
          })
          
          if (appliedCount === 0) {
            // 输出所有可用的Mesh名称供参考
            shoeModel.traverse((child) => {
              if (child instanceof THREE.Mesh) {
              }
            })
          } else {
          }
        },
        (progress) => {
        },
        (error) => {
          
          // 尝试备用路径
          if (fallbackPaths.length > 0) {
            const nextPath = fallbackPaths.shift()!
            tryLoadTexture(nextPath, fallbackPaths)
          } else {
          }
        }
      )
    }
    
    // 定义多个可能的路径
    const fileName = texturePath.split('/').pop()!
    const possiblePaths = [
      texturePath, // 主路径
      `/assets/tietu/B/${fileName}`, // 备用路径1
      `./tietu/B/${fileName}`, // 备用路径2
      `./src/assets/tietu/B/${fileName}` // 备用路径3
    ]
    
    const mainPath = possiblePaths.shift()!
    tryLoadTexture(mainPath, possiblePaths)
  }
  


  
    // 初始化Three.js
  const initThree = async () => {
    if (!containerRef.value) return

    try {
      // 创建场景
      scene = new THREE.Scene()
      // 移除场景背景，保持透明
      scene.background = null
      // 确保没有雾效
      scene.fog = null
      // 确保没有环境贴图
      scene.environment = null

      // 创建相机
      const container = containerRef.value
      camera = new THREE.PerspectiveCamera(
        50, // 减小视野角度，让模型看起来更合适
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      )
      camera.position.set(cameraPosition.value.x, cameraPosition.value.y, cameraPosition.value.z) // 使用响应式数据中的相机位置

      // 创建渲染器
      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true, // 启用透明背景
        preserveDrawingBuffer: true, // 用于截图
        premultipliedAlpha: false // 确保透明度正确处理
      })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      // 禁用色调映射，避免颜色偏移
      renderer.toneMapping = THREE.NoToneMapping
      renderer.toneMappingExposure = 1.0  // 标准曝光度
      renderer.outputColorSpace = THREE.SRGBColorSpace
      // 设置完全透明背景
      renderer.setClearColor(0x000000, 0) // 完全透明
      // 禁用任何可能的颜色处理
      renderer.autoClear = true
      renderer.autoClearColor = true
      renderer.autoClearDepth = true
      renderer.autoClearStencil = true
      // 确保canvas元素也是透明的
      renderer.domElement.style.background = 'transparent'
      renderer.domElement.style.opacity = '1'
      container.appendChild(renderer.domElement)
  
      // 创建控制器
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.enableZoom = true
      controls.enablePan = false
      controls.maxDistance = 10
      controls.minDistance = 2
  
      // 添加光照
      setupLighting()
  
      // 加载模型
      await loadShoeModel()
  
      // 开始渲染循环
      animate()
  
      // 设置响应式
      setupResponsive()
  
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
    // 环境光 - 使用白光，避免色彩偏移
    ambientLight = new THREE.AmbientLight(0xffffff, lightingIntensity.value.ambient)
    scene.add(ambientLight)

    // 主光源 - 使用纯白光
    directionalLight = new THREE.DirectionalLight(0xffffff, lightingIntensity.value.directional)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // 补充光源 - 使用纯白光
    fillLight = new THREE.DirectionalLight(0xffffff, lightingIntensity.value.fill)
    fillLight.position.set(-5, 0, -5)
    scene.add(fillLight)
    
    // 添加顶部光源
    topLight = new THREE.DirectionalLight(0xffffff, lightingIntensity.value.additional)
    topLight.position.set(0, 10, 0)
    scene.add(topLight)
    
    // 添加底部光源
    bottomLight = new THREE.DirectionalLight(0xffffff, lightingIntensity.value.additional * 0.8)
    bottomLight.position.set(0, -10, 0)
    scene.add(bottomLight)
    
    // 添加左侧光源
    leftLight = new THREE.DirectionalLight(0xffffff, lightingIntensity.value.additional)
    leftLight.position.set(-10, 0, 0)
    scene.add(leftLight)
    
    // 添加右侧光源
    rightLight = new THREE.DirectionalLight(0xffffff, lightingIntensity.value.additional)
    rightLight.position.set(10, 0, 0)
    scene.add(rightLight)
    
    // 添加前方聚光灯
    spotLight = new THREE.SpotLight(0xffffff, lightingIntensity.value.directional * 0.8, 100, Math.PI / 6, 0.5)
    spotLight.position.set(0, 0, 15)
    spotLight.target.position.set(0, 0, 0)
    spotLight.castShadow = true
    scene.add(spotLight)
    scene.add(spotLight.target)
  }
  
  // 修改加载鞋子模型函数
  const loadShoeModel = async () => {
    const loader = new GLTFLoader()
    
    return new Promise((resolve, reject) => {
      loader.load(
        '/xie.gltf',
        (gltf) => {
          shoeModel = gltf.scene
          
          // 设置模型属性 - 放大3倍
          shoeModel.scale.set(11, 11, 11)
          shoeModel.position.set(0, 0, 0)
          
          // 遍历模型，设置材质和阴影
          let meshIndex = 0
          shoeModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // 保存原始材质到userData
              if (child.material) {
                child.userData.originalMaterial = child.material.clone()
              }
              
              child.castShadow = true
              child.receiveShadow = true
              
              // 确保材质没有额外的颜色偏移
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((mat) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      // 重置可能的颜色偏移
                      mat.envMapIntensity = 0 // 移除环境反射
                    }
                  })
                } else if (child.material instanceof THREE.MeshStandardMaterial) {
                  // 重置可能的颜色偏移
                  child.material.envMapIntensity = 0 // 移除环境反射
                }
                child.material.needsUpdate = true
              }
              
              meshList.value.push({ name: child.name || `Mesh ${meshIndex}`, index: meshIndex, mesh: child })
              meshIndex++
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
    cameraPosition.value = { x: 0, y: 0, z: 5 }
    updateCameraPosition()
    controls.reset()
    if (shoeModel) {
      shoeModel.rotation.set(0, 0, 0)
    }
    
    // 重置灯光强度
    lightingIntensity.value = {
      ambient: 3.0,
      directional: 3.0,
      fill: 2.0,
      additional: 1.5
    }
    updateLightingIntensity()
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
    
    // 监听屏幕方向变化
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100) // 延迟处理，确保新尺寸生效
    })
  }
  


  // 颜色映射表
  const colorMapping: Record<string, { name: string, color: string }> = {
    // A区域颜色
    'A6C.png': { name: '深棕', color: '#8B4513' },
    'A5C.png': { name: '玫瑰红', color: '#DC143C' },
    'A4C.png': { name: '薄荷绿', color: '#98FB98' },
    'A3C.png': { name: '纯白', color: '#FFFFFF' },
    'A2C.png': { name: '帝王棕', color: '#8B7355' },
    'AC.png': { name: '琥珀棕', color: '#D2691E' },
    
    // B区域颜色
    'B6C.png': { name: '百里茶', color: '#8B7D6B' },
    'B5C.png': { name: '栗紫', color: '#722F37' },
    'B4C.png': { name: '红褐', color: '#A0522D' },
    'B3C.png': { name: '柳绿', color: '#9ACD32' },
    'B2C.png': { name: '奶白', color: '#FDF5E6' },
    'BC.png': { name: '常春', color: '#D2B48C' }
  }

  // 获取颜色名称
  const getColorName = (folder: 'A' | 'B', textureName: string) => {
    const mapping = colorMapping[textureName]
    return mapping ? mapping.name : textureName.replace('.png', '')
  }

  // 获取颜色
  const getColorForTexture = (folder: 'A' | 'B', textureName: string) => {
    const mapping = colorMapping[textureName]
    return mapping ? mapping.color : '#CCCCCC'
  }

  // 定制完成
  const completeCustomization = () => {
    alert('定制完成！')
    // 可以选择保存当前的鞋子模型或贴图设置
    // 例如，将当前的贴图应用到实际的鞋子模型
    // 或者将当前的贴图保存为新的模型
    console.log('当前选中的A贴图:', selectedATexture.value)
    console.log('当前选中的B贴图:', selectedBTexture.value)
    console.log('当前相机位置:', cameraPosition.value)
    console.log('当前灯光强度:', lightingIntensity.value)
    console.log('当前动画状态:', isAnimating.value)

  }
  
  // 生命周期
  onMounted(async () => {
    await nextTick()
    initThree()
    
    // 将Mesh操作函数添加到全局，方便控制台调用
    ;(window as any).getMeshByIndex = getMeshByIndex
    ;(window as any).getMeshByName = getMeshByName
        ;(window as any).meshList = meshList
    ;(window as any).switchToATexture = switchToATexture
    ;(window as any).switchToBTexture = switchToBTexture
    ;(window as any).getColorName = getColorName
    ;(window as any).getColorForTexture = getColorForTexture
    ;(window as any).completeCustomization = completeCustomization

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
  /* 控制面板滚动条样式 */
  .control-panel::-webkit-scrollbar {
    width: 6px;
  }
  
  .control-panel::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .control-panel::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    transition: background 0.2s;
  }
  
  .control-panel::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
  
  /* 滑块样式 */
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
    box-shadow: 0 0 2px rgba(0,0,0,0.3);
  }
  
  .slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 2px rgba(0,0,0,0.3);
  }
  
  .slider::-webkit-slider-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: #ddd;
    border-radius: 4px;
  }
  
  .slider::-moz-range-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: #ddd;
    border-radius: 4px;
    border: none;
  }
  
    /* 移动端适配 */
  @media (max-width: 768px) {
    /* 确保3D视窗在移动端有合适的高度 */
    .relative > div[ref="containerRef"] {
      height: calc(100vh - 300px) !important;
      min-height: 300px !important;
    }

    /* 底部面板在移动端的样式调整 */
    .absolute.bottom-0 {
      max-height: 60vh !important;
      overflow-y: auto !important;
    }

    /* 颜色选择器在移动端稍小一些 */
    .w-12.h-12 {
      width: 2.5rem !important;
      height: 2.5rem !important;
    }

    /* 调整颜色选择器间距 */
    .space-x-4 > * + * {
      margin-left: 0.75rem !important;
    }

    /* 调整按钮高度 */
    .py-4 {
      padding-top: 0.75rem !important;
      padding-bottom: 0.75rem !important;
    }
  }

  /* 小屏幕适配 */
  @media (max-width: 480px) {
    /* 进一步减小3D视窗高度 */
    .relative > div[ref="containerRef"] {
      height: calc(100vh - 350px) !important;
      min-height: 250px !important;
    }

    /* 颜色选择器更小 */
    .w-12.h-12 {
      width: 2rem !important;
      height: 2rem !important;
    }

    /* 减小间距 */
    .space-x-4 > * + * {
      margin-left: 0.5rem !important;
    }

    .space-y-6 > * + * {
      margin-top: 1rem !important;
    }

    /* 调整内边距 */
    .p-6 {
      padding: 1rem !important;
    }

    /* 调整字体大小 */
    .text-lg {
      font-size: 1rem !important;
    }

    /* 调整按钮文字大小 */
    .text-lg.font-semibold {
      font-size: 1rem !important;
    }
  }

  /* 横屏适配 */
  @media (orientation: landscape) and (max-height: 600px) {
    .relative > div[ref="containerRef"] {
      height: 50vh !important;
      min-height: 200px !important;
    }

    .absolute.bottom-0 {
      max-height: 45vh !important;
    }
  }

  /* 触摸设备优化 */
  @media (hover: none) and (pointer: coarse) {
    /* 触摸设备上的按钮反馈 */
    .cursor-pointer:active {
      transform: scale(0.95) !important;
      transition: transform 0.1s !important;
    }

    /* 颜色选择器的触摸反馈 */
    .w-12.h-12:active {
      transform: scale(0.9) !important;
    }

    /* 移除hover效果 */
    .hover\:border-gray-400:hover {
      border-color: inherit !important;
    }

    .hover\:from-orange-500:hover {
      background-image: inherit !important;
    }
  }

  /* 确保滚动条样式 */
  .overflow-y-auto::-webkit-scrollbar {
    width: 4px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }

  /* 确保白色颜色有边框可见性 */
  .w-12.h-12[style*="background-color: rgb(255, 255, 255)"],
  .w-12.h-12[style*="background-color: #FFFFFF"],
  .w-12.h-12[style*="background-color: #FDF5E6"] {
    border: 4px solid #e5e5e5 !important;
  }

  /* 无障碍适配 */
  @media (prefers-reduced-motion: reduce) {
    .animate-spin {
      animation: none !important;
    }
    
    .transition-all {
      transition: none !important;
    }

    .transform {
      transform: none !important;
    }
  }

  /* 高对比度模式支持 */
  @media (prefers-contrast: high) {
    .bg-gradient-to-b {
      background: #f5f5f5 !important;
    }

    .text-gray-600 {
      color: #000000 !important;
    }

    .border-gray-300 {
      border-color: #000000 !important;
    }
  }
  </style> 