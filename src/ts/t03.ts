import { Base } from './core/Base';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type * as GUI from 'lil-gui';
import { Earth } from './components/t03/Earth';
import AirPlane from './components/t03/AirPlane';
import Pin from './components/t03/Pin';
import Star from './components/t03/Star';
import UFO from './components/t03/UFO';

window.addEventListener('DOMContentLoaded', () => {
  new T03().render();
});

class T03 extends Base {

  private gui: GUI.GUI;
  private axesHelper: THREE.AxesHelper;
  private light: THREE.AmbientLight;
  private earth: THREE.Mesh;
  private airPlane: THREE.Mesh;
  private pin: THREE.Mesh;
  private radius: number;
  private pinSize: number;
  private airPlaneSize: number;
  private airPlaneSpeed: number;
  private airPlaneTurnScale: number;
  private stars: THREE.Mesh;
  private innerPin: THREE.Mesh;
  private ufo: THREE.Mesh;
  private ufoSize: number;
  private ufoDistance: number;
  private ufoSpeed: number;
  private cameraL: THREE.PerspectiveCamera;
  private cameraR: THREE.PerspectiveCamera;
  private clock: THREE.Clock;

  constructor() {
    super();
    this.radius = 5;
    this.pinSize = 0.8;
    this.ufoSize = 0.2;
    this.ufoDistance = this.radius * 1.5;
    this.ufoSpeed = 0.5;
    this.airPlaneSize = 1;
    this.airPlaneSpeed = 0.4;
    this.airPlaneTurnScale = 0.3;
    this.clock = new THREE.Clock();

    let ww = window.innerWidth;
    let wh = window.innerHeight;

    // ! 2画面参考: https://gupuru.hatenablog.jp/entry/2013/12/23/203045
    // cameraL
    this.cameraL = new THREE.PerspectiveCamera(75, ww / wh, 0.1, 1000);
    this.controls = new OrbitControls(this.cameraL, this.renderer.domElement);
    this.cameraL.position.z = this.radius * 2.8;
    this.cameraL.position.y = this.radius * 0.5;
    this.cameraL.lookAt(0, 0, 0);
    this.scene.add(this.cameraL);

    // cameraR
    this.cameraR = new THREE.PerspectiveCamera(75, ww / wh, 0.1, 1000);
    this.controls = new OrbitControls(this.cameraR, this.renderer.domElement);
    this.cameraR.position.z = this.radius * 2.0;
    this.scene.add(this.cameraR);

    this.cameraL.aspect = 0.5 * ww / wh;
    this.cameraR.aspect = 0.5 * ww / wh;
    this.cameraR.updateProjectionMatrix();
    this.cameraL.updateProjectionMatrix();

    this.renderer.setViewport(0, 0, ww, wh);
    this.renderer.clear();

    //左画面
    this.renderer.setViewport(1, 1, 0.5 * ww - 2, wh - 2);
    this.renderer.render(this.scene, this.cameraL);

    //右画面
    this.renderer.setViewport(0.5 * ww + 1, 1, 0.5 * ww - 2, wh - 2);
    this.renderer.render(this.scene, this.cameraR);

    window.addEventListener('resize', () => {
      ww = window.innerWidth;
      wh = window.innerHeight;
      this.renderer.setSize(ww, wh);
      this.cameraL.aspect = 0.5 * ww / wh;
      this.cameraR.aspect = 0.5 * ww / wh;
      this.cameraR.updateProjectionMatrix();
      this.cameraL.updateProjectionMatrix();
    }, false);

    // scene
    this.scene.background = new THREE.Color(0x030301);

    // earth
    const earthObject = new Earth(this.radius);
    this.earth = earthObject.getMesh();
    this.scene.add(this.earth);

    // airPlane
    const airPlaneObject = new AirPlane();
    this.airPlane = airPlaneObject.getMesh();
    const airPlanePos = this.translateGeoCoords(0, 270, this.radius + this.airPlaneSize * 0.25);
    this.airPlane.position.set(airPlanePos.x, airPlanePos.y, airPlanePos.z);
    this.airPlane.lookAt(0, 0, 0);
    this.scene.add(this.airPlane);

    // pin
    const pinObject = new Pin(this.pinSize);
    this.pin = new THREE.Group();   // pinを回転させたいので、pinをグループ化してinnerPinを入れる
    this.innerPin = pinObject.getMesh();
    const pinPos = this.translateGeoCoords(0, 270, this.radius + this.pinSize * 0.5); // pinの高さの半分を+する
    this.pin.position.set(pinPos.x, pinPos.y, pinPos.z);
    this.pin.lookAt(0, 0, 0);
    this.pin.rotateX(Math.PI * 1.5);
    this.pin.add(this.innerPin);
    this.earth.add(this.pin);

    setInterval(() => {
      // pinの位置を5秒毎にランダムに変更
      this.setRandomPinPosition();
    }, 5000);

    // star
    const startObject = new Star(0.4, 1200);
    this.stars = startObject.getMesh();
    this.scene.add(this.stars);

    // ufo
    const ufoObject = new UFO(this.ufoSize);
    this.ufo = ufoObject.getMesh();
    const ufoPos = this.translateGeoCoords(0, 270, this.ufoDistance);
    this.ufo.position.set(ufoPos.x, ufoPos.y, ufoPos.z);
    this.ufo.lookAt(0, 0, 0);
    this.scene.add(this.ufo);

    // light
    this.light = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.light);

