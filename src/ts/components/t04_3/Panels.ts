import * as THREE from 'three';
import gsap from 'gsap';
import { easeOutQuint } from '../../utility/ease';

export default class Panels {
  private _panels: THREE.Group;
  private radius: number;

  constructor() {
    this._panels = new THREE.Group();
  }

  async init(size: number, spread: number, panelDistance: number) {
    this.radius = spread * panelDistance;
    await this.create(size, this.radius);
    this.opAnimation();
  }

  create(size, radius) {
    for (let index = 0; index < 6; index++) {
      const geometry = new THREE.PlaneGeometry(size, size);
      const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        // depthTest: false,
      });
      const panel = new THREE.Mesh(geometry, material);
      panel.castShadow = true;
      const panelBg = new THREE.Mesh(
        new THREE.PlaneGeometry(size * 1.02, size * 1.02),
        new THREE.MeshBasicMaterial({
          color: 0xEEB902,
          // depthTest: false,
          // side: THREE.DoubleSide,
        })
      );
      panelBg.position.z = -0.01;
      panelBg.rotation.z = Math.PI;

      // const edges = new THREE.EdgesGeometry(geometry);
      // const edgeMaterial = new THREE.LineBasicMaterial({
      //   color: 0xEEB902,
      //   linewidth: 20,
      // });
      // const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
      // panel.add(edgeLines);

      const group = new THREE.Group();
      const angle = (index / 6) * 2 * Math.PI;
      group.position.set(radius * Math.sin(angle), radius * Math.cos(angle), 0);
      group.rotation.z = -angle + Math.PI / 2;
      group.add(panel);
      group.add(panelBg);
      panel.userData = {
        id: index,
      };
      this._panels.rotation.z = Math.PI / 2;
      this._panels.position.x = this.radius;
      this._panels.add(group);
      this._panels.scale.set(0.01, 0.01, 0.01);
    }

  }

  opAnimation() {
    const tl = gsap.timeline(
      {
        delay: 0.5,
        defaults: {
          duration: 2.0,
          ease: easeOutQuint,
        }
      }
    );
    tl
      .to(this._panels.position, {
        x: -this.radius,
      }, 0)
      .to(this._panels.scale, {
        x: 1.0,
        y: 1.0,
        z: 1.0,
      }, 0)
      .from(this._panels.rotation, {
        z: Math.PI / 2 * 4,
      }, 0);
  }

  get panels() {
    return this._panels;
  }
}
