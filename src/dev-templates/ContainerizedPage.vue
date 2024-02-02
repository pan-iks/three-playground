<template>
  <q-page>
    <div class="q-pa-md">
      containerized
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
import { onMounted } from 'vue'
// three imports
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
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

//  ------------------------------------------------------------------------------------------ setup Scene
let sphere
const setupScene = () => {
  // Vytvoření krychle
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0xff9900 })
  sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)
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
  setupScene()

  animate()
})

/*
raycasting in ncontainerized
const rect = renderer.domElement.getBoundingClientRect();
mouse.x = ( ( event.clientX - rect.left ) / ( rect. right - rect.left ) ) * 2 - 1;
mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
*/
</script>
