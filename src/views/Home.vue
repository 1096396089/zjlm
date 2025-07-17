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
      class="control-panel absolute top-20 right-5 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-5 shadow-lg max-w-xs z-10 md:max-w-sm lg:max-w-md transition-all duration-300 max-h-[80vh] overflow-y-auto"
    >
      <!-- 相机位置控制 -->
      <div class="mb-5">
        <label class="block mb-2 font-semibold text-gray-700">相机位置:</label>
        <div class="space-y-3">
          <!-- X轴控制 -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">X轴: {{ cameraPosition.x.toFixed(1) }}</label>
            <input 
              type="range" 
              v-model.number="cameraPosition.x" 
              min="-20" 
              max="20" 
              step="0.1"
              @input="updateCameraPosition"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            >
          </div>
          <!-- Y轴控制 -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">Y轴: {{ cameraPosition.y.toFixed(1) }}</label>
            <input 
              type="range" 
              v-model.number="cameraPosition.y" 
              min="-20" 
              max="20" 
              step="0.1"
              @input="updateCameraPosition"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            >
          </div>
          <!-- Z轴控制 -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">Z轴: {{ cameraPosition.z.toFixed(1) }}</label>
            <input 
              type="range" 
              v-model.number="cameraPosition.z" 
              min="1" 
              max="30" 
              step="0.1"
              @input="updateCameraPosition"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            >
          </div>
        </div>
      </div>

      <!-- 灯光强度控制 -->
      <div class="mb-5">
        <label class="block mb-2 font-semibold text-gray-700">灯光强度:</label>
        <div class="space-y-3">
          <!-- 环境光控制 -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">环境光: {{ lightingIntensity.ambient.toFixed(1) }}</label>
            <input 
              type="range" 
              v-model.number="lightingIntensity.ambient" 
              min="0" 
              max="3" 
              step="0.1"
              @input="updateLightingIntensity"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            >
          </div>
          <!-- 主光源控制 -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">主光源: {{ lightingIntensity.directional.toFixed(1) }}</label>
            <input 
              type="range" 
              v-model.number="lightingIntensity.directional" 
              min="0" 
              max="3" 
              step="0.1"
              @input="updateLightingIntensity"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            >
          </div>
          <!-- 补充光源控制 -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">补充光: {{ lightingIntensity.fill.toFixed(1) }}</label>
            <input 
              type="range" 
              v-model.number="lightingIntensity.fill" 
              min="0" 
              max="2" 
              step="0.1"
              @input="updateLightingIntensity"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            >
          </div>
          <!-- 辅助光源控制 -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">辅助光: {{ lightingIntensity.additional.toFixed(1) }}</label>
            <input 
              type="range" 
              v-model.number="lightingIntensity.additional" 
              min="0" 
              max="1.5" 
              step="0.1"
              @input="updateLightingIntensity"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            >
          </div>
        </div>
      </div>

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

      <!-- 材质球切换控制 -->
      <div class="mb-5">
        <label class="block mb-2 font-semibold text-gray-700">材质球切换:</label>
        <div class="space-y-2">
          <!-- 材质球选择器 -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">当前材质: {{ selectedMaterial }}</label>
            <select v-model="selectedMaterial" @change="changeMaterial" class="w-full p-2 border border-gray-300 rounded bg-white text-sm">
              <option v-for="material in materialNames" :key="material" :value="material">{{ material }}</option>
            </select>
          </div>
          <!-- 材质球切换按钮 -->
          <div class="flex gap-2 flex-wrap">
            <button 
              v-for="material in materialNames" 
              :key="material"
              @click="switchToMaterial(material)" 
              :class="['px-3 py-1.5 border border-gray-300 rounded bg-white cursor-pointer text-xs transition-all duration-200 hover:bg-gray-100', selectedMaterial === material ? 'bg-blue-500 text-white border-blue-500' : '']"
            >
              {{ material }}
            </button>
          </div>
          <!-- 材质球信息显示 -->
          <div class="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div>当前材质: <span class="font-medium">{{ selectedMaterial }}</span></div>
            <div>材质总数: <span class="font-medium">{{ materialNames.length }}</span></div>
            <div>可用材质: <span class="font-medium">{{ materialNames.join(', ') }}</span></div>
            <!-- 材质颜色预览 -->
            <div class="mt-2 flex items-center gap-2">
              <span>材质颜色:</span>
              <div 
                class="w-6 h-6 rounded border border-gray-300"
                :style="{ backgroundColor: getMaterialColor(selectedMaterial) }"
              ></div>
            </div>
          </div>
          <!-- 材质信息按钮 -->
          <button @click="getMaterialInfo" class="w-full px-3 py-2 border border-gray-300 rounded bg-white cursor-pointer text-sm transition-all duration-200 hover:bg-gray-100">
            获取材质信息
          </button>
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

      <!-- 自动材质切换控制 -->
      <div class="mb-5">
        <label class="block mb-2 font-semibold text-gray-700">自动材质切换:</label>
        <button @click="toggleAutoMaterialChange" :class="['px-4 py-2 mr-2.5 mb-2.5 border border-gray-300 rounded bg-white cursor-pointer text-sm transition-all duration-200 hover:bg-gray-100', autoMaterialChange ? 'bg-green-500 text-white border-green-500' : '']">
          {{ autoMaterialChange ? '停止切换' : '开始切换' }}
        </button>
        <div class="text-xs text-gray-600 mt-2">
          {{ autoMaterialChange ? `正在自动切换材质 (${currentTextureIndex + 1}/${textureUrls.length})` : '每5秒自动切换所有Mesh的材质' }}
        </div>
      </div>

      <!-- Mesh列表 -->
      <div class="mb-5" v-if="meshList.length > 0">
        <label class="block mb-2 font-semibold text-gray-700">Mesh列表 (共{{ meshList.length }}个):</label>
        <div class="max-h-40 overflow-y-auto bg-gray-50 rounded p-2">
          <div 
            v-for="(item, index) in meshList" 
            :key="index"
            class="text-xs p-2 mb-1 bg-white rounded border hover:bg-blue-50 cursor-pointer transition-colors"
            @click="selectMesh(item.index)"
          >
            <div class="font-medium text-gray-800">{{ item.name }}</div>
            <div class="text-gray-500">索引: {{ item.index }}</div>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-600">
          点击Mesh查看控制台详细信息
        </div>
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
const cameraPosition = ref({ x: 0, y: 0, z: 5 })

