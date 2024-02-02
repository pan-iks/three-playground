<template>
  <q-page>
    <div class="q-pa-md">
      containerized<br>
      {{ showLoading }} xx

      <div
        v-if="showLoading"
        class="loading bg-red"
      >
        {{ totalProgress }}
      </div>
      <div>
        <q-responsive
          :ratio="500/300"
        >
          <div
            class="scene-container"
            style="position: relative; width: 100%; height: 100%;"
          >
            <div
              id="three-container"
              class=""
              style="width: 100%; height: 100%; /* z-index: 99999; */"
            />
            <div
              id="three-stats"
              class="absolute-top-left"
              style=" z-index: 99999;"
            />
          </div>
        </q-responsive>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
// three imports
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
// three setup composables
// import useThreeSetup from '../composables/useThreeSetup'

//  ------------------------------------------------------------------------------------------ setup Infrastructure
// const { scene, camera, renderer, stats, controls } = useThreeSetup()

let renderer
let scene
let camera
let controls
let stats
const setupInfrastructure = () => {
  const container = document.getElementById('three-container')
  const containerWidth = container.offsetWidth
  const containerHeight = container.offsetHeight
  // renderer.domElement.getBoundingClientRect();
  // Vytvoření rendereru
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(containerWidth, containerHeight)
  // Vytvoření scény
  scene = new THREE.Scene()
  // Vytvoření kamery
  camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000)
  camera.position.z = 5
  // controls
  controls = new OrbitControls(camera, renderer.domElement)
  // stats
  stats = new Stats()
  // add to dom
  document.getElementById('three-container').appendChild(renderer.domElement)
  document.getElementById('three-stats').appendChild(stats.dom)

  window.addEventListener('resize', onWindowResize)
}

const onWindowResize = () => {
  const container = document.getElementById('three-container')
  const containerWidth = container.offsetWidth
  const containerHeight = container.offsetHeight

  camera.aspect = containerWidth / containerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(containerWidth, containerHeight)
}

// ------------------------------------------------------------------------------------------ loading assets
const filesToLoad = [
  { url: '/3d/models/karoqBody-1.fbx', name: 'karoq', type: 'fbx' },
  { url: '', name: 'envTxt', type: 'cubeTexture', cubeItems: ['/3d/textures/env-cube/skyboxsun25deg/px.jpg', '/3d/textures/env-cube/skyboxsun25deg/nx.jpg', '/3d/textures/env-cube/skyboxsun25deg/py.jpg', '/3d/textures/env-cube/skyboxsun25deg/ny.jpg', '/3d/textures/env-cube/skyboxsun25deg/pz.jpg', '/3d/textures/env-cube/skyboxsun25deg/nz.jpg'] },

  { url: '', name: 'envCity', type: 'cubeTexture', cubeItems: ['/3d/textures/env-cube/nightCity/px.jpg', '/3d/textures/env-cube/nightCity/nx.jpg', '/3d/textures/env-cube/nightCity/py.jpg', '/3d/textures/env-cube/nightCity/ny.jpg', '/3d/textures/env-cube/nightCity/pz.jpg', '/3d/textures/env-cube/nightCity/nz.jpg'] },
  { url: '', name: 'envTxt', type: 'cubeTexture', cubeItems: ['/3d/textures/env-cube/skyboxsun25deg/px.jpg', '/3d/textures/env-cube/skyboxsun25deg/nx.jpg', '/3d/textures/env-cube/skyboxsun25deg/py.jpg', '/3d/textures/env-cube/skyboxsun25deg/ny.jpg', '/3d/textures/env-cube/skyboxsun25deg/pz.jpg', '/3d/textures/env-cube/skyboxsun25deg/nz.jpg'] },
  { url: '', name: 'cubeTextureSpace', type: 'cubeTexture', cubeItems: ['/3d/textures/env-cube/MilkyWay/dark-s_px.jpg', '/3d/textures/env-cube/MilkyWay/dark-s_nx.jpg', '/3d/textures/env-cube/MilkyWay/dark-s_py.jpg', '/3d/textures/env-cube/MilkyWay/dark-s_ny.jpg', '/3d/textures/env-cube/MilkyWay/dark-s_pz.jpg', '/3d/textures/env-cube/MilkyWay/dark-s_nz.jpg'] }

]
// Vytvoření načítacího manažera
const loadingManager = new THREE.LoadingManager()
const fbxLoader = new FBXLoader(loadingManager)
const textureLoader = new THREE.TextureLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
const loadAll = async () => {
  showLoading.value = ref(true)
  const promises = []
  filesToLoad.forEach((file) => {
    if (file.url.endsWith('.jpg') || file.url.endsWith('.jpeg') || file.url.endsWith('.png') || file.url.endsWith('.gif')) {
      promises.push(loadTexture(file.url, file.name))
    } else if (file.url.endsWith('.fbx')) {
      promises.push(loadModel(file.url, file.name))
    } else if (file.type === 'cubeTexture') {
      promises.push(loadCubeTexture(file.cubeItems, file.name))
    }
  })

  try {
    showLoading.value = true
    await Promise.all(promises)
    console.log('Všechny textury a modely byly úspěšně načteny.')
    showLoading.value = false
  } catch (error) {
    console.error('Chyba při načítání textur a modelů:', error)
  }
}

