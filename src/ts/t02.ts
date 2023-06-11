window.addEventListener('DOMContentLoaded', (event) => {
  const app = new App3();
  app.init();
  app.render();
}, false);

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class App3 {
  static get CAMERA_PARAM() {
    return {
      // fovy は Field of View Y のことで、縦方向の視野角を意味する
      fovy: 30,
      // 描画する空間のアスペクト比（縦横比）
      aspect: window.innerWidth / window.innerHeight,
      // 描画する空間のニアクリップ面（最近面）
      near: 0.1,
      // 描画する空間のファークリップ面（最遠面）
      far: 30.0,
      // カメラの位置
      x: 0.0,
      y: 1.0,
      z: 10.0,
      // カメラの中止点
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
  }
  static get RENDERER_PARAM() {
    return {
      clearColor: 0x000000,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  static get DIRECTIONAL_LIGHT_PARAM() {
    return {
      color: 0xffffff, // 光の色
      intensity: 1,  // 光の強度
      x: 1.0,          // 光の向きを表すベクトルの X 要素
      y: 0.0,          // 光の向きを表すベクトルの Y 要素
      z: 1.0           // 光の向きを表すベクトルの Z 要素
    };
  }
  static get SPOT_LIGHT_PARAM() {
    return {
      color: 0xffffff, // 光の色
      intensity: 2.0,  // 光の強度
      distance: 30.0,
      angle: Math.PI / 4,
      penumbra: 1.0,
    };
  }
  static get AMBIENT_LIGHT_PARAM() {
    return {
      color: 0xffffff, // 光の色
      intensity: 0.5,  // 光の強度
    };
  }
  static get MATERIAL_PARAM() {
    return {
      clearcoat: 0.0,
      clearcoatRoughness: 0,
      metalness: 0.5,
      roughness: 0.0,
      color: 0x049ef4,
      reflectivity: 1.0
    };
  }
  static get CONE_PARAM() {
    return {
      radius: 1.25,
      height: 0.5,
      radialSegments: 32,
    };
  }
  static get CYLINDER_PARAM() {
    return {
      radiusTop: 0.25,
      radiusBottom: 0.4,
      height: 3.0,
      radialSegments: 32,
      heightSegments: 1,
      openEnded: false,
      thetaStart: 0.0,
      thetaLength: Math.PI * 2.0,
      x: 0.0,
      y: -1.0,
    };
  }
  static get CAPSULE_PARAM() {
    return {
      radius: 0.25,
      length: 1.0,
      capSegments: 5,
      radialSegments: 10,
      x: 0.0,
      y: 0.45,
      z: 0.5,
      rotationX: Math.PI / 2.0,
      rotationY: 0.0,
    };
  }
  static get BOX_PARAM() {
    return {
      width: 0.3,
      height: 2.5,
      depth: 0.1,
      rotationZ: Math.PI / 4.0,
      x: 0.0,
      y: 0.4,
      z: 0.75,
    };
  }

  fanRotate: number;
  fanDirection: number;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  directionalLight: THREE.DirectionalLight;
  spotLight: THREE.SpotLight;
  ambientLight: THREE.AmbientLight;
  material: THREE.MeshPhongMaterial;
  cylinderGeometry: THREE.CylinderGeometry;
  cylinderMesh: THREE.Mesh;
  controls: OrbitControls;
  axesHelper: THREE.AxesHelper;
  meshFloor: THREE.Mesh;
  scaleFactor: number;
  isGrowing: boolean;
  isRotaion: boolean;
  isScale: boolean;
  isTransform: boolean;
  capsuleGeometry: THREE.CylinderGeometry;
  capsuleMesh: THREE.Mesh;
  BoxGeometry: THREE.BoxGeometry;
  BoxGroup: THREE.Group;
  BoxMesh: THREE.Mesh;
  meshCone: THREE.Mesh;
  FanGroup: THREE.Group;

  constructor() {
    this.fanRotate = 0; // boxの現在のサイズをトラック
    this.fanDirection = 1;
    this.isGrowing = true; // boxが現在拡大しているかどうかをトラック
    this.isRotaion = false; // boxが現在回転しているかどうかをトラック
    this.isScale = false; // boxが現在拡大しているかどうかをトラック
    this.isTransform = false;

    // 再帰呼び出しのための this 固定
    this.render = this.render.bind(this);

    // リサイズイベント
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);
  }

  /**
   * 初期化処理
   */
  init() {
    // レンダラー
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(App3.RENDERER_PARAM.clearColor));
    this.renderer.setSize(App3.RENDERER_PARAM.width, App3.RENDERER_PARAM.height);
    this.renderer.shadowMap.enabled = true;
    const wrapper = document.querySelector('#webgl');
    wrapper.appendChild(this.renderer.domElement);

    // シーン
    this.scene = new THREE.Scene();

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      App3.CAMERA_PARAM.fovy,
      App3.CAMERA_PARAM.aspect,
      App3.CAMERA_PARAM.near,
      App3.CAMERA_PARAM.far,
    );
    this.camera.position.set(
      App3.CAMERA_PARAM.x,
      App3.CAMERA_PARAM.y,
      App3.CAMERA_PARAM.z,
    );
    this.camera.lookAt(App3.CAMERA_PARAM.lookAt);

    // ディレクショナルラト（平行光源）
    this.directionalLight = new THREE.DirectionalLight(
      App3.DIRECTIONAL_LIGHT_PARAM.color,
      App3.DIRECTIONAL_LIGHT_PARAM.intensity
    );
    this.directionalLight.position.set(
      App3.DIRECTIONAL_LIGHT_PARAM.x,
      App3.DIRECTIONAL_LIGHT_PARAM.y,
      App3.DIRECTIONAL_LIGHT_PARAM.z,
    );
    this.scene.add(this.directionalLight);

    this.spotLight = new THREE.SpotLight(
      App3.SPOT_LIGHT_PARAM.color,
      App3.SPOT_LIGHT_PARAM.intensity,
      App3.SPOT_LIGHT_PARAM.distance,
      App3.SPOT_LIGHT_PARAM.angle,
      App3.SPOT_LIGHT_PARAM.penumbra,
    );
    this.spotLight.castShadow = true;
    this.spotLight.position.set(
      0, 4, 0
    );
    this.spotLight.shadow.mapSize.width = 2048;
    this.spotLight.shadow.mapSize.height = 2048;
    this.scene.add(this.spotLight);
    // const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    // this.scene.add(spotLightHelper);

    // アンビエントライト（環境光）
    this.ambientLight = new THREE.AmbientLight(
      App3.AMBIENT_LIGHT_PARAM.color,
      App3.AMBIENT_LIGHT_PARAM.intensity,
    );
    this.scene.add(this.ambientLight);

    // マテリアル
    this.material = new THREE.MeshPhysicalMaterial(App3.MATERIAL_PARAM);

    // 床
    this.meshFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial()
    );
    this.meshFloor.rotation.x -= Math.PI / 2;
    this.meshFloor.position.y = -2;
    this.meshFloor.receiveShadow = true;
    this.meshFloor.castShadow = true;
    this.scene.add(this.meshFloor);

    // 土台
    this.meshCone = new THREE.Mesh(
      new THREE.ConeGeometry(
        App3.CONE_PARAM.radius,
        App3.CONE_PARAM.height,
        App3.CONE_PARAM.radialSegments,
      ),
      this.material
    );
    this.meshCone.position.y = -1.75;
    this.meshCone.receiveShadow = true;
    this.meshCone.castShadow = true;
    this.scene.add(this.meshCone);

    // グループの設定
    this.BoxGroup = new THREE.Group();
    this.FanGroup = new THREE.Group();

    // 支柱
    this.cylinderGeometry = new THREE.CylinderGeometry(
      App3.CYLINDER_PARAM.radiusTop,
      App3.CYLINDER_PARAM.radiusBottom,
      App3.CYLINDER_PARAM.height,
      App3.CYLINDER_PARAM.radialSegments,
      App3.CYLINDER_PARAM.heightSegments,
      App3.CYLINDER_PARAM.openEnded,
      App3.CYLINDER_PARAM.thetaStart,
      App3.CYLINDER_PARAM.thetaLength,
    );
    this.cylinderMesh = new THREE.Mesh(
      this.cylinderGeometry,
      this.material,
    );
    this.cylinderMesh.castShadow = true;
    this.cylinderMesh.position.set(
      App3.CYLINDER_PARAM.x,
      App3.CYLINDER_PARAM.y,
    );
    this.FanGroup.add(this.cylinderMesh);

    // カプセル
    this.capsuleGeometry = new THREE.CapsuleGeometry(
      App3.CAPSULE_PARAM.radius,
      App3.CAPSULE_PARAM.length,
      App3.CAPSULE_PARAM.capSegments,
      App3.CAPSULE_PARAM.radialSegments,
    );
    this.capsuleMesh = new THREE.Mesh(
      this.capsuleGeometry,
      this.material,
    );
    this.capsuleMesh.castShadow = true;
    this.capsuleMesh.position.set(
      App3.CAPSULE_PARAM.x,
      App3.CAPSULE_PARAM.y,
      App3.CAPSULE_PARAM.z,
    );
    this.capsuleMesh.rotation.x = App3.CAPSULE_PARAM.rotationX;
    this.FanGroup.add(this.capsuleMesh);

    // 羽根
    this.BoxGeometry = new THREE.BoxGeometry(
      App3.BOX_PARAM.width,
      App3.BOX_PARAM.height,
      App3.BOX_PARAM.depth,
    );
    const BoxMesh1 = new THREE.Mesh(
      new THREE.BoxGeometry(
        App3.BOX_PARAM.width,
        App3.BOX_PARAM.height,
        App3.BOX_PARAM.depth,
      ),
      this.material,
    );
    BoxMesh1.castShadow = true;
    this.BoxGroup.add(BoxMesh1);
    const BoxMesh2 = new THREE.Mesh(
      new THREE.BoxGeometry(
        App3.BOX_PARAM.height,
        App3.BOX_PARAM.width,
        App3.BOX_PARAM.depth,
      ),
      this.material,
    );
    BoxMesh2.castShadow = true;
    this.BoxGroup.add(BoxMesh2);
    this.BoxGroup.position.z = App3.BOX_PARAM.z;
    this.BoxGroup.position.y = App3.BOX_PARAM.y;

    this.FanGroup.add(this.BoxGroup);

    this.scene.add(this.FanGroup);
    this.FanGroup.position.y = 0.5;

    // コントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // ヘルパー
    // const axesBarLength = 5.0;
    // this.axesHelper = new THREE.AxesHelper(axesBarLength);
    // this.scene.add(this.axesHelper);
  }

  /**
   * 描画処理
   */
  render() {
    // 恒常ループの設定
    requestAnimationFrame(this.render);

    // コントロールを更新
    this.controls.update();

    this.BoxGroup.rotation.z += 0.3;

    // FanGroupを回転を90度まで回転させて、その後反転して元に戻る
    if (this.fanRotate <= Math.PI / 2 && this.fanDirection === 1) {
      this.FanGroup.rotation.y += 0.01;
      this.fanRotate += 0.01;
    } else if (this.fanRotate >= -Math.PI / 2 && this.fanDirection === -1) {
      this.FanGroup.rotation.y -= 0.01;
      this.fanRotate -= 0.01;
    }

    // 反転
    if (this.fanRotate >= Math.PI / 2) {
      this.fanDirection = -1;
    } else if (this.fanRotate <= -Math.PI / 2) {
      this.fanDirection = 1;
    }

    // レンダラーで描画
    this.renderer.render(this.scene, this.camera);
  }
}