    // GUI
    // this.gui = new GUI.GUI();
    // this.gui.add(this.material, 'wireframe');
    // this.gui.addColor(new ColorController(this.material, 'color'), 'value');

    // ヘルパー
    // const axesBarLength = 5.0;
    // this.axesHelper = new THREE.AxesHelper(axesBarLength);
    // this.scene.add(this.axesHelper);

  }

  setRandomPinPosition() {
    const randomLatitude = Math.random() * 180 - 90; // -90 to 90
    const randomLongitude = Math.random() * 360 - 180; // -180 to 180
    const pinPos = this.translateGeoCoords(randomLatitude, randomLongitude, this.radius + this.pinSize * 0.5);
    this.pin.position.set(pinPos.x, pinPos.y, pinPos.z);
    this.pin.lookAt(0, 0, 0);
    this.pin.rotateX(Math.PI * 1.5);
  }

  // ! 緯度、経度、高度参考： https://ics.media/entry/10657/
  translateGeoCoords(latitude, longitude, radius) {
    // 仰角 単位をラジアンに変換
    const phi = latitude * Math.PI / 180;
    // 方位角 単位をラジアンに変換
    const theta = (longitude - 180) * Math.PI / 180;

    const x = -1 * radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  }

  public render(): void {
    requestAnimationFrame(() => this.render());
    this.controls.update();

    let ww = window.innerWidth;
    let wh = window.innerHeight;

    this.earth.rotation.y += 0.001;
    // this.earth.rotation.x += 0.001;
    // this.earth.rotation.z += 0.001;

    // pinをそのまま回転させると、地球の回転に合わせて回転してしまうので、pinの内側の部分だけ回転させる
    this.innerPin.rotation.y += 0.05;

    // airPlaneからearthの中心までのベクトルを計算
    const centerToAirplane = this.airPlane.position.clone().negate();

    // airPlaneからpinまでのベクトルを計算
    const pinGlobalPosition = new THREE.Vector3(); // pinはearthの子要素なのでグローバル座標を取得するために一度変数に入れる
    this.pin.getWorldPosition(pinGlobalPosition); // pinのグローバル座標を取得
    const airplaneToPin = new THREE.Vector3().subVectors(pinGlobalPosition, this.airPlane.position);

    // airPlaneの新しい方向を centerToAirplane ベクトルとplaneToPin ベクトルを小さくしてを加算する。
    const newDirection = centerToAirplane.add(airplaneToPin.multiplyScalar(this.airPlaneTurnScale));
    newDirection.normalize();

    // airPlaneの位置をearthの表面から0.5の距離に設定
    this.airPlane.position.normalize().multiplyScalar(this.radius + 0.5);

    // airPlaneを新しい方向に移動
    this.airPlane.position.add(newDirection.multiplyScalar(this.airPlaneSpeed));

    // airPlaneの向きを滑らかに新しいpinの方向へ向ける
    this.airPlane.up = this.airPlane.up.clone().lerp(airplaneToPin.normalize(), 0.05);

    // airPlaneがearthに対して平行になるようにする
    this.airPlane.lookAt(0, 0, 0);

    // ufoを衛星軌道で回転させる
    const angle = this.clock.getElapsedTime() * this.ufoSpeed;
    this.ufo.position.x = this.ufoDistance * Math.sin(angle);
    this.ufo.position.y = this.ufoDistance * Math.sin(angle * 0.5);
    this.ufo.position.z = this.ufoDistance * Math.cos(angle);
    this.ufo.rotation.x -= 0.01;
    this.ufo.rotation.y -= 0.01;
    this.ufo.rotation.z += 0.01;

    // cameraRの位置をairPlane真上の位置に設定
    this.cameraR.position.copy(this.airPlane.position);
    this.cameraR.position.normalize().multiplyScalar(this.radius * 1.5);
    this.cameraR.lookAt(this.airPlane.position);

    // rendererの更新
    this.renderer.setViewport(0, 0, ww / 2, wh);
    this.renderer.setScissor(0, 0, ww / 2, wh);
    this.renderer.setScissorTest(true);
    this.renderer.render(this.scene, this.cameraL);
    this.renderer.setViewport(ww / 2, 0, ww / 2, wh);
    this.renderer.setScissor(ww / 2, 0, ww / 2, wh);
    this.renderer.setScissorTest(true);
    this.renderer.render(this.scene, this.cameraR);
  }

}
