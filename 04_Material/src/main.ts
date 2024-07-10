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
    this.camera.position.z = 2  // (0, 0, 2)

    new OrbitControls(this.camera, this.domApp as HTMLElement)
  }

  private setupLight() {
    /** HDRI */
    const rgbeLoader = new RGBELoader()  //HDRI를 사용하기 위한 로더 객체
    rgbeLoader.load('./red_hill_cloudy_4k.hdr', (environmentMap) => {
      environmentMap.mapping = THREE.EquirectangularRefractionMapping
      this.scene.background = environmentMap
      this.scene.environment = environmentMap
    })
  }

  private setupModels() {
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      emissive: 0x00000,  // 광원의 영향을 받지 않고 재질이 방출하는 color. default black
      roughness: 0,       // 표면 거칠기 속성 (0~1 사이)
      metalness: 0,       // 금속성 (0~1). 값1은 완전한 금속
      clearcoat: 0,       // 모델 표면의 코팅 효과 (0~1 사이)
      clearcoatRoughness: 0,  // 코팅의 거칠기 값 (0~1 사이)
      transmission: 0,        // 투명한 정도 
      ior: 1.5,               // 굴절률
      thickness: 0.1,         // 유리의 두께
      sheen: 0,               // 비단이나 fabric 원단의 실루엣처럼 빛나는 효과
      sheenRoughness: 0,      // 실루엣이 빛나는 정도 조절
      sheenColor: 0xfffff,    // 실루엣의 색상
      iridescence: 0,         // 무지개색 효과의 강도 조절
      iridescenceIOR: 0,       // 무지개색 효과가 발생하는 굴절률 조절
      iridescenceThicknessRange: [100, 800],    // 무지개색 효과가 나타나는 두께 범위

      flatShading: false,    // Mesh를 이루는 면을 평평하게 표현할지 여부
      wireframe: false,  // wireframe 옵션
      visible: true,     // 렌더링 시 모델이 보일지 안보일지
      transparent: false, // opacity 옵션을 사용할지 여부
      opacity: 1,      // material의 불투명 (0~1)
      depthTest: true,  // 렌더링 되고있는 Mesh를 표현하는 픽셀의 z값과 depth버퍼에 저장된 동일한 위치의 z값을 비교 검사할지 여부
      depthWrite: true,  // 렌더링 되고있는 Mesh의 픽셀에 대한 z값을 depth버퍼에 저장할 것인지 여부
      side: THREE.FrontSide // 앞면 or 뒷면 or 양면 렌더링 옵션 (default FrontSide)
    })

    const gui = new GUI()
    gui.addColor(material, "color").onChange(v => material.color = v)
    gui.addColor(material, "emissive").onChange(v => material.color = v)
    gui.add(material, "roughness", 0, 1, 0.01)
    gui.add(material, "metalness", 0, 1, 0.01)
    gui.add(material, "clearcoat", 0, 1, 0.01)
    gui.add(material, "clearcoatRoughness", 0, 1, 0.01)
    gui.add(material, "transmission", 0, 1, 0.01)
    gui.add(material, "ior", 1, 2.333, 0.01)
    gui.add(material, "thickness", 0, 10, 0.01)
    gui.add(material, "sheen", 0, 1, 0.01)
    gui.add(material, "sheenRoughness", 0, 1, 0.01)
    gui.addColor(material, "sheenColor").onChange(v => material.sheenColor = new THREE.Color(v))
    gui.add(material, "iridescence", 0, 1, 0.01)
    gui.add(material, "iridescenceIOR", 1, 2.333, 0.01)
    gui.add(material.iridescenceThicknessRange, "0", 1, 1000, 1)
    gui.add(material.iridescenceThicknessRange, "1", 1, 1000, 1)

    const geomCylinder = new THREE.CylinderGeometry(0.6, 0.9, 1.2, 64, 1)
    const cylinder = new THREE.Mesh(geomCylinder, material)
    cylinder.position.x = -1
    this.scene.add(cylinder)

    const geomTorusknot = new THREE.TorusKnotGeometry(0.4, 0.18, 128, 64)
    const torusknot = new THREE.Mesh(geomTorusknot, material)
    torusknot.position.x = 1
    this.scene.add(torusknot)
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