const totalProgress = ref(0)
const showLoading = ref(false)
loadingManager.onProgress = function (url, loaded, total) {
  const loadingProgress = Math.round((loaded / total) * 100)
  // console.log(Math.round((loaded / total) * 100))
  // console.log(url)
  totalProgress.value = loadingProgress
}
// Funkce pro načítání textur
const textures = {}
const loadTexture = (url, name) => {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        textures[name] = texture
        resolve()
      },
      undefined,
      (error) => {
        reject(error)
      }
    )
  })
}

const cubeTextures = {}
const loadCubeTexture = (urls, name) => {
  return new Promise((resolve, reject) => {
    cubeTextureLoader.load(
      urls,
      (cubeTexture) => {
        cubeTextures[name] = cubeTexture
        resolve()
      },
      undefined,
      (error) => {
        reject(error)
      }
    )
  })
}

const models = {}
// Funkce pro načítání modelů
const loadModel = (url, name) => {
  return new Promise((resolve, reject) => {
    fbxLoader.load(
      url,
      (fbx) => {
        models[name] = fbx
        resolve()
      },
      (xhr) => {
        // Progress callback
        // const percentage = (xhr.loaded / xhr.total) * 100
        // console.log(`Načítání modelu ${name}: ${Math.round(percentage)}%`)
      },
      (error) => {
        reject(error)
      }
    )
  })
}
//  ------------------------------------------------------------------------------------------ setup Scene
let sphere
const setupScene = () => {
  // Vytvoření krychle
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0xff9900 })
  sphere = new THREE.Mesh(geometry, material)
  sphere.position.y = 0.5
  scene.add(sphere)

  const geometry2 = new THREE.PlaneGeometry(10, 10)
  const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
  const plane = new THREE.Mesh(geometry2, material2)
  plane.rotation.x = Math.PI / 2
  scene.add(plane)
}

//  ------------------------------------------------------------------------------------------ animation loop
// Funkce pro animaci
function animate () {
  // TWEEN.update()
  requestAnimationFrame(animate)
  // sphere.rotation.x += 0.01
  // sphere.rotation.y += 0.01

  renderer.render(scene, camera)
  stats.update()
  controls.update()
}

//  ------------------------------------------------------------------------------------------ mounted
onMounted(async () => {
  setupInfrastructure()
  await loadAll()

  setupScene()

  animate()
})
onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
})

/*
raycasting in ncontainerized
const rect = renderer.domElement.getBoundingClientRect();
mouse.x = ( ( event.clientX - rect.left ) / ( rect. right - rect.left ) ) * 2 - 1;
mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
*/
</script>
