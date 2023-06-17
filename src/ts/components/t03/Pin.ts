import * as THREE from 'three';

export default class Pin {
  private geometry: THREE.PlaneGeometry;
  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;

  constructor(size: number = 1) {
    this.init(size);
  }

  init(size) {

    this.geometry = new THREE.PlaneGeometry(size, size);
    this.material = new THREE.MeshBasicMaterial({
      alphaMap: new THREE.TextureLoader().load('../assets/images/03/pin.webp'),
      color: new THREE.Color(0xcd1861),
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
