import * as THREE from 'three';

export default class AirPlane {
  private _ap: THREE.Mesh;
  private _material: THREE.MeshBasicMaterial;
  private _edges: THREE.LineSegments;

  constructor() {
    this.init();
  }

  material(): THREE.MeshBasicMaterial {
    this._material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xF5F5F5),
      side: THREE.DoubleSide,
    });
    return this._material;
  }

  edges(_geometry: THREE.BufferGeometry): THREE.LineSegments {
    const geometry = new THREE.EdgesGeometry(_geometry);
    const material = new THREE.LineBasicMaterial({
      color: 0x696969,
      linewidth: 2,
    });
    this._edges = new THREE.LineSegments(geometry, material);
    return this._edges;
  }

  init() {
    this._ap = new THREE.Group();
    this._ap.add(this.hane());
    this._ap.add(this.body());
    // this._ap.rotation.x = Math.PI / 2;
  }

  hane() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -0.5, 0.0, 0.0,
      0.5, 0.0, 0.0,
      0.0, Math.sqrt(2), 0.0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const hane = new THREE.Mesh(geometry, this.material());
    hane.rotation.x = Math.PI / 2;

    hane.add(this.edges(geometry));
    return hane;
  }

  body() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0.0, 0.0, 0.0,
      0.0, Math.sqrt(2), 0.0,
      0.0, 0.0, 0.5
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const body = new THREE.Mesh(geometry, this.material());
    body.rotation.x = Math.PI / 2;
    body.add(this.edges(geometry));
    return body;
  }

  get ap() {
    return this._ap;
  }
}
