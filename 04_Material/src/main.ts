import * as THREE from 'three'
import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js'
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
    const texture = textureLoader.load("./uv_grid_opengl.jpg")
    texture.colorSpace = THREE.SRGBColorSpace

    texture.repeat.x = 1  //default 1
    texture.repeat.y = 1  //default 1

    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping

    texture.offset.x = 0  // UV 좌표의 시작 위치
    texture.offset.y = 0  // UV 좌표의 시작 위치

    // texture.rotation = THREE.MathUtils.degToRad(45)
    // texture.center.x = 0.5
    // texture.center.y = 0.5

    texture.magFilter = THREE.LinearFilter // Texture 이미지 원래 크기보다 더 축소되어 렌더링 될 때 쓰는 필터
    //texture.minFilter = THREE.LinearMipMapLinearFilter;  // Texture 이미지 원래 크기보다 더 축소되어 렌더링 될 때 쓰는 필터
    //texture.minFilter = THREE.NearestFilter;
    //texture.minFilter = THREE.LinearFilter;
    //texture.minFilter = THREE.NearestMipmapNearestFilter
    //texture.minFilter = THREE.LinearMipmapNearestFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter

    const material = new THREE.MeshStandardMaterial({
      map: texture
    })

    const geomBox = new THREE.BoxGeometry(1, 1, 1)
    const box = new THREE.Mesh(geomBox, material)
    box.position.x = -1
    this.scene.add(box)

    const geomSphere = new THREE.SphereGeometry(0.6)
    const sphere = new THREE.Mesh(geomSphere, material)
    sphere.position.x = 1
    this.scene.add(sphere)
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