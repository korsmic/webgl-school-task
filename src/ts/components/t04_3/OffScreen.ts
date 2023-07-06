import * as THREE from 'three';

export default class OffScreen {
  private size: number;
  private _renderTarget: THREE.WebGLRenderTarget;
  private _material: THREE.MeshNormalMaterial;
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _mesh: THREE.Mesh;
  private _ambientLight: THREE.AmbientLight;
  private renderer: THREE.WebGLRenderer;

  constructor(renderer: THREE.WebGLRenderer) {
    this.size = 1024;
    this.renderer = renderer;
  }

  async init(geometry: THREE.Geometry) {
    this._scene = new THREE.Scene();
    this._material = new THREE.MeshNormalMaterial();
    this._renderTarget = new THREE.WebGLRenderTarget(this.size, this.size);
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20.0);
    this._camera.position.set(0, 0, 5);
    this._camera.lookAt(0, 0, 0);
    this._camera.aspect = 1;
    this._camera.updateProjectionMatrix();
    this._scene.add(this._camera);
    this._scene.background = new THREE.Color(0x000000);
    this._mesh = new THREE.Mesh(geometry, this._material);
    this._mesh.position.set(0, 0, 0);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframe);
    line.material.color.setHex(0x000000);
    line.material.depthTest = true;
    this._mesh.add(line);
    this._scene.add(this._mesh);
  }

  get mesh() {
    return this._mesh;
  }
  get renderTarget() {
    return this._renderTarget;
  }
  get scene() {
    return this._scene;
  }
  get renderTargetTexture() {
    return this._renderTarget.texture;
  }

  render() {
    this._mesh.rotation.y += 0.01;
    this._mesh.rotation.x += 0.01;
    this._mesh.rotation.z += 0.01;
    this.renderer.setRenderTarget(this._renderTarget);
    this.renderer.render(this._scene, this._camera);
    this._renderTarget.texture.needsUpdate = true;
    this.renderer.setRenderTarget(null);
  }
}

