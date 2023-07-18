export default class Hexagon {
  _position: number[];

  constructor() {
    this._position = [
      0.0, 0.0, 0.0,
      Math.cos((0 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((0 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,
      Math.cos((1 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((1 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,

      0.0, 0.0, 0.0,
      Math.cos((1 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((1 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,
      Math.cos((2 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((2 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,

      0.0, 0.0, 0.0,
      Math.cos((2 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((2 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,
      Math.cos((3 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((3 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,

      0.0, 0.0, 0.0,
      Math.cos((3 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((3 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,
      Math.cos((4 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((4 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,

      0.0, 0.0, 0.0,
      Math.cos((4 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((4 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,
      Math.cos((5 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((5 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,

      0.0, 0.0, 0.0,
      Math.cos((5 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((5 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,
      Math.cos((0 * 2 * Math.PI / 6) + Math.PI / 2), Math.sin((0 * 2 * Math.PI / 6) + Math.PI / 2), 0.0,
    ];
  }

  get position() {
    return this._position;
  }
}
