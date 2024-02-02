<template>
  <div
    id="three-container"
    class="fixed-top-left"
    style="width: 100dvw; height: 100dvh; /* z-index: 99999; */"
  />
  <div
    id="three-stats"
    class="fixed-top-left"
    style=" z-index: 99999;"
  />
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
// three imports
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

//  ------------------------------------------------------------------------------------------ setup Infrastructure
let renderer
let scene
let camera
let controls
let stats
const setupInfrastructure = () => {
  // Vytvoření rendereru
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  // Vytvoření scény
  scene = new THREE.Scene()
  // Vytvoření kamery
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5
  // controls
  controls = new OrbitControls(camera, renderer.domElement)
  // stats
  stats = new Stats()
  // add to dom
  document.getElementById('three-container').appendChild(renderer.domElement)
  document.getElementById('three-stats').appendChild(stats.dom)
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

</script>
