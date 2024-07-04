import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'
import './style.css'
import{ TTFLoader, Font } from 'three/examples/jsm/Addons.js'
import{ TextGeometry } from 'three/examples/jsm/Addons.js'

interface IGeometryHelper {
  createGeometry: () => THREE.BufferGeometry
  createGUI: (update: () => void) => void
}

class TextGeometryHelper implements IGeometryHelper{
  private args = {
    text: "치타 유환인",
    size: .5,
    height: .1,
    curveSegments: 2,
    bevelSegments: 3,
    bevelThickness: 0.1,
    bevelSize: .01,
    bevelOffset: 0,
    bevelEnabled: true
  }

  private font: Font

  constructor(font: Font){
    this.font = font
  }

  public createGeometry(){

    //text 정보, font정보와 그 외 args넘겨줌
    const geometry = new TextGeometry(this.args.text,{
      font: this.font,
      ...this.args
    })

    geometry.center() // 가운데 정렬

    return geometry;
  }

  public createGUI(update: () => void){
    const gui = new GUI()
    gui.add(this.args, "text").onChange(update) // text 상태. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "size", 0.1, 1, 0.01).onChange(update) // size의 범위 0.1~1 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "height", 0.1, 1, 0.01).onChange(update) // height의 범위 0.1~1 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "curveSegments", 1, 32, 1).onChange(update) // curveSegments 범위 1~32 , 1 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "bevelSegments", 1, 32, 1).onChange(update) // bevelSegments 범위 1~32 , 1 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "bevelThickness", 0.01, 1, 0.001).onChange(update) // bevelThickness 범위 0.01~1 , 0.001 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "bevelSize", 0.01, 1, 0.001).onChange(update) // bevelSize 범위 0.01~1 , 0.001 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "bevelOffset", -1, 1, 0.001).onChange(update) // bevelOffset 범위 -1~1 , 0.001 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "bevelEnabled").onChange(update) // bevelEnabled 상태. 값이 변경시 createModel 함수 호출
    }
}
class CylinderGeometryHelper implements IGeometryHelper {
  private args = {
    radiusTop: .5,
    radiusBottom: .5,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: 360
  }

  public createGeometry() {
    return new THREE.CylinderGeometry(
      this.args.radiusTop,
      this.args.radiusBottom,
      this.args.height,
      this.args.radialSegments,
      this.args.heightSegments,
      this.args.openEnded,
      THREE.MathUtils.degToRad(this.args.thetaStart),
      THREE.MathUtils.degToRad(this.args.thetaLength)
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "radiusTop", 0, 2, 0.01).onChange(update) // radiusTop의 범위 0~2 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "radiusBottom", 0, 2, 0.01).onChange(update) // radiusBottom의 범위 0~2 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "height", 1, 2, 0.01).onChange(update) // height의 범위 1~2 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "radialSegments", 3, 64, 1).onChange(update) // radialSegments 범위 3~64 , 1 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "heightSegments", 1, 64, 1).onChange(update) // heightSegments 범위 1~64 , 1 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "openEnded").onChange(update) // openEnded 상태. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "thetaStart", 0, 360).onChange(update) // thetaStart 범위 0~360 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "thetaLength", 0, 360).onChange(update) // thetaLength 범위 0~360 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
  }
}

class ConeGeometryHelper implements IGeometryHelper {
  private args = {
    radius: 0.5,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: 360
  }
  public createGeometry() {
    return new THREE.ConeGeometry(
      this.args.radius,
      this.args.height,
      this.args.radialSegments,
      this.args.heightSegments,
      this.args.openEnded,
      THREE.MathUtils.degToRad(this.args.thetaStart),
      THREE.MathUtils.degToRad(this.args.thetaLength)
    )
  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "radius", 0.1, 1, 0.01).onChange(update) // radius의 범위 0.1~1 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "height", 0.1, 2, 0.01).onChange(update) // height의 범위 0.1~2 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "radialSegments", 1, 64, 1).onChange(update) // radialSegments의 범위 1~64 , 1 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "heightSegments", 1, 64, 1).onChange(update) // heightSegments 범위 1~64 , 1 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "openEnded").onChange(update) // openEnded 상태. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "thetaStart", 0, 360, 0.1).onChange(update) // depthSegments 범위 0~360 , 0.1 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "thetaLength", 0, 360, 0.1).onChange(update) // depthSegments 범위 0~360 , 0.1 단위로 변경 가능. 값이 변경시 createModel 함수 호출
  }

}

class CircleGeometryHelper implements IGeometryHelper {
  private args = {
    radius: 1,
    segments: 32,
    thetaStart: 0,
    thetaLength: 360
  }
  public createGeometry() {
    return new THREE.CircleGeometry(
      this.args.radius,
      this.args.segments,
      THREE.MathUtils.degToRad(this.args.thetaStart),
      THREE.MathUtils.degToRad(this.args.thetaLength)
    )

  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "radius", 0.1, 1, 0.01).onChange(update) // radius의 범위 0.1~1 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "segments", 1, 64, 0.01).onChange(update) // segments의 범위 1~64 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "thetaStart", 0, 360, 0.01).onChange(update) // thetaStart의 범위 0~360 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
    gui.add(this.args, "thetaLength", 0, 360, 0.01).onChange(update) // thetaLength 범위 0~360 , 0.01 단위로 변경 가능. 값이 변경시 createModel 함수 호출
  }
}

class BoxGeometryHelper implements IGeometryHelper {
  private args = {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1
  }

  public createGeometry() {
    return new THREE.BoxGeometry(this.args.width, this.args.height, this.args.depth, this.args.widthSegments, this.args.heightSegments, this.args.depthSegments)

  }
  public createGUI(update: () => void) {
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

  private setupHelpers() {
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

  private async setupModels() {
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

    //const geometryHelper = new BoxGeometryHelper()
    //const geometryHelper = new CircleGeometryHelper()
    //const geometryHelper = new ConeGeometryHelper()
    //const geometryHelper = new CylinderGeometryHelper()
    const json = await new TTFLoader().loadAsync('./GowunDodum-Regular.ttf')  // Font 데이터 Json 객체로 로드
    const font = new Font(json) // Json 객체를 이용해 폰트 객체 생성
    const geometryHelper = new TextGeometryHelper(font);


    const createModel = () => {

      const geometry = geometryHelper.createGeometry()

      const mesh = new THREE.Mesh(geometry, meshMaterial)

      const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial)

      const group = new THREE.Group()
      group.name = "cube"
      group.add(mesh, line)

      const oldModel = this.scene.getObjectByName("cube")

      if (oldModel) {
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