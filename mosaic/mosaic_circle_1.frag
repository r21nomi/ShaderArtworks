// http://glslsandbox.com/e#41972.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
    return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main(void){
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    float scale = 30.0;
    vec2 repeatedUv = uv * scale;
    vec2 newUv = fract(repeatedUv);

    vec2 center = floor(repeatedUv) + vec2(0.5, 0.5);
    float dist = distance(center, vec2(0.0));  // Same as length(center)
    dist /= scale;

    vec3 color = vec3(0.0);
    float offset = map(sin(time * 2.0), -1.0, 1.0, 0.8, 0.9);

    if (dist < offset) {
        // Make circle with small circle.
        newUv -= 0.5;

        float radius = map(sin((uv.x + uv.y) + time * 8.0), -1.0, 1.0, 0.1, 0.4);
        float v = 1.0 - step(radius, length(newUv));  // Circle
        v *= time;
        color.rg += v;

        newUv += 0.5;
    }

    gl_FragColor = vec4(color, 1.0);
}