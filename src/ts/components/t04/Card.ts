import * as THREE from 'three';
import { TextureLoader } from 'three';
import gsap from 'gsap';
import { easeOutQuint } from '../../utility/ease';

export default class Card {
  private _cards: THREE.Group;
  private images: any[];
  private number: number;
  private _ready: Promise<void>;

  constructor(size: number, spread: number, number: number) {
    this._cards = new THREE.Group();
    this.number = number;
    this._ready = this.init(size, spread);
  }

  async init(size, spread) {
    await this.loadImages();
    await this.create(size, spread);
    this.opAnimation();
  }

  async loadImages() {
    this.images = [];
    const textureLoader = new TextureLoader();
    let loadPromises = [];

    for (let i = 0; i < this.number; i++) {
      let loadPromise = new Promise<void>((resolve, reject) => {
        textureLoader.load(
          `https://picsum.photos/id/${Math.round(Math.random() * 100)}/1618/1000.webp`,
          (texture) => {
            this.images.push(texture);
            resolve();
          },
          undefined,
          (error) => {
            console.error('An error happened while loading a texture', error);
            reject(error);
          }
        );
      });

      loadPromises.push(loadPromise);
    }

    await Promise.all(loadPromises);
  }

  create(size, spread) {
    const radius = spread * this.number / (2 * Math.PI);

    this.images.forEach((image, index) => {
      const geometry = new THREE.PlaneGeometry(size * 1.618, size);
      const material = new THREE.MeshBasicMaterial({
        map: image,
        // color: new THREE.Color().setHSL(Math.random(), Math.random(), Math.random()),
        side: THREE.DoubleSide,
      });
      const card = new THREE.Mesh(geometry, material);
      card.castShadow = true;

      const group = new THREE.Group();

      const angle = (index / this.number) * 2 * Math.PI;
      group.position.set(0, radius * Math.sin(angle), radius * Math.cos(angle));
      group.rotation.x = -angle;

      group.add(card);
      this._cards.add(group);
    });

    this._cards.scale.set(0, 0, 0);
  }

  opAnimation() {
    const tl = gsap.timeline(
      {
        delay: 0.5,
        defaults: {
          duration: 3.0,
          ease: easeOutQuint,
        }
      }
    );
    tl
      .to(this._cards.scale, {
        x: 1.0,
        y: 1.0,
        z: 1.0,
      }, 0)
      .from(this._cards.rotation, {
        x: Math.PI / 2 * 4,
      }, 0);
  }

  get cards() {
    return this._cards;
  }

  get ready() {
    return this._ready;
  }
}
