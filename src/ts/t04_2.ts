import { Base } from './core/Base';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type * as GUI from 'lil-gui';
import Wall from './components/t04_2/Wall';
import AirPlane from './components/t04_2/AirPlane';
import gsap from 'gsap';

window.addEventListener('DOMContentLoaded', () => {
  new T04_2().render();
});

class T04_2 extends Base {

  private gui: GUI.GUI;
  private axesHelper: THREE.AxesHelper;
  private light: THREE.AmbientLight;
  private clock: THREE.Clock;
  private wall: THREE.Group;
  private airPlane: THREE.Group;
  private raycaster: THREE.Raycaster;
  private airPlaneDirection: THREE.Vector3;
  private previousIntersect: THREE.Intersection | null = null;
  private planeColor: {
    default: THREE.Color,
    active: THREE.Color,
  };

  constructor() {
    super();
    this.clock = new THREE.Clock();
    this.planeColor = {
      default: new THREE.Color(0xF5F5F5),
      active: new THREE.Color(0x575757),
    };

    let ww = window.innerWidth;
    let wh = window.innerHeight;

    // camera
    this.camera = new THREE.PerspectiveCamera(40, ww / wh, 0.1, 20.0);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(-6, 6, 6);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.scene.add(this.camera);

    //画面
    this.renderer.render(this.scene, this.camera);

    // リサイズ
    window.addEventListener('resize', () => {
      ww = window.innerWidth;
      wh = window.innerHeight;
      this.renderer.setSize(ww, wh);
      this.camera.aspect = ww / wh;
      this.camera.updateProjectionMatrix();
    }, false);

    // geometry
    const wallObject = new Wall(0.5, this.planeColor.default);
    this.wall = wallObject.wall;
    this.scene.add(this.wall);

    // airPlane
    const airPlaneObject = new AirPlane();
    this.airPlane = airPlaneObject.ap;
    this.airPlane.position.set(-0.5, 0, 0);
    this.airPlane.rotation.y = Math.PI / 2;
    this.scene.add(this.airPlane);

    // scene
    this.scene.background = new THREE.Color(0xffffff);

    // light
    this.light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.light);

    // GUI
    // this.gui = new GUI.GUI();
    // this.gui.add(this.material, 'wireframe');
    // this.gui.addColor(new ColorController(this.material, 'color'), 'value');

    // ヘルパー
    // const axesBarLength = 5.0;
    // this.axesHelper = new THREE.AxesHelper(axesBarLength);
    // this.scene.add(this.axesHelper);

    // 方向の初期設定
    this.airPlaneDirection = new THREE.Vector3(1.0, 0.0, 0.0);
    this.airPlane.localToWorld(this.airPlaneDirection);
    this.airPlaneDirection.normalize();

    gsap.ticker.add(() => {
      const time = this.clock.getElapsedTime();
      this.airPlane.position.y = Math.sin(time) * 0.5;
    });

    this.animation();

  }

  animation() {
    this.raycaster = new THREE.Raycaster();
    window.addEventListener('mousemove', (mouseEvent) => {
      const x = mouseEvent.clientX / window.innerWidth * 2 - 1;
      const y = -(mouseEvent.clientY / window.innerHeight) * 2 + 1;
      const pos = new THREE.Vector2(x, y);
      this.raycaster.setFromCamera(pos, this.camera);

      // 各面（グループ）のメッシュのみを取得するための配列を作成
      const meshObjects = this.wall.children.flatMap(group => group.children.flatMap(child => {
        if (child instanceof THREE.Group) {
          return child.children.filter(subChild => subChild instanceof THREE.Mesh);
        }
        return [];
      }));

      const intersects = this.raycaster.intersectObjects(meshObjects);

      if (this.previousIntersect) {
        this.previousIntersect.object.material.color.copy(this.planeColor.default);
      }

      if (intersects.length > 0) {
        intersects[0].object.material.color.copy(this.planeColor.active);
        this.previousIntersect = intersects[0];

        const intersectGlobalPosition = intersects[0].point;
        // 飛行機の先端がmeshの面を向くようにする
        this.airPlane.lookAt(intersectGlobalPosition);
      }
    });

  }

  public render(): void {
    requestAnimationFrame(() => this.render());
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

}
