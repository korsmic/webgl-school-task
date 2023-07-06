import { Base } from './core/Base';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type * as GUI from 'lil-gui';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import gsap from 'gsap';
import { Observer } from 'gsap/all';
import { easeInOutBack, easeOutBack, easeOutQuad, easeOutQuart } from './utility/ease';
import Panels from './components/t04_3/Panels';
import OffScreen from './components/t04_3/OffScreen';

gsap.registerPlugin(Observer);

window.addEventListener('DOMContentLoaded', async () => {
  const t04 = new T04();
  await t04.init();
  await t04.effect();
  t04.render();
});

type Direction = 1 | -1;

class T04 extends Base {

  private gui: GUI.GUI;
  private axesHelper: THREE.AxesHelper;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private raycaster: THREE.Raycaster;
  private panels: THREE.Group;
  private offScreen: THREE.Group;
  private dodecahedron: OffScreen;
  private octahedron: OffScreen;
  private sphere: OffScreen;
  private icosahedron: OffScreen;
  private torus: OffScreen;
  private cone: OffScreen;
  private panelMeshes: THREE.Mesh[];
  private rotationIndex: number;
  private animating: boolean;
  private isShowInfo: boolean;
  private composer: EffectComposer;

  private params: {
    panelSize: number;
    panelSpread: number;
    panelDistance: number;
    threshold: number;
    strength: number;
    radius: number;
    exposure: number;
  };

  constructor() {
    super();
    this.params = {
      panelSize: 1,
      panelSpread: 1.2,
      panelDistance: 1.2,
      threshold: 0.5,
      strength: 0.25,
      radius: 0.01,
      exposure: 1
    };
    this.animating = false;
    this.rotationIndex = 3;
    this.isShowInfo = false;

    let ww = window.innerWidth;
    let wh = window.innerHeight;

    // camera
    this.camera = new THREE.PerspectiveCamera(45, ww / wh, 0.1, 20.0);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 0, 2.25);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.scene.add(this.camera);

    //画面
    this.renderer.render(this.scene, this.camera);
    this.renderer.shadowMap.enabled = true;

    // リサイズ
    this.resize();

    // scene
    this.scene.background = new THREE.Color(0x000000);