const materialNames = ['A6', 'B6', 'xian', 'xiedai', 'xiedi', 'bai']
const originalMaterials: Record<string, THREE.Material> = {}

// 添加材质球切换相关变量
const selectedMaterial = ref('A6')
const materialCache: Record<string, THREE.Material> = {}

// 添加灯光强度控制
const lightingIntensity = ref({
  ambient: 1.0,
  directional: 1.2,
  fill: 0.8,
  additional: 0.5
})

// 添加Mesh列表
const meshList = ref<Array<{name: string, index: number, mesh: THREE.Mesh}>>([])

// 添加自动材质切换功能
const autoMaterialChange = ref(false)
let materialChangeTimer: number | null = null
let currentTextureIndex = 0

// 在线贴图URL数组 - 随机找一些不同类型的材质
const textureUrls = [
  'https://threejs.org/examples/textures/brick_diffuse.jpg',
  'https://threejs.org/examples/textures/brick_roughness.jpg', 
  'https://threejs.org/examples/textures/hardwood2_diffuse.jpg',
  'https://threejs.org/examples/textures/waternormals.jpg',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=512&h=512&fit=crop'
]

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

// 更新材质UV的函数
const updateMeshMaterial = (meshIndex: number, textureUrl?: string) => {
  const mesh = getMeshByIndex(meshIndex)
  if (!mesh) {
    console.warn(`找不到索引为 ${meshIndex} 的Mesh`)
    return
  }
  
  console.log(`正在更新Mesh ${meshIndex} (${mesh.name || '未命名'}) 的材质`)
  
  if (textureUrl) {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(textureUrl, (texture) => {
      // 设置贴图包装和过滤模式以获得更好的效果
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(1, 1)
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.map = texture
        mesh.material.needsUpdate = true
        console.log(`成功更新Mesh ${meshIndex} 的贴图`)
      } else if (Array.isArray(mesh.material)) {
        // 如果是材质数组，更新第一个材质
        mesh.material.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.map = texture
            mat.needsUpdate = true
          }
        })
        console.log(`成功更新Mesh ${meshIndex} 的多材质贴图`)
      }
    }, undefined, (error) => {
      console.error('贴图加载失败:', error)
    })
  }
}

// 更新所有Mesh材质的函数
const updateAllMeshMaterials = (textureUrl: string) => {
  console.log(`正在为所有Mesh更新材质: ${textureUrl}`)
  meshList.value.forEach((item) => {
    updateMeshMaterial(item.index, textureUrl)
  })
}

