
// = 004 ======================================================================
// このサンプルは、最初の状態では 003 とまったく同じ内容です。
// これを、みなさん自身の手で修正を加えて「描かれる図形を五角形に」してみてくだ
// さい。
// そんなの余裕じゃろ～ と思うかも知れませんが……結構最初は難しく感じる人も多い
// かもしれません。なお、正確な正五角形でなくても構いません。
// ポイントは以下の点を意識すること！
// * canvas 全体が XY 共に -1.0 ～ 1.0 の空間になっている
// * gl.TRIANGLES では頂点３個がワンセットで１枚のポリゴンになる
// * つまりいくつかの頂点は「まったく同じ位置に重複して配置される」ことになる
// * 頂点座標だけでなく、頂点カラーも同じ個数分必要になる
// * 物足りない人は、星型や円形などに挑戦してみてもいいかもしれません
// ============================================================================

// モジュールを読み込み
import WebGLUtility from './core/WebGLUtility';
import vertex from './shaders/t05/vertex.glsl';
import fragment from './shaders/t05/fragment.glsl';

// ドキュメントの読み込みが完了したら実行されるようイベントを設定する
window.addEventListener('DOMContentLoaded', () => {
  // アプリケーションのインスタンスを初期化し、必要なリソースをロードする
  const app = new App();
  app.init();
  app.load()
    .then(() => {
      // ジオメトリセットアップ
      app.setupGeometry();
      // ロケーションのセットアップ
      app.setupLocation();

      // セットアップが完了したら描画を開始する
      app.start();
    });
}, false);

/**
 * アプリケーション管理クラス
 */
class App {
  /**
   * @constructro
   */
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  uniformLocation: any;
  position: number[];
  positionStride: number;
  positionVBO: WebGLBuffer;
  color: number[];
  colorStride: number;
  colorVBO: WebGLBuffer;
  startTime: number;
  isRender: boolean;

  constructor() {
    /**
     * WebGL で描画対象となる canvas
     * @type {HTMLCanvasElement}
     */
    this.canvas = null;
    /**
     * WebGL コンテキスト
     * @type {WebGLRenderingContext}
     */
    this.gl = null;
    /**
     * プログラムオブジェクト
     * @type {WebGLProgram}
     */
    this.program = null;
    /**
     * uniform 変数のロケーションを保持するオブジェクト
     * @type {object.<WebGLUniformLocation>}
     */
    this.uniformLocation = null;
    /**
     * 頂点の座標を格納する配列
     * @type {Array.<number>}
     */
    this.position = null;
    /**
     * 頂点の座標を構成する要素数（ストライド）
     * @type {number}
     */
    this.positionStride = null;
    /**
     * 座標の頂点バッファ
     * @type {WebGLBuffer}
     */
    this.positionVBO = null;
    /**
     * 頂点の色を格納する配列
     * @type {Array.<number>}
     */
    this.color = null;
    /**
     * 頂点の色を構成する要素数（ストライド）
     * @type {number}
     */
    this.colorStride = null;
    /**
     * 色の頂点バッファ
     * @type {WebGLBuffer}
     */
    this.colorVBO = null;
    /**
     * レンダリング開始時のタイムスタンプ
     * @type {number}
     */
    this.startTime = null;
    /**
     * レンダリングを行うかどうかのフラグ
     * @type {boolean}
     */
    this.isRender = false;

    // this を固定するためのバインド処理
    this.render = this.render.bind(this);

  }

  /**
   * 初期化処理を行う
   */
  init() {
    // canvas エレメントの取得と WebGL コンテキストの初期化
    const parent = document.querySelector('#webgl');
    parent.appendChild(document.createElement('canvas')).setAttribute('id', 'webgl-canvas');

    this.canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
    this.gl = WebGLUtility.createWebGLContext(this.canvas);

    // canvas のサイズを設定
    const size = Math.min(window.innerWidth, window.innerHeight);
    this.canvas.width = size;
    this.canvas.height = size;

  }

