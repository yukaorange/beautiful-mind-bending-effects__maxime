uniform float uAspect;
uniform vec2 uResolution;
uniform sampler2D uTexture;

vec4 fromLinear(vec4 linearRGB) {
  bvec3 cutoff = lessThan(linearRGB.rgb, vec3(0.0031308));

  vec3 higher = vec3(1.055) * pow(linearRGB.rgb, vec3(1.0 / 2.4)) - vec3(0.055);

  vec3 lower = linearRGB.rgb * vec3(12.92);

  return vec4(mix(higher, lower, cutoff), linearRGB.a);
}

void main() {

  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  vec4 color = fromLinear(texture2D(uTexture, uv));

  gl_FragColor = color;
}
