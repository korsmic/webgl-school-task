import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.addEventListener('DOMContentLoaded', (event) => {
  const app = new App3();
  app.init();
  app.render();
}, false);

class App3 {
  /**
   * カメラ定義のための定数
   */
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
      x: 11.0,
      y: 4.0,
      z: 3.0,
      // カメラの中止点
      lookAt: new THREE.Vector3(0.0, 0.0, 1.0),
    };
  }
  /**
   * レンダラー定義のための定数
   */
  static get RENDERER_PARAM() {
    return {
      // レンダラーが背景をリセットする際に使われる背景色
      clearColor: 0x000000,
      // レンダラーが描画する領域の横幅
      width: window.innerWidth,
      // レンダラーが描画する領域の縦幅
      height: window.innerHeight,
    };
  }
  /**
   * ディレクショナルライト定義のための定数
   */
  static get DIRECTIONAL_LIGHT_PARAM() {
    return {
      color: 0xffffff, // 光の色
      intensity: 0.3,  // 光の強度
      x: 0.5,          // 光の向きを表すベクトルの X 要素
      y: 0.3,          // 光の向きを表すベクトルの Y 要素
      z: 0.5           // 光の向きを表すベクトルの Z 要素
    };
  }
  /**
 * ディレクショナルライト定義のための定数
 */
  static get SPOT_LIGHT_PARAM() {
    return {
      color: 0xffffff, // 光の色
      intensity: 1.0,  // 光の強度
      distance: 30.0,
      angle: Math.PI / 4,
      penumbra: 1.0,
    };
  }
  /**
   * アンビエントライト定義のための定数
   */
  static get AMBIENT_LIGHT_PARAM() {
    return {
      color: 0xffffff, // 光の色
      intensity: 0.03,  // 光の強度
    };
  }
  /**
   * マテリアル定義のための定数
   */
  static get MATERIAL_PARAM() {
    return {
      clearcoat: 0.0,
      clearcoatRoughness: 0,
      metalness: 0.5,
      roughness: 0.0,
      color: 0x049ef4,
      reflectivity: 1.0
      // normalMap: normalMap3,
      // normalScale: new THREE.Vector2(0.15, 0.15)
    };
  }

  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  directionalLight: THREE.DirectionalLight;
  spotLight: THREE.SpotLight;
  ambientLight: THREE.AmbientLight;
  material: THREE.MeshPhongMaterial;
  boxGeometry: THREE.BoxGeometry;
  boxArray: THREE.Mesh[];
  controls: OrbitControls;
  axesHelper: THREE.AxesHelper;
  isDown: boolean;
  boxGroup: THREE.Group;
  meshFloor: THREE.Mesh;
  scaleFactor: number;
  isGrowing: boolean;
  isRotaion: boolean;
  isScale: boolean;
  direction: number;
  speed: number;

  constructor() {
    this.scaleFactor = 0.5; // boxの現在のサイズをトラック
    this.isGrowing = true; // boxが現在拡大しているかどうかをトラック
    this.isRotaion = false; // boxが現在回転しているかどうかをトラック
    this.isScale = false; // boxが現在拡大しているかどうかをトラック
    this.direction = 1;  // 1の時は上がる、-1の時は下がる
    this.speed = 0.005;  // アニメーションの速度

    // 再帰呼び出しのための this 固定
    this.render = this.render.bind(this);

    (document.querySelector('#rotaion') as HTMLElement).addEventListener('click', (e) => {
      this.isRotaion = !this.isRotaion;
      (e.target as HTMLElement).classList.toggle('is-active');
    });
    (document.querySelector('#scale') as HTMLElement).addEventListener('click', (e) => {
      this.isScale = !this.isScale;
      (e.target as HTMLElement).classList.toggle('is-active');
    });

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

    // ディレクショナルライト（平行光源）
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
    // this.material.transparent = true;
    // this.material.opacity = 0.5;

    // 床
    this.meshFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial()
    );
    this.meshFloor.rotation.x -= Math.PI / 2;
    this.meshFloor.position.y = -3;
    this.meshFloor.receiveShadow = true;
    this.scene.add(this.meshFloor);

    // 共通のジオメトリ、マテリアルから、複数のメッシュインスタンスを作成する @@@
    this.boxGroup = new THREE.Group();
    const BOX_COUNT = 50;
    this.boxArray = [];
    for (let i = 1; i <= BOX_COUNT; ++i) {
      const boxGeometry = new THREE.BoxGeometry(i * 0.1, 0.1, i * 0.1);
      const box1 = new THREE.Mesh(boxGeometry, this.material);
      const box2 = new THREE.Mesh(boxGeometry, this.material);
      box1.castShadow = true;
      box2.castShadow = true;
      box1.position.set(0, (BOX_COUNT - i) * 0.1, 0);
      box2.position.set(0, (BOX_COUNT - i) * -0.1 - 0.1, 0);
      this.boxGroup.add(box1);
      this.boxGroup.add(box2);
      this.boxArray.push(box1);
      this.boxArray.unshift(box2);
    }
    this.boxGroup.scale.set(0.5, 0.5, 0.5);
    // this.boxGroup.position.y = 0.5;
    this.scene.add(this.boxGroup);

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

    if (this.isRotaion === true) {
      this.boxArray.forEach((box, index) => {
        if (index % 2 === 0) {
          box.rotation.y += 0.05;
        } else {
          box.rotation.y -= 0.05;
        }
      });
    }

    if (this.isScale === true) {
      this.boxArray.forEach((box) => {
        if (this.isGrowing) {
          this.scaleFactor += 0.00025;
        } else {
          this.scaleFactor -= 0.00025;
        }
        box.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
      });

      // ボックスサイズの上限と下限をチェック
      if (this.scaleFactor >= 1) {
        this.isGrowing = false;
      } else if (this.scaleFactor <= 0.5) {
        this.isGrowing = true;
      }
    }

    this.boxGroup.position.y += this.speed * this.direction;
    this.boxGroup.rotation.y += 0.005;

    // If the boxGroup reaches 1 or -1, reverse the direction
    if (this.boxGroup.position.y >= 0.2 || this.boxGroup.position.y <= -0.2) {
      this.direction *= -1;
    }

    // レンダラーで描画
    this.renderer.render(this.scene, this.camera);
  }
}
