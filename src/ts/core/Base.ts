import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Base {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;

  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#webgl').appendChild(this.renderer.domElement);
  }

  public resize(): void {
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  public render(): void {
    requestAnimationFrame(() => this.render());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // public calcSize(originalWidth, originalHeight, camera, screenPercentage) {
  //   const aspectRatio = originalWidth / originalHeight;
  //   const vFOV = THREE.MathUtils.degToRad(camera.fov);
  //   const distance = camera.position.z;
  //   const visibleHeightAtDistance = 2 * Math.tan(vFOV / 2) * distance;
  //   const visibleWidthAtDistance = visibleHeightAtDistance * camera.aspect;
  //   const newObjectWidth = visibleWidthAtDistance * screenPercentage;
  //   const newObjectHeight = newObjectWidth / aspectRatio;

  //   return { width: newObjectWidth, height: newObjectHeight };
  // }
}
