import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import './style.css'

class App {
  private renderer: THREE.WebGLRenderer //Renderer Field 추가
  private domApp: Element 
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera //?를 붙이면 PerspectiveCamera Type이나 Undefined Type을 가질 수 있음.(Optional Properties)

  constructor(){
    console.log("YooHwanIhn");
    this.renderer = new THREE.WebGLRenderer({antialias:true}) // 안티-알리아스 : 높은 렌더링 결과를 얻기 위해 픽셀 사이에 계단 현상을 방지하는 효과 추가
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)) // 고해상도에서 깨짐 방지를 위해 픽셀 비율 지정

    this.domApp = document.querySelector('#app')! 
    this.domApp.appendChild(this.renderer.domElement) // renderer.domeElement : canvas Type의 DOM 객체

    this.scene = new THREE.Scene()

    this.setupCamera()
    this.setupLight()
    this.setupModels()
    this.setupEvents()
  }

  private setupCamera(){
    const width = this.domApp.clientWidth
    const height = this.domApp.clientHeight
    
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100)
    this.camera.position.z = 2  // (0, 0, 2)

    new OrbitControls(this.camera, this.domApp as HTMLElement)
  }

  private setupLight(){
    //빛의 색상 값과 빛의 강도
    const color = 0xffffff  // white
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)  //광원
    light.position.set(-1, 2, 4)

    this.scene.add(light)
  }

  private setupModels(){
    const material = new THREE.MeshLambertMaterial({
      color: '#d25383',
      emissive: 0x555500,
      wireframe: false,  // wireframe 옵션

      visible: true,     // 렌더링 시 모델이 보일지 안보일지
      transparent: false, // opacity 옵션을 사용할지 여부
      opacity: 1,      // material의 불투명 (0~1)
      depthTest: true,  // 렌더링 되고있는 Mesh를 표현하는 픽셀의 z값과 depth버퍼에 저장된 동일한 위치의 z값을 비교 검사할지 여부
      depthWrite: true,  // 렌더링 되고있는 Mesh의 픽셀에 대한 z값을 depth버퍼에 저장할 것인지 여부
      side: THREE.FrontSide
    })

    const geomCylinder = new THREE.CylinderGeometry(0.6, 0.9, 1.2, 64, 1)
    const cylinder = new THREE.Mesh(geomCylinder, material)
    cylinder.position.x = -1
    this.scene.add(cylinder)

    const geomTorusknot = new THREE.TorusKnotGeometry(0.4 ,0.18, 128, 64)
    const torusknot = new THREE.Mesh(geomTorusknot,material)
    torusknot.position.x = 1
    this.scene.add(torusknot) 
  }

  //실제 이벤트와 렌더링 처리를 다룰 메서드
  private setupEvents(){
    window.onresize = this.resize.bind(this); // html의 size가 변경될 때마다 호출되는 함수(addEventListener 느낌??)
    this.resize();

    this.renderer.setAnimationLoop(this.render.bind(this)) // 연속적으로 render 메서드 호출(모니터 Frame에 맞게)
  }

  // html창 resize시 호출할 함수
  private resize(){
    const width = this.domApp.clientWidth
    const height = this.domApp.clientHeight

    //앞선 setUpCamera에서 설정한 camera 정보를 다시 수정해줌.
    const camera = this.camera
    if(camera){
      camera.aspect = width / height
      camera.updateProjectionMatrix() // 카메라의 값이 변경되었다면 수정하도록 함.
    }

    //renderer도 마찬가지로 사이즈 수정함
    this.renderer.setSize(width, height)
  }

  private update(time: number){
    time *= 0.001 // ms -> s 단위로 변경
  }

  private render(time: number){
    // time : setAnimationLoop의 값에 의해서 결정되는데 단위는 ms
    this.update(time)

    this.renderer.render(this.scene, this.camera!)
  }
}

new App()