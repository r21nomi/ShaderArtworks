// http://glslsandbox.com/e#41907.1

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(float n) {
    return fract(abs(sin(n * 55.753) * 367.34));
}

void main(void){
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    float scale = 20.0;
    vec2 newUv = uv * scale;
    vec2 repeatedUv = floor(newUv + time);

    vec3 color = vec3(0.0);

    // Circle
    float t = fract(-time * 1.2);
    color.rg -= random(repeatedUv.x) * random(repeatedUv.y) * (step(0.7, 1.0 - length(uv * t)) * step(0.1, length(uv * t)));

    // Grid
    color.rb += random(repeatedUv.x * repeatedUv.y);

    gl_FragColor = vec4(color, 1.0);
}