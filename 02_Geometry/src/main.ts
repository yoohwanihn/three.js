import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import './style.css'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

interface IGeometryHelper {
  createGeometry: () => THREE.BufferGeometry
  createGUI: (update: () => void) => void
}

class BoxGeometryHelper implements IGeometryHelper{
  private args = {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1
  }

  createGeometry() {
    return new THREE.BoxGeometry(this.args.width, this.args.height, this.args.depth, this.args.widthSegments, this.args.heightSegments, this.args.depthSegments)

  }
  createGUI(update: () => void){
    const gui = new GUI()
    gui.add(this.args, "width", 0.1, 10, 0.01).onChange(update) // width의 범위 0.1~10 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "height", 0.1, 10, 0.01).onChange(update) // height의 범위 0.1~10 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "depth", 0.1, 10, 0.01).onChange(update) // depth의 범위 0.1~10 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "widthSegments", 0.1, 10, 0.01).onChange(update) // widthSegments 범위 0.1~10 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "heightSegments", 0.1, 10, 0.01).onChange(update) // heightSegments 범위 0.1~10 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "depthSegments", 0.1, 10, 0.01).onChange(update) // depthSegments 범위 0.1~10 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
  }

}

class App {
  private renderer: THREE.WebGLRenderer //Renderer Field 추가
  private domApp: Element
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera //?를 붙이면 PerspectiveCamera Type이나 Undefined Type을 가질 수 있음.(Optional Properties)
  private cube?: THREE.Mesh

  constructor() {
    console.log("YooHwanIhn");
    this.renderer = new THREE.WebGLRenderer({ antialias: true }) // 안티-알리아스 : 높은 렌더링 결과를 얻기 위해 픽셀 사이에 계단 현상을 방지하는 효과 추가
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)) // 고해상도에서 깨짐 방지를 위해 픽셀 비율 지정

    this.domApp = document.querySelector('#app')!
    this.domApp.appendChild(this.renderer.domElement) // renderer.domeElement : canvas Type의 DOM 객체

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0x00000000, 1, 3.5); // fog 효과 추가 (grid 격자판 멀어질수록 흐리게)

    this.setupCamera()
    this.setupLight()
    this.setupModels()
    this.setupEvents()
    this.setupControls()
    this.setupHelpers()
  }

  private setupHelpers(){
    const axes = new THREE.AxesHelper(10) // 좌표축의 크기. 10
    this.scene.add(axes);

    const grid = new THREE.GridHelper(5, 20, 0xffffff, 0x444444) // grid 격자 추가
    this.scene.add(grid)
  }

  private setupCamera() {
    const width = this.domApp.clientWidth
    const height = this.domApp.clientHeight

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
    this.camera.position.z = 2  // (0, 0, 2)
  }

  private setupLight() {
    const lights = [] //광원 배열로 변경
    for (let i = 0; i < 3; i++) {
      lights[i] = new THREE.DirectionalLight(0xffffff, 3)
      this.scene.add(lights[i])
    }

    lights[0].position.set(0, 200, 0)
    lights[1].position.set(100, 200, 100)
    lights[2].position.set(-100, -200, -100)
  }

  private setupControls() {
    new OrbitControls(this.camera!, this.domApp! as HTMLElement)  // 카메라와, 마우스 이벤트를 수행할 DOM 객체
  }

  private setupModels() {
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

    const geometryHelper = new BoxGeometryHelper()

    const createModel = () => {

      const geometry = geometryHelper.createGeometry()
      
      const mesh = new THREE.Mesh(geometry, meshMaterial)

      const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial)

      const group = new THREE.Group()
      group.name = "cube"
      group.add(mesh, line)

      const oldModel = this.scene.getObjectByName("cube")

      if(oldModel){
        (oldModel.children[0] as THREE.Mesh).geometry.dispose();
        (oldModel.children[1] as THREE.LineSegments).geometry.dispose()
        this.scene.remove(oldModel)
      }

      this.scene.add(group)
    }

    createModel()
    geometryHelper.createGUI(createModel)
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

  //three.js 에서 제공하는 control을 사용
  private update(time: number) {
    time *= 0.001 // ms -> s 단위로 변경

    // const cube = this.scene.getObjectByName("cube")
    // if(cube) {
    //   cube.rotation.x = time 
    //   cube.rotation.y = time
    // }
    // console.log(time);
  }


  private render(time: number) {
    // time : setAnimationLoop의 값에 의해서 결정되는데 단위는 ms
    this.update(time)

    this.renderer.render(this.scene, this.camera!)
  }
}

new App()