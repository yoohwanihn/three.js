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
    const vertices = [
      -1, 1, 0, // (-1,1,0)
      1, 1, 0,  // (1,1,0)
      -1, -1, 0,// (-1,-1,0)
      1, -1, 0  // (1,-1,0)
    ] //

    const geometry = new THREE.BufferGeometry() // 사용자 정의 Geometry는 BufferGeometry를 사용함

    geometry.setAttribute("position",
        new THREE.Float32BufferAttribute(vertices, 3)) // 하나의 값이 32비트 실수 데이터들이 저장된 Buffer 객체
    
    const material = new THREE.LineDashedMaterial({
      color: 0xffff00,
      dashSize: 0.2,
      gapSize: 0.1,
      scale: 1
    })

    const line = new THREE.LineSegments(geometry,material)
    line.computeLineDistances() //DashedMaterial Line 계산
    this.scene.add(line)
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