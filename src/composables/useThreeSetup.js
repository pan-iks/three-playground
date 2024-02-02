import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

export default function useThreeSetup () {
  let renderer
  let scene
  let camera
  let controls
  let stats

  const containerWidth = ref(0)
  const containerHeight = ref(0)

  const setupInfrastructure = () => {
    const container = document.getElementById('three-container')
    containerWidth.value = container.offsetWidth
    containerHeight.value = container.offsetHeight

    // Vytvoření rendereru
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(containerWidth.value, containerHeight.value)

    // Vytvoření scény
    scene = new THREE.Scene()

    // Vytvoření kamery
    camera = new THREE.PerspectiveCamera(75, containerWidth.value / containerHeight.value, 0.1, 1000)
    camera.position.z = 5

    // controls
    controls = new OrbitControls(camera, renderer.domElement)

    // stats
    stats = new Stats()

    // add to dom
    container.appendChild(renderer.domElement)
    document.getElementById('three-stats').appendChild(stats.dom)

    window.addEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {
    containerWidth.value = document.getElementById('three-container').offsetWidth
    containerHeight.value = document.getElementById('three-container').offsetHeight

    camera.aspect = containerWidth.value / containerHeight.value
    camera.updateProjectionMatrix()

    renderer.setSize(containerWidth.value, containerHeight.value)
  }

  onMounted(() => {
    setupInfrastructure()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize)
  })

  return {
    containerWidth,
    containerHeight,
    scene,
    camera,
    controls,
    renderer,
    stats
  }
}
