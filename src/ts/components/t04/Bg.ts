import * as THREE from 'three';

export default class Bg {
  private _bg: THREE.Group;

  constructor(radius: number) {
    this._bg = new THREE.Group();
    this.init(radius);
  }

  async init(radius) {
    this.load(
      '../assets/images/04/tree.webp',
      32,
      0
    ).then((textures) => this.createBg(radius, textures, 3));

    this.load(
      '../assets/images/04/tree.webp',
      64,
      0.5
    ).then((textures) => this.createBg(radius * 0.8, textures, 2));

    this.load(
      '../assets/images/04/yama_01.webp',
      32,
      0.75
    ).then((textures) => this.createBg(radius * 0.5, textures, 1));
  }

  async load(img: string, size: number, offset?: number) {
    const textures = [];
    if (offset === undefined) offset = 0;
    const loader = new THREE.TextureLoader();

    // Load the first texture
    const texture1 = loader.load(img);
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set(size, 1);
    texture1.minFilter = THREE.LinearFilter;
    texture1.offset.set(offset, 0);
    textures.push(texture1);

    if (offset) {
      // Load the second texture
      const texture2 = loader.load(img);
      texture2.wrapS = THREE.RepeatWrapping;
      texture2.wrapT = THREE.RepeatWrapping;
      texture2.repeat.set(size, 1);
      texture2.minFilter = THREE.LinearFilter;
      texture2.offset.set(offset, 0);
      textures.push(texture2);
    }

    return textures;
  }

  createBg(radius, textures, order = 0) {
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      1,
      64,
      1,
      true,
    );

    const materials = textures.map((texture) => new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: texture,
      transparent: true,
      // depthTest: false
    }));

    materials.forEach((material) => {
      const bg = new THREE.Mesh(geometry, material);
      bg.renderOrder = order;
      bg.position.set(0, 0, 0);
      this._bg.add(bg);
    });
  }

  get bg() {
    return this._bg;
  }
}