// 自动切换材质的函数
const autoChangeMaterials = () => {
  if (textureUrls.length === 0) return
  
  const currentTexture = textureUrls[currentTextureIndex]
  console.log(`自动切换到贴图 ${currentTextureIndex + 1}/${textureUrls.length}: ${currentTexture}`)
  
  updateAllMeshMaterials(currentTexture)
  
  // 移动到下一个贴图
  currentTextureIndex = (currentTextureIndex + 1) % textureUrls.length
}

// 开始自动材质切换
const startAutoMaterialChange = () => {
  if (materialChangeTimer) {
    clearInterval(materialChangeTimer)
  }
  
  autoMaterialChange.value = true
  console.log('开始自动材质切换，每5秒切换一次')
  
  // 立即执行一次
  autoChangeMaterials()
  
  // 设置定时器，每5秒切换一次
  materialChangeTimer = setInterval(() => {
    autoChangeMaterials()
  }, 5000)
}

// 停止自动材质切换
const stopAutoMaterialChange = () => {
  if (materialChangeTimer) {
    clearInterval(materialChangeTimer)
    materialChangeTimer = null
  }
  autoMaterialChange.value = false
  console.log('停止自动材质切换')
}

// 切换自动材质变换
const toggleAutoMaterialChange = () => {
  if (autoMaterialChange.value) {
    stopAutoMaterialChange()
  } else {
    startAutoMaterialChange()
  }
}

// 选择Mesh并输出详细信息
const selectMesh = (index: number) => {
  const mesh = getMeshByIndex(index)
  if (!mesh) {
    console.warn(`找不到索引为 ${index} 的Mesh`)
    return
  }
  
  console.log('=== 选中的Mesh详细信息 ===')
  console.log('Mesh对象:', mesh)
  console.log('名称:', mesh.name || '未命名')
  console.log('索引:', index)
  console.log('材质:', mesh.material)
  console.log('几何体:', mesh.geometry)
  console.log('UV坐标数据:', mesh.geometry.attributes.uv)
  console.log('位置:', mesh.position)
  console.log('旋转:', mesh.rotation)
  console.log('缩放:', mesh.scale)
  
  // 如果有材质，输出材质详细信息
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      console.log('多材质数组:')
      mesh.material.forEach((mat, matIndex) => {
        console.log(`材质 ${matIndex}:`, mat)
      })
    } else {
      console.log('材质类型:', mesh.material.type)
      console.log('材质UUID:', mesh.material.uuid)
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        console.log('当前贴图:', mesh.material.map)
        console.log('法线贴图:', mesh.material.normalMap)
        console.log('粗糙度贴图:', mesh.material.roughnessMap)
        console.log('金属度贴图:', mesh.material.metalnessMap)
        console.log('颜色:', mesh.material.color)
      }
    }
  }
  
  console.log('=== Mesh信息输出完成 ===')
  
  // 提供一些实用的全局函数
  console.log('💡 可用的全局函数:')
  console.log('- updateMeshMaterial(index, textureUrl): 更新指定Mesh的贴图')
  console.log('- getMeshByIndex(index): 获取指定索引的Mesh')
  console.log('- getMeshByName(name): 获取指定名称的Mesh')
}

// 材质球切换相关函数
const changeMaterial = () => {
  console.log(`切换到材质: ${selectedMaterial.value}`)
  switchToMaterial(selectedMaterial.value)
}

