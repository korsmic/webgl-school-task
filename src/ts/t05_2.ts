import { Base } from './core/Base';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type * as GUI from 'lil-gui';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import vs from './shaders/t05_2/vertex.glsl';
import fs from './shaders/t05_2/fragment.glsl';
import Triangle from './components/t05_2/Triangle';
import Rectangle from './components/t05_2/Rectangle';
import Pentagon from './components/t05_2/Pentagon';
import Hexagon from './components/t05_2/Hexagon';

gsap.registerPlugin(SplitText);

window.addEventListener('DOMContentLoaded', () => {
  new T05_2().render();
});

class T05_2 extends Base {

  gui: GUI.GUI;
  axesHelper: THREE.AxesHelper;
  light: THREE.AmbientLight;
  color: number[];
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  positionAttribute: THREE.BufferAttribute;
  position: Float32Array;
  triangle: Number[];
  rectangle: Number[];
  pentagon: Number[];
  hexagon: Number[];
  zero: Number[];
  animationTime: Number;

  constructor() {
    super();

    this.triangle = new Triangle().position;
    this.rectangle = new Rectangle().position;
    this.pentagon = new Pentagon().position;
    this.hexagon = new Hexagon().position;

    this.zero = new Array(this.triangle.length).fill(0.0);

    let ww = window.innerWidth;
    let wh = window.innerHeight;

    // camera
    this.camera = new THREE.PerspectiveCamera(30, ww / wh, 0.1, 100.0);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 0, 5);
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
      this.material.uniforms.resolution.value.x = ww;
      this.material.uniforms.resolution.value.y = wh;
      this.camera.updateProjectionMatrix();
    }, false);

    // scene
    this.scene.background = new THREE.Color(0x000000);

    // light
    this.light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.light);

    // geometry
    this.geometry = new THREE.BufferGeometry();
    this.position = new Float32Array(this.triangle);

    // 頂点
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.position, 3));
    // this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.color), 4));

    // material
    this.material = new THREE.ShaderMaterial({
      vertexShader: vs,
      fragmentShader: fs,
      uniforms: {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2(ww, wh) }
      },
      side: THREE.DoubleSide,
    });

    // mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.animationTime = 2.0;
    gsap
      .timeline({
        repeat: -1,
        yoyo: true,
      })
      .add(() => {
        this.positionAnimation(this.position, this.triangle, this.animationTime);
        this.changeTitle('Triangle');
      })
      .add(() => {
        this.positionAnimation(this.position, this.rectangle, this.animationTime);
        this.changeTitle('Rectangle');
      }, `+=${this.animationTime}`)
      .add(() => {
        this.positionAnimation(this.position, this.pentagon, this.animationTime);
        this.changeTitle('Pentagon');
      }, `+=${this.animationTime}`)
      .add(() => {
        this.positionAnimation(this.position, this.hexagon, this.animationTime);
        this.changeTitle('Hexagon');
      }, `+=${this.animationTime}`);

    const size = 20;
    const divisions = 100;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x474647, 0x474647);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = -1;
    this.scene.add(gridHelper);

    // GUI
    // this.gui = new GUI.GUI();
    // this.gui.add(this.material, 'wireframe');
    // this.gui.addColor(new ColorController(this.material, 'color'), 'value');

    // ヘルパー
    // const axesBarLength = 5.0;
    // this.axesHelper = new THREE.AxesHelper(axesBarLength);
    // this.scene.add(this.axesHelper);

  }

  positionAnimation(beforeArray, afterArray, duration) {
    const obj = {};
    for (let i = 0; i < beforeArray.length; i++) {
      obj[i] = beforeArray[i];
    }

    for (let i = 0; i < beforeArray.length; i++) {
      gsap.to(obj, {
        duration: duration,
        [i]: afterArray[i],
        ease: "expo.inOut",
        onUpdate: () => {
          beforeArray[i] = obj[i];
          this.geometry.attributes.position.needsUpdate = true;
        }
      });
    }
  }

  changeTitle(title: string) {
    document.querySelector('.c_subttl').textContent = title;
    let split = new SplitText('.c_subttl', { type: 'chars' });
    gsap
      .timeline({
        defaults: {
          ease: 'expo.inOut',
        },
        overrite: true,
      })
      .from(split.chars, {
        duration: 0.2,
        delay: 0.6,
        opacity: 0,
        xPercent: 50,
        scale: 1.5,
        stagger: {
          amount: 0.2,
        },
      })
      .to(split.chars, {
        duration: 0.6,
        opacity: 0,
        delay: 0.3,
        scale: 0.7,
        stagger: {
          amount: 0.1,
        }
      });
  }

  public render(): void {
    requestAnimationFrame(() => this.render());
    this.controls.update();

    this.material.uniforms.time.value = performance.now() * 0.001 * 0.5;

    this.renderer.render(this.scene, this.camera);
  }

}
