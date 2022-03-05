precision mediump float;

uniform sampler2D u_imageTarget;
uniform sampler2D u_imageMask;
uniform sampler2D u_turbMask;
uniform vec2 u_resolution;

varying vec2 v_texCoord;
float PI = 3.14159265358979323846264;

float threshold = 0.8;

void main() {
  vec4 turb = texture2D(u_turbMask, v_texCoord);

  vec2 iUV = vec2(1.0 - v_texCoord.x, v_texCoord.y);
  vec4 displacement = texture2D(u_imageMask, iUV);
  float d = displacement.a;
  if (d > threshold) {
    d = threshold * pow(100.0, (threshold - d));
  }
  d = d * turb.r;
  float theta = d * 2. * PI;
  vec2 direction = vec2(cos(theta), sin(theta));
  vec2 uv = v_texCoord + direction * d * 0.05;
  float monochromeIntensity = 0.8;
  vec4 c = texture2D(u_imageTarget, uv) * monochromeIntensity;
  gl_FragColor = vec4(c.r * (1. + direction.x * 10.0 * d), c.g * (1. + direction.y * 1. * d), c.b, 1.0);
}