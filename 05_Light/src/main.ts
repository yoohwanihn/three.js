import { OrbitControls } from 'three/examples/jsm/Addons.js'
import './style.css'
import * as THREE from 'three'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

class App {
  private renderer: THREE.WebGLRenderer //Renderer Field 추가
  private domApp: Element
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera //?를 붙이면 PerspectiveCamera Type이나 Undefined Type을 가질 수 있음.(Optional Properties)

  /*
  //Directional Light
  private light?: THREE.DirectionalLight
  private helper?: THREE.DirectionalLightHelper
  */

  /*
  //Point Light
  private light?: THREE.PointLight
  private helper?: THREE.PointLightHelper
  */

  //Spot Light
  private light?: THREE.SpotLight
  private helper?: THREE.SpotLightHelper

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
    this.camera.position.z = 5  // (0, 0, 5)

    new OrbitControls(this.camera, this.domApp as HTMLElement)
  }

  private setupLight() {
    // const light = new THREE.AmbientLight("#ffffff", 1)
    //const light = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c",1)

    /*
    //Directional Light
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 1, 0)
    light.target.position.set(0, 0, 0)
    this.scene.add(light.target)
    this.light = light

    const helper = new THREE.DirectionalLightHelper(light)
    this.scene.add(helper)
    this.helper = helper

    this.scene.add(light)
    */

    /*
    //Point Light
    const light = new THREE.PointLight(0xffffff, 20)
    light.position.set(0, 5, 0)
    light.distance = 5  // 광원의 영향을 받을 범위 (default 0 = 모든 범위)
    this.scene.add(light)
    this.light = light

    const helper = new THREE.PointLightHelper(light)
    this.scene.add(helper)
    this.helper = helper
    */

    //Spot Light
    const light = new THREE.SpotLight(0xffffff, 5)
    light.position.set(0, 5, 0)
    light.target.position.set(0, 0, 0)
    light.angle = THREE.MathUtils.degToRad(40)
    light.penumbra = 0  // 빛의 감쇠율
    this.scene.add(light)
    this.scene.add(light.target)

    const helper = new THREE.SpotLightHelper(light)
    this.scene.add(helper)

    this.light = light
    this.helper = helper

    const gui = new GUI()
    gui.add(light, 'angle', 0, Math.PI/2, 0.01).onChange(() => helper.update())
    gui.add(light, 'penumbra', 0, 1, 0.01).onChange(() => helper.update())

  }

  private setupModels() {
    const axisHelper = new THREE.AxesHelper(10) // 좌표축
    this.scene.add(axisHelper)

    const geomGround = new THREE.PlaneGeometry(5, 5) // ground (5x5)
    const matGround = new THREE.MeshStandardMaterial({
      color: "#2c3e50",
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide
    })
    const ground = new THREE.Mesh(geomGround, matGround)
    ground.rotation.x = -THREE.MathUtils.degToRad(90)
    ground.position.y = -.5
    this.scene.add(ground)

    const geomBigSphere = new THREE.SphereGeometry(1, 32, 16, 9, THREE.MathUtils.degToRad(360), 0, THREE.MathUtils.degToRad(90))
    const matBigSphere = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.1,
      metalness: 0.2
    });
    const bigSphere = new THREE.Mesh(geomBigSphere, matBigSphere)
    bigSphere.position.y = -.5
    this.scene.add(bigSphere)

    const geomSmallSphere = new THREE.SphereGeometry(0.2)
    const matSmallSphere = new THREE.MeshStandardMaterial({
      color: "#e74c3c",
      roughness: 0.2,
      metalness: 0.5
    })
    const smallSphere = new THREE.Mesh(geomSmallSphere, matSmallSphere)

    const smallSpherePivot = new THREE.Object3D();
    smallSpherePivot.add(smallSphere)
    bigSphere.add(smallSpherePivot);
    smallSphere.position.x = 2
    smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(-45)
    smallSphere.position.y = 0.5 // bigSphere의 y position이 -.5기 때문에
    smallSpherePivot.name = "smallSpherePivot"  // update에서 접근하기 쉽게 명명함

    const cntItems = 8
    const geomTorus = new THREE.TorusGeometry(0.3, 0.1)
    const matTorus = new THREE.MeshStandardMaterial({
      color: "#9b59b6",
      roughness: 0.5,
      metalness: 0.9
    })
    for (let i = 0; i < cntItems; i++) {
      const torus = new THREE.Mesh(geomTorus, matTorus)
      const torusPivot = new THREE.Object3D() // Torus 역시 반 구를 기준으로 회전하면서 8개를 생성하기 때문에 피봇이 필요함
      bigSphere.add(torusPivot)

      torus.position.x = 2  // smallSphere의 x 포지션과 일치하게함
      torusPivot.position.y = 0.5 // bigSphere의 y 포지션이 -.5임
      torusPivot.rotation.y = THREE.MathUtils.degToRad(360) / cntItems * i
      torusPivot.add(torus)
    }
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

    const smallSpherePivot = this.scene.getObjectByName("smallSpherePivot")
    if (smallSpherePivot) {
      //smallSpherePivot.rotation.y = time;
      const euler = new THREE.Euler(0, time, 0)
      const quaternion = new THREE.Quaternion().setFromEuler(euler)
      smallSpherePivot.setRotationFromQuaternion(quaternion)

      const smallSphere = smallSpherePivot.children[0]  // 화면상 회전하는 빨간색 구체

      /*
      // Directional Light
      smallSphere.getWorldPosition(this.light!.target.position) // this.light!는 this.light가 절대 null이나 undefined가 아님을 의미
      this.helper!.update() // this.helper가 null이나 undefined가 아님
      */

      /*
      // Point Light
      smallSphere.getWorldPosition(this.light!.position) // smallSphere 위치를 광원의 위치로
      this.helper!.update()
      */

      // Spot Light
      smallSphere.getWorldPosition(this.light!.target.position)
      this.helper!.update()
    }
  }

  private render(time: number) {
    // time : setAnimationLoop의 값에 의해서 결정되는데 단위는 ms
    this.update(time)

    this.renderer.render(this.scene, this.camera!)
  }
}

new App()
