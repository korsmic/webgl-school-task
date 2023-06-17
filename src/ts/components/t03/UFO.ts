import * as THREE from 'three';

export default class UFO {
  ufo: THREE.Group;

  constructor(size: number) {
    this.init(size);
  }

  init(size: number = 0.5) {
    this.ufo = new THREE.Group();
    const ufoBody = new THREE.SphereGeometry(size, 32, 32);
    const ufoBodyMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x6AFFFD),
    });
    const ufoBodyMesh = new THREE.Mesh(ufoBody, ufoBodyMaterial);

    const ufoRing = new THREE.RingGeometry(size, size * 2, 32);
    const ufoRingMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xE3AE50),
      side: THREE.DoubleSide,
    });
    const ufoRingMesh = new THREE.Mesh(ufoRing, ufoRingMaterial);
    ufoRingMesh.rotateX(Math.PI * 0.5);

    this.ufo.add(ufoBodyMesh);
    this.ufo.add(ufoRingMesh);
  }

  getMesh() {
    return this.ufo;
  }

}
