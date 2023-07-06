import * as THREE from 'three';

export default class Wall {

  private _wall: THREE.Group;

  constructor(size: number, color: THREE.Color) {
    this._wall = new THREE.Group();
    this.init(size, color);
  }

  init(size, color) {
    this.genWall(size, color);
    this._wall.children[0].rotation.set(0, 0, Math.PI * 0.5);
    this._wall.children[1].rotation.set(Math.PI * 0.5, 0, 0);
    this._wall.children[2].rotation.set(0, Math.PI * 0.5, 0);
    this._wall.children[0].position.set(size * 10 + size, 0, 0);
    this._wall.children[2].position.set(size * 10 + size, 0, size * 10 + size + 0.01);
    this._wall.children[1].position.set(0, -0.01, 0);
    this._wall.position.set(-size * 5, -size * 5, -size * 5);
  }

  plane(size, color) {
    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);

    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
      color: 0x696969,
      linewidth: 2,
      linecap: 'square',
      linejoin: 'miter'
    }));

    // グループを作成して、メッシュとラインを追加
    const group = new THREE.Group();
    group.add(mesh);
    group.add(line);

    return group;
  }

  genWall(size, color) {
    for (let k = 0; k < 3; k++) {
      const childGroup = new THREE.Group();
      let mesh;
      for (let i = 0; i <= 10; i++) {
        for (let j = 0; j <= 10; j++) {
          mesh = this.plane(size, color);
          mesh.position.set(size * i + size * 0.5, size * j + size * 0.5, 0);
          childGroup.add(mesh);
        }
      }
      this._wall.add(childGroup);
    }
  }

  get wall() {
    return this._wall;
  }
}
