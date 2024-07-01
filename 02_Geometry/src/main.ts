import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import './style.css'

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
    this.setupControls()
  }

  private setupCamera(){
    const width = this.domApp.clientWidth
    const height = this.domApp.clientHeight
    
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100)
    this.camera.position.z = 2  // (0, 0, 2)
  }

  private setupLight(){
    const lights = [] //광원 배열로 변경
    for(let i = 0; i < 3; i++){
      lights[i] = new THREE.DirectionalLight(0xffffff, 3)
      this.scene.add(lights[i])
    }

    lights[0].position.set(0, 200, 0)
    lights[1].position.set(100, 200, 100)
    lights[2].position.set(-100, -200, -100)
  }

  private setupControls(){
    new OrbitControls(this.camera!, this.domApp! as HTMLElement)  // 카메라와, 마우스 이벤트를 수행할 DOM 객체
  }

  private setupModels(){
    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      flatShading: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: .75
    })

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true, 
      opacity: 0.8
    })

    const geometry = new THREE.BoxGeometry(1, 1, 1)

    const mesh = new THREE.Mesh(geometry, meshMaterial)

    const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial)

    const group = new THREE.Group()
    group.name = "cube"
    group.add(mesh, line)

    this.scene.add(group)
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

  //three.js 에서 제공하는 control을 사용
  private update(time: number){
    time *= 0.001 // ms -> s 단위로 변경

    // const cube = this.scene.getObjectByName("cube")
    // if(cube) {
    //   cube.rotation.x = time 
    //   cube.rotation.y = time
    // }
    // console.log(time);
  }
  

  private render(time: number){
    // time : setAnimationLoop의 값에 의해서 결정되는데 단위는 ms
    this.update(time)

    this.renderer.render(this.scene, this.camera!)
  }
}

new App()