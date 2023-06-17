import * as THREE from 'three';

export default class Star {
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private stars: THREE.Points;
  private starCount: number;
  private starPositionArray: Float32Array;

  constructor(size: number = 0.1, count: number = 1200) {
    this.init(size, count);
  }

  init(size, count) {
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.PointsMaterial({
      map: new THREE.TextureLoader().load("../assets/images/03/star.webp"),
      transparent: true,
      alphaMap: new THREE.TextureLoader().load("../assets/images/03/star.webp"),
      depthWrite: false,
      verTexColors: true,
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      size: size,
    });
    this.starCount = count;
    this.starPositionArray = new Float32Array(this.starCount * 3);
    for (let i = 0; i < this.starCount * 3; i++) {
      this.starPositionArray[i] = (Math.random() - 0.5) * 100;
    }
    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.starPositionArray, 3)
    );
    this.stars = new THREE.Points(this.geometry, this.material);
  }

  getMesh() {
    return this.stars;
  }
}
