import * as THREE from 'three';

export default class AirPlane {
  private geometry: THREE.PlaneGeometry;
  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;

  constructor() {
    this.init();
  }

  init() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.MeshBasicMaterial({
      alphaMap: new THREE.TextureLoader().load('../assets/images/03/airplane.webp'),
      color: new THREE.Color(0xf8b71e),
      transparent: true,
      side: THREE.DoubleSide,
      // wireframe: true
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  getMesh() {
    return this.mesh;
  }
}