  /**
   * 各種リソースのロードを行う
   * @return {Promise}
   */
  load() {
    return new Promise((resolve, reject) => {
      // 変数に WebGL コンテキストを代入しておく（コード記述の最適化）
      const gl = this.gl;
      // WebGL コンテキストがあるかどうか確認する
      if (gl == null) {
        // もし WebGL コンテキストがない場合はエラーとして Promise を reject する
        const error = new Error('not initialized');
        reject(error);
      } else {
        let vs = null;
        let fs = null;
        // まず頂点シェーダのソースコードを読み込む
        WebGLUtility.loadFile('../shaders/t05/vertex.glsl')
          .then((vertexShaderSource) => {
            vs = WebGLUtility.createShaderObject(gl, vertexShaderSource, gl.VERTEX_SHADER);
            return WebGLUtility.loadFile('../shaders/t05/fragment.glsl');
          })
          .then((fragmentShaderSource) => {
            fs = WebGLUtility.createShaderObject(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
            this.program = WebGLUtility.createProgramObject(gl, vs, fs);

            // Promise を解決
            resolve();
          });
      }
    });
  }

  /**
   * 頂点属性（頂点ジオメトリ）のセットアップを行う
   */
  setupGeometry() {
    // 頂点座標の定義
    this.position = [
      0.0, 0.0, 0.0, // 中心の頂点
      Math.cos((0 * 2 * Math.PI / 5) + Math.PI / 2), Math.sin((0 * 2 * Math.PI / 5) + Math.PI / 2), 0.0, // 1つ目の頂点
      Math.cos((1 * 2 * Math.PI / 5) + Math.PI / 2), Math.sin((1 * 2 * Math.PI / 5) + Math.PI / 2), 0.0, // 2つ目の頂点

      0.0, 0.0, 0.0, // 中心の頂点
      Math.cos((1 * 2 * Math.PI / 5) + Math.PI / 2), Math.sin((1 * 2 * Math.PI / 5) + Math.PI / 2), 0.0, // 2つ目の頂点
      Math.cos((2 * 2 * Math.PI / 5) + Math.PI / 2), Math.sin((2 * 2 * Math.PI / 5) + Math.PI / 2), 0.0, // 3つ目の頂点

      0.0, 0.0, 0.0, // 中心の頂点
      Math.cos((2 * 2 * Math.PI / 5) + Math.PI / 2), Math.sin((2 * 2 * Math.PI / 5) + Math.PI / 2), 0.0, // 3つ目の頂点
      Math.cos((3 * 2 * Math.PI / 5) + Math.PI / 2), Math.sin((3 * 2 * Math.PI / 5) + Math.PI / 2), 0.0, // 4つ目の頂点

      0.0, 0.0, 0.0, // 中心の頂点
      Math.cos((3 * 2 * Math.PI / 5) + Math.PI / 2), Math.sin((3 * 2 * Math.PI / 5) + Math.PI / 2), 0.0, // 4つ目の頂点
      Math.cos((4 * 2 * Math.PI / 5) + Math.PI / 2), Math.sin((4 * 2 * Math.PI / 5) + Math.PI / 2), 0.0, // 5つ目の頂点

      0.0, 0.0, 0.0, // 中心の頂点
      Math.cos((4 * 2 * Math.PI / 5) + Math.PI / 2), Math.sin((4 * 2 * Math.PI / 5) + Math.PI / 2), 0.0, // 5つ目の頂点
      Math.cos((0 * 2 * Math.PI / 5) + Math.PI / 2), Math.sin((0 * 2 * Math.PI / 5) + Math.PI / 2), 0.0, // 1つ目の頂点 (最初の頂点に戻る)
    ];

    // 要素数は XYZ の３つ
    this.positionStride = 3;
    // VBO を生成
    this.positionVBO = WebGLUtility.createVBO(this.gl, this.position);

    // 頂点の色の定義
    this.color = [
      0.25, 0.25, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.25, 0.25, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.25, 0.25, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.25, 0.25, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.25, 0.25, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 1.0,
    ];
    // 要素数は RGBA の４つ
    this.colorStride = 4;
    // VBO を生成
    this.colorVBO = WebGLUtility.createVBO(this.gl, this.color);
  }

  /**
   * 頂点属性のロケーションに関するセットアップを行う
   */
  setupLocation() {
    const gl = this.gl;
    // attribute location の取得
    const attPosition = gl.getAttribLocation(this.program, 'position');
    const attColor = gl.getAttribLocation(this.program, 'color');
    // attribute location の有効化
    WebGLUtility.enableAttribute(gl, this.positionVBO, attPosition, this.positionStride);
    WebGLUtility.enableAttribute(gl, this.colorVBO, attColor, this.colorStride);

    // uniform location の取得
    this.uniformLocation = {
      time: gl.getUniformLocation(this.program, 'time'),
    };
  }

  /**
   * レンダリングのためのセットアップを行う
   */
  setupRendering() {
    const gl = this.gl;
    // ビューポートを設定する
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    // クリアする色を設定する（RGBA で 0.0 ～ 1.0 の範囲で指定する）
    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    // 実際にクリアする（gl.COLOR_BUFFER_BIT で色をクリアしろ、という指定になる）
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  /**
   * 描画を開始する
   */
  start() {
    // レンダリング開始時のタイムスタンプを取得しておく
    this.startTime = Date.now();
    // レンダリングを行っているフラグを立てておく
    this.isRender = true;
    // レンダリングの開始
    this.render();
  }

  /**
   * 描画を停止する
   */
  stop() {
    this.isRender = false;
  }

  /**
   * レンダリングを行う
   */
  render() {
    const gl = this.gl;

    // レンダリングのフラグの状態を見て、requestAnimationFrame を呼ぶか決める
    if (this.isRender === true) {
      requestAnimationFrame(this.render);
    }
    // ビューポートの設定やクリア処理は毎フレーム呼び出す
    this.setupRendering();
    // 現在までの経過時間を計算し、秒単位に変換する
    const nowTime = (Date.now() - this.startTime) * 0.001;
    // プログラムオブジェクトを選択
    gl.useProgram(this.program);

    // ロケーションを指定して、uniform 変数の値を更新する（GPU に送る）
    gl.uniform1f(this.uniformLocation.time, nowTime);
    // ドローコール（描画命令）
    gl.drawArrays(gl.TRIANGLES, 0, this.position.length / this.positionStride);
  }
}