const switchToMaterial = (materialName: string) => {
  if (!materialNames.includes(materialName)) {
    console.warn(`材质 ${materialName} 不存在`)
    return
  }
  
  selectedMaterial.value = materialName
  console.log(`正在切换到材质: ${materialName}`)
  
  // 遍历所有Mesh，根据材质名称匹配来切换材质
  if (shoeModel) {
    let appliedCount = 0
    
    shoeModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // 检查Mesh的名称是否包含材质名称
        const meshName = child.name.toLowerCase()
        const targetMaterial = materialName.toLowerCase()
        
        // 更精确的匹配逻辑
        let shouldApply = false
        
        // 直接匹配
        if (meshName === targetMaterial) {
          shouldApply = true
        }
        // 包含匹配
        else if (meshName.includes(targetMaterial) || targetMaterial.includes(meshName)) {
          shouldApply = true
        }
        // 特殊匹配规则
        else if (materialName === 'A6' && meshName.includes('a6')) {
          shouldApply = true
        }
        else if (materialName === 'B6' && meshName.includes('b6')) {
          shouldApply = true
        }
        else if (materialName === 'xian' && meshName.includes('xian')) {
          shouldApply = true
        }
        else if (materialName === 'xiedai' && meshName.includes('xiedai')) {
          shouldApply = true
        }
        else if (materialName === 'xiedi' && meshName.includes('xiedi')) {
          shouldApply = true
        }
        else if (materialName === 'bai' && meshName.includes('bai')) {
          shouldApply = true
        }
        
        if (shouldApply) {
          console.log(`找到匹配的Mesh: ${child.name} -> ${materialName}`)
          
          // 如果缓存中没有该材质，创建一个新的材质
          if (!materialCache[materialName]) {
            // 材质属性配置
            const materialConfigs: Record<string, any> = {
              'A6': { color: 0x8B4513, roughness: 0.7, metalness: 0.1, name: 'A6' }, // 棕色皮革
              'B6': { color: 0x000000, roughness: 0.8, metalness: 0.05, name: 'B6' }, // 黑色皮革
              'xian': { color: 0xFFFFFF, roughness: 0.3, metalness: 0.9, name: 'xian' }, // 白色金属线
              'xiedai': { color: 0x8B4513, roughness: 0.6, metalness: 0.2, name: 'xiedai' }, // 棕色鞋带
              'xiedi': { color: 0x2F4F4F, roughness: 0.9, metalness: 0.0, name: 'xiedi' }, // 深灰色鞋底
              'bai': { color: 0xFFFFFF, roughness: 0.4, metalness: 0.1, name: 'bai' } // 白色材质
            }
            
            const config = materialConfigs[materialName] || { color: 0xffffff, roughness: 0.5, metalness: 0.1, name: materialName }
            const newMaterial = new THREE.MeshStandardMaterial(config)
            materialCache[materialName] = newMaterial
          }
          
          // 应用材质
          child.material = materialCache[materialName]
          child.material.needsUpdate = true
          appliedCount++
          
          console.log(`成功应用材质 ${materialName} 到Mesh ${child.name}`)
        }
      }
    })
    
    console.log(`材质切换完成，共应用了 ${appliedCount} 个Mesh`)
  }
  
  // 输出当前材质状态
  console.log(`当前选中材质: ${selectedMaterial.value}`)
  console.log(`可用材质: ${materialNames.join(', ')}`)
}

// 获取材质球信息
const getMaterialInfo = () => {
  console.log('=== 材质球信息 ===')
  console.log('当前选中:', selectedMaterial.value)
  console.log('可用材质:', materialNames)
  console.log('材质缓存:', Object.keys(materialCache))
  
  if (shoeModel) {
    console.log('模型中的Mesh材质:')
    shoeModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log(`- ${child.name}: ${child.material?.name || '未命名材质'}`)
      }
    })
  }
}

