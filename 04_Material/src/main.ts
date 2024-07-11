import * as THREE from 'three'
import { OrbitControls, RGBELoader, VertexNormalsHelper } from 'three/examples/jsm/Addons.js'
import './style.css'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

class App {
  private renderer: THREE.WebGLRenderer //Renderer Field 추가
  private domApp: Element
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera //?를 붙이면 PerspectiveCamera Type이나 Undefined Type을 가질 수 있음.(Optional Properties)

  constructor() {
    console.log("YooHwanIhn");
    this.renderer = new THREE.WebGLRenderer({ antialias: true }) // 안티-알리아스 : 높은 렌더링 결과를 얻기 위해 픽셀 사이에 계단 현상을 방지하는 효과 추가
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)) // 고해상도에서 깨짐 방지를 위해 픽셀 비율 지정

    this.domApp = document.querySelector('#app')!
    this.domApp.appendChild(this.renderer.domElement) // renderer.domeElement : canvas Type의 DOM 객체

    this.scene = new THREE.Scene()

    this.setupCamera()
    this.setupLight()
    this.setupModels()
    this.setupEvents()
  }

  private setupCamera() {
    const width = this.domApp.clientWidth
    const height = this.domApp.clientHeight

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
    this.camera.position.z = 4  // (0, 0, 4)

    new OrbitControls(this.camera, this.domApp as HTMLElement)
  }

  private setupLight() {
    // const light = new THREE.DirectionalLight(0xffffff, 1)
    // light.position.set(1,2,1)
    // this.scene.add(light)

    /** HDRI */
    const rgbeLoader = new RGBELoader()  //HDRI를 사용하기 위한 로더 객체
    rgbeLoader.load('./red_hill_cloudy_4k.hdr', (environmentMap) => {
      environmentMap.mapping = THREE.EquirectangularRefractionMapping
      this.scene.background = environmentMap
      this.scene.environment = environmentMap
    })
  }

  private setupModels() {
    const textureLoader = new THREE.TextureLoader() // three.js는 이미지를 로드할 때 텍스쳐 타입으로 해야함
    
    const map = textureLoader.load("./Glass_Window_002_basecolor.jpg")
    map.colorSpace = THREE.SRGBColorSpace

    const mapAO = textureLoader.load("./Glass_Window_002_ambientOcclusion.jpg")
    const mapHeight = textureLoader.load("./Glass_Window_002_height.png")
    const mapNormal = textureLoader.load("./Glass_Window_002_normal.jpg")
    const mapRoughness = textureLoader.load("./Glass_Window_002_roughness.jpg")
    const mapMetalic = textureLoader.load("./Glass_Window_002_metallic.jpg")
    const mapAlpha = textureLoader.load("./Glass_Window_002_opacity.jpg")

    const material = new THREE.MeshStandardMaterial({
      map: map,
      normalMap: mapNormal,
      normalScale: new THREE.Vector2(1, 10),
      displacementMap: mapHeight,
      displacementScale: 0.2,  //default 1
      displacementBias: -0.15,
      aoMap: mapAO,
      aoMapIntensity: 1, //aoMap 강도
    })

    const geomBox = new THREE.BoxGeometry(1, 1, 1, 256, 256, 256)
    const box = new THREE.Mesh(geomBox, material)
    box.position.x = -1
    this.scene.add(box)

    const geomSphere = new THREE.SphereGeometry(0.6, 512, 256)
    const sphere = new THREE.Mesh(geomSphere, material)
    sphere.position.x = 1
    this.scene.add(sphere)

    //const boxHelper = new VertexNormalsHelper(box, 0.1, 0xffff00)
    //this.scene.add(boxHelper)

    //const sphereHelper = new VertexNormalsHelper(sphere, 0.1, 0xffff00)
    //this.scene.add(sphereHelper)
  }

  //실제 이벤트와 렌더링 처리를 다룰 메서드
  private setupEvents() {
    window.onresize = this.resize.bind(this); // html의 size가 변경될 때마다 호출되는 함수(addEventListener 느낌??)
    this.resize();

    this.renderer.setAnimationLoop(this.render.bind(this)) // 연속적으로 render 메서드 호출(모니터 Frame에 맞게)
  }

  // html창 resize시 호출할 함수
  private resize() {
    const width = this.domApp.clientWidth
    const height = this.domApp.clientHeight

    //앞선 setUpCamera에서 설정한 camera 정보를 다시 수정해줌.
    const camera = this.camera
    if (camera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix() // 카메라의 값이 변경되었다면 수정하도록 함.
    }

    //renderer도 마찬가지로 사이즈 수정함
    this.renderer.setSize(width, height)
  }

  private update(time: number) {
    time *= 0.001 // ms -> s 단위로 변경
  }

  private render(time: number) {
    // time : setAnimationLoop의 값에 의해서 결정되는데 단위는 ms
    this.update(time)

    this.renderer.render(this.scene, this.camera!)
  }
}

new App()