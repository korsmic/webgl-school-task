precision mediump float;

uniform mat4 normalMatrix;

varying vec3 vNormal;
varying vec4 vColor;

const vec3 light = vec3(1.0, 1.0, 1.0);

void main() {
  vec3 n = normalize((normalMatrix * vec4(normalize(vNormal), 0.0)).xyz);
  float d = dot(n, normalize(light));

  vec4 color = vec4(vColor.rgb * d , vColor.a);
  vec3 rgb = color.rgb;
  gl_FragColor = vec4(rgb, color.a);
}

