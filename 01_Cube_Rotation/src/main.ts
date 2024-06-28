import './style.css'
import * as THREE from 'three'

class App {
  private renderer: THREE.WebGLRenderer //Renderer Field 추가
  private domApp: Element 
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera //?를 붙이면 PerspectiveCamera Type이나 Undefined Type을 가질 수 있음.(Optional Properties)
  private cube?: THREE.Mesh

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
    const geometry = new THREE.BoxGeometry(1, 1, 1) // 정육면체
    const material = new THREE.MeshPhongMaterial({color : 0x44aa88})

    //생성한 geometry와 material 객체로 모델 생성
    this.cube = new THREE.Mesh(geometry,material)
    this.scene.add(this.cube)
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

    const cube = this.cube
    if(cube) {
      cube.rotation.x = time 
      cube.rotation.y = time
    }
    //console.log(time);
  }

  private render(time: number){
    // time : setAnimationLoop의 값에 의해서 결정되는데 단위는 ms
    this.update(time)

    this.renderer.render(this.scene, this.camera!)
  }
}

new App()