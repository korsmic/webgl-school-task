import * as THREE from 'three';

export class Earth {

  private geometry: THREE.SphereGeometry;
  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;
  private wireframeMaterial: THREE.MeshBasicMaterial;
  private wireframeMesh: THREE.Mesh;

  constructor(radius: number) {
    this.init(radius);
  }

  init(radius: number = 1) {
    this.geometry = new THREE.SphereGeometry(radius, 32, 32);

    this.material = new THREE.MeshBasicMaterial({
      alphaMap: new THREE.TextureLoader().load('../assets/images/03/earth3.webp'),
      color: new THREE.Color(0x51b648),
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 0.7
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x51b648),
      transparent: true,
      wireframe: true,
      opacity: 0.3
    });

    this.wireframeMesh = new THREE.Mesh(this.geometry, this.wireframeMaterial);
    this.mesh.add(this.wireframeMesh);
  }

  getMesh() {
    return this.mesh;
  }

}
