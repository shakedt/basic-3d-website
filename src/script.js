import * as THREE from 'three'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#b31973'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        mat.color.set(parameters.materialColor)
    })

    const cursor = { 
        x: 0,
        y: 0
    }

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Texture 
const textureLoader  = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

const objectDistance = 4;

const mat = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
})
const mesh1 = new THREE.Mesh(   
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    mat
)
const mesh2 = new THREE.Mesh(   
    new THREE.ConeGeometry(1,2 ,32),
    mat

)
const mesh3 = new THREE.Mesh(   
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    mat
)

mesh1.position.y = - objectDistance * 0
mesh2.position.y = - objectDistance * 1
mesh3.position.y = - objectDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

const sectionMeshes = [mesh1, mesh2, mesh3]
scene.add(mesh1, mesh2, mesh3);

// particels
const particelsCount = 2000;
const positions = new Float32Array(particelsCount * 3)
const colors = new Float32Array(particelsCount * 3)

for(let i = 0; i < particelsCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * 3 * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10

    colors[i * 3 + 0] = Math.random()
    colors[i * 3 + 1] = Math.random()
    colors[i * 3 + 2] = Math.random()
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
const material = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    vertexColors: true
})
const points = new THREE.Points(geometry, material)
scene.add(points)

const directLight = new THREE.DirectionalLight('#ffffff', 3);
directLight.position.set(1, 0, 0)
scene.add(directLight)

// /**
//  * Test cube
//  */

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const cameraGorup = new THREE.Group()
scene.add(cameraGorup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)

camera.position.z = 6
cameraGorup.add(camera)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY
});

window.addEventListener('mousemove', (data) => {
    cursor.x = ( data.clientX / sizes.width ) - 0.5
    cursor.y = (data.clientY / sizes.height) - 0.5
});

/**
 * Animate
 */
const clock = new THREE.Clock()
let previusTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previusTime;
    previusTime = elapsedTime;
    // Animate meshes
    for(let mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.12
    }

   
    // Animate camera

    camera.position.y =  - (scrollY / sizes.height) * objectDistance
    const parallaxX = cursor.x * 0.5
    const parallayY = - cursor.y * 0.5
    cameraGorup.position.x +=  (parallaxX - cameraGorup.position.x) * 5 * deltaTime
    cameraGorup.position.y += (parallayY - cameraGorup.position.y) * 5 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()