// 获取材质颜色
const getMaterialColor = (materialName: string): string => {
  const materialConfigs: Record<string, string> = {
    'A6': '#8B4513', // 棕色皮革
    'B6': '#000000', // 黑色皮革
    'xian': '#FFFFFF', // 白色金属线
    'xiedai': '#8B4513', // 棕色鞋带
    'xiedi': '#2F4F4F', // 深灰色鞋底
    'bai': '#FFFFFF' // 白色材质
  }
  
  return materialConfigs[materialName] || '#FFFFFF'
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
    camera.position.set(0, 0, 5)

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
    renderer.toneMappingExposure = 1.5  // 增加曝光度
    renderer.outputColorSpace = THREE.SRGBColorSpace
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
  // 环境光 - 增强亮度
  ambientLight = new THREE.AmbientLight(0xffffff, lightingIntensity.value.ambient)
  scene.add(ambientLight)

  // 主光源 - 增强亮度
  directionalLight = new THREE.DirectionalLight(0xffffff, lightingIntensity.value.directional)
  directionalLight.position.set(5, 5, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  // 补充光源 - 增强亮度
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
        
        // 输出所有Mesh信息
        console.log('=== 鞋子模型Mesh信息 ===')
        let meshIndex = 0
        
        // 遍历模型，设置材质和阴影，并输出详细信息
        shoeModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            console.log(`--- Mesh ${meshIndex} ---`)
            console.log('名称:', child.name || '未命名')
            console.log('类型:', child.type)
            console.log('Mesh对象:', child)
            console.log('几何体:', child.geometry)
            console.log('材质:', child.material)
            
            if (child.material) {
              if (Array.isArray(child.material)) {
                console.log('材质数组:')
                child.material.forEach((mat, index) => {
                  console.log(`  材质 ${index}:`, mat)
                  console.log(`  材质名称:`, mat.name || '未命名')
                  console.log(`  材质类型:`, mat.type)
                  if (mat.map) console.log(`  贴图:`, mat.map)
                  if (mat.normalMap) console.log(`  法线贴图:`, mat.normalMap)
                  if (mat.roughnessMap) console.log(`  粗糙度贴图:`, mat.roughnessMap)
                  if (mat.metalnessMap) console.log(`  金属度贴图:`, mat.metalnessMap)
                })
              } else {
                console.log('材质名称:', child.material.name || '未命名')
                console.log('材质类型:', child.material.type)
                if (child.material.map) console.log('贴图:', child.material.map)
                if (child.material.normalMap) console.log('法线贴图:', child.material.normalMap)
                if (child.material.roughnessMap) console.log('粗糙度贴图:', child.material.roughnessMap)
                if (child.material.metalnessMap) console.log('金属度贴图:', child.material.metalnessMap)
              }
            }
            
            console.log('位置:', child.position)
            console.log('旋转:', child.rotation)
            console.log('缩放:', child.scale)
            console.log('包围盒:', child.geometry.boundingBox)
            console.log('顶点数:', child.geometry.attributes.position?.count || 0)
            console.log('UV坐标:', child.geometry.attributes.uv ? '有' : '无')
            if (child.geometry.attributes.uv) {
              console.log('UV数据:', child.geometry.attributes.uv)
            }
            console.log('---')
            
            child.castShadow = true
            child.receiveShadow = true
            
            // 如果是鞋子主体，设置可变色材质
            if (child.material) {
              child.material.needsUpdate = true
            }
            
            meshList.value.push({ name: child.name || `Mesh ${meshIndex}`, index: meshIndex, mesh: child })
            meshIndex++
          }
        })
        
        console.log(`总共找到 ${meshIndex} 个Mesh`)
        console.log('完整模型结构:', gltf.scene)
        console.log('=== Mesh信息输出完成 ===')
        
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
  cameraPosition.value = { x: 0, y: 0, z: 5 }
  camera.position.set(0, 0, 5)
  controls.reset()
  if (shoeModel) {
    shoeModel.rotation.set(0, 0, 0)
  }
  
  // 重置灯光强度
  lightingIntensity.value = {
    ambient: 1.0,
    directional: 1.2,
    fill: 0.8,
    additional: 0.5
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
  
  // 将Mesh操作函数添加到全局，方便控制台调用
  ;(window as any).getMeshByIndex = getMeshByIndex
  ;(window as any).getMeshByName = getMeshByName
  ;(window as any).updateMeshMaterial = updateMeshMaterial
  ;(window as any).selectMesh = selectMesh
  ;(window as any).meshList = meshList
  ;(window as any).updateAllMeshMaterials = updateAllMeshMaterials
  ;(window as any).startAutoMaterialChange = startAutoMaterialChange
  ;(window as any).stopAutoMaterialChange = stopAutoMaterialChange
  ;(window as any).toggleAutoMaterialChange = toggleAutoMaterialChange
  
  // 添加材质球相关的全局函数
  ;(window as any).changeMaterial = changeMaterial
  ;(window as any).switchToMaterial = switchToMaterial
  ;(window as any).getMaterialInfo = getMaterialInfo
  ;(window as any).selectedMaterial = selectedMaterial
  ;(window as any).materialNames = materialNames
  
  console.log('🔧 已添加全局Mesh操作函数:')
  console.log('- window.getMeshByIndex(index)')
  console.log('- window.getMeshByName(name)')
  console.log('- window.updateMeshMaterial(index, textureUrl)')
  console.log('- window.selectMesh(index)')
  console.log('- window.meshList (响应式Mesh列表)')
  console.log('- window.updateAllMeshMaterials(textureUrl) (更新所有Mesh材质)')
  console.log('- window.startAutoMaterialChange() (开始自动材质切换)')
  console.log('- window.stopAutoMaterialChange() (停止自动材质切换)')
  console.log('- window.toggleAutoMaterialChange() (切换自动材质切换状态)')
  
  console.log('🎨 已添加全局材质球操作函数:')
  console.log('- window.changeMaterial() (切换到当前选中的材质)')
  console.log('- window.switchToMaterial(materialName) (切换到指定材质)')
  console.log('- window.getMaterialInfo() (获取材质球信息)')
  console.log('- window.selectedMaterial (当前选中的材质)')
  console.log('- window.materialNames (可用材质列表)')
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
  if (materialChangeTimer) {
    clearInterval(materialChangeTimer)
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
    max-height: 50vh !important;
    overflow-y: auto !important;
    padding: 15px !important;
    max-width: none !important;
    z-index: 20 !important;
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

  /* 确保控制面板在移动端可以滚动 */
  .control-panel::-webkit-scrollbar {
    width: 4px;
  }
  
  .control-panel::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }
  
  .control-panel::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }
  
  .control-panel::-webkit-scrollbar-thumb:hover {
    background: #555;
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