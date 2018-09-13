// http://glslsandbox.com/e#49090.4

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float obliqueLine(vec2 uv){
    return step(0.6, fract((uv.x + uv.y + time * 0.8) * 4.0));
}

vec2 circle(vec2 uv, float radius) {
    return vec2(length(uv), radius);  // .x = distance, .y = offset
}

vec2 square(vec2 uv, float size) {
    return vec2(abs(uv.x) + abs(uv.y), size);
}

void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    vec2 scaledUv = uv * 3.0;
    vec2 repeatedUv = fract(scaledUv);
    repeatedUv -= 0.5;

    float t = sin(time * 6.0 + length(floor(scaledUv))) * 0.5 + 0.5;  // 0.0 ~ 1.0

    vec2 distanceAndOffset = mix(circle(repeatedUv, 0.45), square(repeatedUv, 0.4), exp(t * -6.0)) ;
    float changingOffset = step(distanceAndOffset.x, distanceAndOffset.y);
    vec3 backgroundColor = vec3(0.0, 1.0, 0.0);
    vec3 objectColor = vec3(0.9, 0.0, 1.0);
    vec3 color = mix(backgroundColor * obliqueLine(uv * 5.0), objectColor, changingOffset);

    vec2 distanceAndOffset2 = mix(circle(repeatedUv, 0.2), square(repeatedUv, 0.3), exp(t * -6.0)) ;
    float changingOffset2 = step(distanceAndOffset2.x, distanceAndOffset2.y);
    color *= mix(backgroundColor, vec3(0.9, 0.5, 0.9) * 0.05 / length(repeatedUv), changingOffset2);

    gl_FragColor = vec4(color, 1.0);
}