    // light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);
  }

  async init() {
    // Dodecahedron
    const dodecahedronGeometry = new THREE.DodecahedronGeometry(1, 0);
    this.dodecahedron = new OffScreen(this.renderer);
    await this.dodecahedron.init(dodecahedronGeometry);
    // Octahedron
    const OctahedronGeometry = new THREE.OctahedronGeometry(1, 0);
    this.octahedron = new OffScreen(this.renderer);
    await this.octahedron.init(OctahedronGeometry);
    // Sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    this.sphere = new OffScreen(this.renderer);
    await this.sphere.init(sphereGeometry);
    // Icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0);
    this.icosahedron = new OffScreen(this.renderer);
    await this.icosahedron.init(icosahedronGeometry);
    // Cone
    const coneGeometry = new THREE.ConeGeometry(0.75, 1.5, 8);
    this.cone = new OffScreen(this.renderer);
    await this.cone.init(coneGeometry);
    // Torus
    const torusGeometry = new THREE.TorusGeometry(1, 0.5, 16, 32);
    this.torus = new OffScreen(this.renderer);
    await this.torus.init(torusGeometry);

    // Panels
    let panelsObject = new Panels();
    await panelsObject.init(this.params.panelSize, this.params.panelSpread, this.params.panelDistance);
    this.panels = panelsObject.panels;
    this.panels.children.forEach((group, index) => {
      group.children.forEach((mesh) => {
        // switch (index) {
        switch (mesh.userData.id) {
          case 0: mesh.material.map = this.dodecahedron.renderTargetTexture;
            break;
          case 1: mesh.material.map = this.octahedron.renderTargetTexture;
            break;
          case 2: mesh.material.map = this.sphere.renderTargetTexture;
            break;
          case 3: mesh.material.map = this.icosahedron.renderTargetTexture;
            break;
          case 4: mesh.material.map = this.cone.renderTargetTexture;
            break;
          case 5: mesh.material.map = this.torus.renderTargetTexture;
            break;
        }
        mesh.material.needsUpdate = true;
      });
    });

    this.scene.add(this.panels);

    // PanelMeshes
    this.panelMeshes = [];
    this.panels.children.forEach((group) => {
      group.children.forEach((mesh) => {
        this.panelMeshes.push(mesh);
      });
    });

    setTimeout(() => {
      // raycaster
      this.rayCasterSetup();

      // scroll
      this.scrollSetup();
    }, 2000);

    // GUI
    // this.gui = new GUI.GUI();
    // this.gui.add(this.material, 'wireframe');
    // this.gui.addColor(new ColorController(this.material, 'color'), 'value');

    // ヘルパー
    // const axesBarLength = 5.0;
    // this.axesHelper = new THREE.AxesHelper(axesBarLength);
    // this.scene.add(this.axesHelper);

    const size = 20;
    const divisions = 100;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x474647, 0x474647);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = -1;
    this.scene.add(gridHelper);
  }

  async effect() {
    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = this.params.threshold;
    bloomPass.strength = this.params.strength;
    bloomPass.radius = this.params.radius;
    const outputPass = new OutputPass(THREE.ReinhardToneMapping);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
    this.composer.addPass(outputPass);
  }

  scrollSetup() {
    Observer.create({
      target: this.renderer.domElement,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onUp: () => {
        if (!this.animating) {
          this.scrollAnimation(1);
          // this.setRotationIndex(-1);
        }
      },
      onDown: () => {
        if (!this.animating) {
          this.scrollAnimation(-1);
          // this.setRotationIndex(1);
        }
      },
      tolerance: 10,
      preventDefault: true,
    });
  }

  scrollAnimation(direction: Direction) {
    const rotationIncrement = 2 * Math.PI / 6;
    gsap.to(this.panels.rotation, {
      z: this.panels.rotation.z + rotationIncrement * direction,
      duration: 0.5,
      ease: easeOutQuad,
      overwrite: true,
      onStart: () => {
        this.animating = true;
        if (this.isShowInfo) {
          this.showInfo(this.setRotationIndex(direction));
        }
      },
      onComplete: () => this.animating = false,
    });
    this.panels.children.forEach((group) => {
      gsap.to(group.rotation, {
        // x: group.rotation.x + Math.PI * 2 * direction,
        y: group.rotation.y + Math.PI * 2 * direction,
        z: group.rotation.z + Math.PI * 2 * direction,
        duration: 0.5,
        ease: easeOutQuad,
        // overwrite: true,
        onStart: () => {
          this.animating = true;
        },
        onComplete: () => this.animating = false,
      });
    });
  }

  setRotationIndex(direction: Direction) {
    this.rotationIndex += direction;
    if (this.rotationIndex < 0) {
      this.rotationIndex = 5;
    } else if (this.rotationIndex > 5) {
      this.rotationIndex = 0;
    }
    console.log('this.rotationIndex :>> ', this.rotationIndex);
    return this.rotationIndex;
  }

  rayCasterSetup() {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.1;
    // Raycasterでクリックしたオブジェクトを取得
    this.raycaster = new THREE.Raycaster();
    window.addEventListener('click', (mouseEvent) => {
      const x = mouseEvent.clientX / window.innerWidth * 2 - 1;
      const y = -(mouseEvent.clientY / window.innerHeight) * 2 + 1;
      const v = new THREE.Vector2(x, y);
      this.raycaster.setFromCamera(v, this.camera);
      const intersects = this.raycaster.intersectObjects(this.panelMeshes, true);
      const mesh = intersects.filter((intersect) => intersect.object.type === 'Mesh')[0];
      if (!mesh) {
        this.isShowInfo = false;
        this.showInfo();
        this.moveCanvas();
      } else {
        this.isShowInfo = true;
        this.showInfo(mesh.object.userData.id);
        this.moveCanvas();
      }
    });
  }

  showInfo(id?: number) {
    this.rotationIndex = id;
    const infos = document.querySelectorAll('.p_geometryInfo');
    infos.forEach((info) => {
      const infoId = Number(info.getAttribute('data-id'));
      if (this.isShowInfo) {
        if (infoId !== id) {
          gsap.to(info, {
            xPercent: 100,
            opacity: 0,
            duration: 0.5,
            ease: easeOutQuart,
          });
        }
        if (infoId === id) {
          gsap.to(info, {
            xPercent: -100,
            opacity: 1,
            duration: 0.5,
            ease: easeOutQuart,
          });
        }
      } else {
        gsap.to(info, {
          xPercent: 100,
          opacity: 0,
          duration: 0.5,
          ease: easeOutQuart,
        });
      }
    });
  }

  moveCanvas() {
    // 画面の幅の20%を計算
    const moveAmount = window.innerWidth * 0.20;

    const moveAmountNormalized = moveAmount / (window.innerWidth / 2);
    const radius = this.params.panelDistance * this.params.panelSpread;

    if (this.isShowInfo === false) {
      gsap.to(this.panels.position, {
        x: -radius,
        ease: easeOutQuart,
        duration: 0.5
      });
    } else {
      gsap.to(this.panels.position, {
        x: Math.min(-radius - moveAmountNormalized, 1),
        ease: easeOutQuart,
        duration: 0.5
      });
    }
  }

  public render(): void {
    requestAnimationFrame(() => this.render());
    // this.controls.update();
    this.dodecahedron.render();
    this.octahedron.render();
    this.sphere.render();
    this.icosahedron.render();
    this.cone.render();
    this.torus.render();

    // this.renderer.render(this.scene, this.camera);
    this.composer.render();
  }

}
