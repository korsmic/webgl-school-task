import { Base } from './core/Base';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type * as GUI from 'lil-gui';
import gsap from 'gsap';
import Card from './components/t04/Card';
import { Observer } from 'gsap/all';
import { easeOutQuart } from './utility/ease';

gsap.registerPlugin(Observer);

window.addEventListener('DOMContentLoaded', () => {
  new T04().render();
});

class T04 extends Base {

  private gui: GUI.GUI;
  private axesHelper: THREE.AxesHelper;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private raycaster: THREE.Raycaster;
  private meshFloor: THREE.Mesh;
  private cards: THREE.Group;
  private cardNumber: number;
  private animating: boolean;
  private meshes: THREE.Mesh[];
  private slideNum: number;
  private current: HTMLElement;
  private total: HTMLElement;
  private wrapCards: THREE.Group;
  private defaultWrapCardsRotationY: number;

  constructor() {
    super();
    this.cardNumber = 14;
    this.animating = false;
    this.slideNum = 1;
    this.current = document.querySelector('.c_slidenum_current');
    this.total = document.querySelector('.c_slidenum_total');
    this.current.textContent = this.slideNum.toString();
    this.total.textContent = this.cardNumber.toString();
    this.defaultWrapCardsRotationY = Math.PI / 10;

    let ww = window.innerWidth;
    let wh = window.innerHeight;

    // camera
    this.camera = new THREE.PerspectiveCamera(40, ww / wh, 0.1, 20.0);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 0, 15);
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
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(3.2, 5, 4.8);
    this.directionalLight.castShadow = true;
    this.directionalLight.lookAt(0, 0, 0);
    this.scene.add(this.directionalLight);
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.directionalLight.shadow.camera.near = 0.1;
    this.directionalLight.shadow.camera.far = 50;
    this.directionalLight.shadow.camera.left = -10;
    this.directionalLight.shadow.camera.right = 10;
    this.directionalLight.shadow.camera.top = 10;
    this.directionalLight.shadow.camera.bottom = -10;

    // fog
    this.scene.fog = new THREE.Fog(0x000000, 12, 19);

    // 床
    this.meshFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x343541,
      })
    );
    this.meshFloor.rotation.x -= Math.PI / 2;
    this.meshFloor.position.y -= 4.2;
    this.meshFloor.receiveShadow = true;
    this.scene.add(this.meshFloor);

    // card
    const cardObject = new Card(1.5, 1.75, this.cardNumber);
    this.cards = cardObject.cards;
    this.wrapCards = new THREE.Group();
    this.wrapCards.add(this.cards);
    this.wrapCards.rotation.y = this.defaultWrapCardsRotationY;
    this.scene.add(this.wrapCards);

    // meshes
    this.meshes = [];
    cardObject.ready.then(() => {
      this.cards.children.forEach((group) => {
        group.children.forEach((mesh) => {
          this.meshes.push(mesh);
        });
      });
    });

    // raycaster
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.1;

    // scroll
    Observer.create({
      target: this.renderer.domElement,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onUp: () => {
        if (!this.animating) {
          this.scrollAnimation(-1);
          this.slideNumChange(1);
          this.meshes.forEach((mesh) => {
            this.scaleChange(mesh, 1.0);
          });
        }
      },
      onDown: () => {
        if (!this.animating) {
          this.scrollAnimation(1);
          this.slideNumChange(-1);
          this.meshes.forEach((mesh) => {
            this.scaleChange(mesh, 1.0);
          });
        }
      },
      tolerance: 10,
      preventDefault: true
    });

    // Raycasterでクリックしたオブジェクトを取得
    this.raycaster = new THREE.Raycaster();
    window.addEventListener('click', (mouseEvent) => {
      const x = mouseEvent.clientX / window.innerWidth * 2 - 1;
      const y = -(mouseEvent.clientY / window.innerHeight) * 2 + 1;
      const v = new THREE.Vector2(x, y);
      this.raycaster.setFromCamera(v, this.camera);
      const intersects = this.raycaster.intersectObjects(this.meshes);
      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        // クリックしたカードを横幅画面いっぱいまで広げる
        if (intersected.scale.x !== 1.0) {
          this.scaleChange(intersected, 1.0);
          this.wrapCardsRotation(true);
        } else {
          const halfSize = intersected.geometry.parameters.width / 2;
          const cardPosition = intersected.getWorldPosition(new THREE.Vector3());
          const leftEdgePosition = new THREE.Vector3(cardPosition.x - halfSize, cardPosition.y, cardPosition.z);
          const rightEdgePosition = new THREE.Vector3(cardPosition.x + halfSize, cardPosition.y, cardPosition.z);

          const toScreenPosition = (vec3) => {
            vec3.project(this.camera);
            vec3.x = (vec3.x + 1) / 2 * window.innerWidth;
            vec3.y = -(vec3.y - 1) / 2 * window.innerHeight;
            return vec3;
          };

          const leftEdgeScreenPosition = toScreenPosition(leftEdgePosition);
          const rightEdgeScreenPosition = toScreenPosition(rightEdgePosition);
          const cardScreenWidth = rightEdgeScreenPosition.x - leftEdgeScreenPosition.x;
          const scale = ww / cardScreenWidth;

          this.scaleChange(intersected, scale);
          this.wrapCardsRotation(false);
        }
      } else {
        this.meshes.forEach((mesh) => {
          if (mesh.scale.x !== 1.0) {
            this.scaleChange(mesh, 1.0);
            this.wrapCardsRotation(true);
          }
        });
      }
    });

    // GUI
    // this.gui = new GUI.GUI();
    // this.gui.add(this.material, 'wireframe');
    // this.gui.addColor(new ColorController(this.material, 'color'), 'value');

    // ヘルパー
    // const axesBarLength = 5.0;
    // this.axesHelper = new THREE.AxesHelper(axesBarLength);
    // this.scene.add(this.axesHelper);

  }

  scaleChange(card, number) {
    gsap.to(card.scale, {
      x: number,
      y: number,
      z: number,
      duration: 0.5,
      ease: easeOutQuart,
      overwrite: true,
      onStart: () => this.animating = true,
      onComplete: () => this.animating = false,
    });
  }

  wrapCardsRotation(isDefault: boolean) {
    gsap.to(this.wrapCards.rotation, {
      y: isDefault ? this.defaultWrapCardsRotationY : 0,
      duration: 0.5,
      ease: easeOutQuart,
      overwrite: true,
      onStart: () => this.animating = true,
      onComplete: () => this.animating = false,
    });
  }

  scrollAnimation(direction: number) {
    const rotationIncrement = 2 * Math.PI / this.cardNumber;
    gsap.to(this.cards.rotation, {
      x: this.cards.rotation.x + rotationIncrement * direction,
      duration: 0.5,
      ease: easeOutQuart,
      overwrite: true,
      onStart: () => this.animating = true,
      onComplete: () => this.animating = false,
    });
    this.wrapCardsRotation(true);
  }

  slideNumChange(direction: number): void {
    if (this.current.textContent === '1' && direction === -1) {
      this.current.textContent = this.cardNumber.toString();
      return;
    }
    if (this.current.textContent === this.cardNumber.toString() && direction === 1) {
      this.current.textContent = '1';
      return;
    }
    this.current.textContent = (Number(this.current.textContent) + direction).toString();
  }

  public render(): void {
    requestAnimationFrame(() => this.render());
    // this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

}
