precision mediump float;

uniform vec2 resolution; // 画面の解像度
uniform float time; // 経過時間を取得するためのuniform変数を追加

void main() {
  // ストライプの幅を時間で変動させてアニメーションを作成
  float t = mod(time,  1.0) * 2.0;

  // 中心からの距離を計算
  vec2 center = resolution / 2.0;
  vec2 uv = gl_FragCoord.xy - center;

  // y座標を基準にストライプを生成
  float stripeX = smoothstep(0.40, 0.40, mod(gl_FragCoord.x , 20.0) / 20.0 * 2.0);
  float stripeY = smoothstep(0.40, 0.40, mod(uv.y * sign(uv.y) * t, 20.0) / 20.0 * 2.0);

  // グラデーションストライプの色
  float stripe = stripeX * stripeY;

  // 時間経過に基づいて色を変化させる
  vec3 color = vec3(sin(time) * 0.5 + 0.5, cos(time) * 0.5 + 0.5, cos(time + 3.14159 * 0.5) * 0.5 + 0.5);

  // フラグメントの色
  gl_FragColor = vec4(color * stripe, 1.0);
}
