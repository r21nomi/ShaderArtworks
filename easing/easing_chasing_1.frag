// Refer to https://thebookofshaders.com/edit.php?log=160909064829

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
    return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float linearstep(float begin, float end, float t) {
    return clamp((t - begin) / (end - begin), 0.0, 1.0);
}

float random(in vec2 uv){
    return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
}

float easeInOutExpo(float t) {
    if (t == 0.0 || t == 1.0) {
        return t;
    }
    if ((t *= 2.0) < 1.0) {
        return 0.5 * pow(2.0, 10.0 * (t - 1.0));
    } else {
        return 0.5 * (-pow(2.0, -10.0 * (t - 1.0)) + 2.0);
    }
}

float obliqueLine(vec2 uv){
    return step(0.6, fract((uv.x + uv.y + time * 0.8) * 4.0));
}

float ball(vec2 uv, float radius) {
    return length(uv) - radius;
}

float box(vec2 uv, float size) {
    vec2 rect = step(-size, uv) * (1.0 - step(size, uv));
    return min(rect.x, rect.y);
}

float plotItem(vec2 uv, float radius) {
    float item = ball(uv, radius) * obliqueLine(uv * 4.0);
    return 1.0 - step(0.0, item);
}

float chaser(vec2 uv, float t) {
    float t0 = linearstep(0.0, 0.25, t);
    float x0 = easeInOutExpo(t0);
    float t1 = linearstep(0.5, 0.75, t);
    float x1 = easeInOutExpo(t1);

    float t2 = linearstep(0.25, 0.5, t);
    float y0 = easeInOutExpo(t2);
    float t3 = linearstep(0.75, 1.0, t);
    float y1 = easeInOutExpo(t3);

    return plotItem(uv - vec2(mix(0.3, 0.7, x0 - x1), mix(0.3, 0.7, y0 - y1)), 0.1);
}

float chasers(vec2 st, float t) {
    t = fract(t);
    float v = chaser(st, fract(t));
    v = max(v, chaser(st, fract(t + 0.25)));
    v = max(v, chaser(st, fract(t + 0.5)));
    v = max(v, chaser(st, fract(t + 0.75)));
    return v;
}

void main( void ) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec2 scaledUv = uv * 3.0;
    vec2 repeatedUv = fract(scaledUv);

    float offset = random(floor(scaledUv));

    float size = map(easeInOutExpo(abs(sin(time * 2.5))), 0.0, 1.0, 0.15, 0.25);
    repeatedUv -= 0.5;
    float b = step(size, length(repeatedUv));
    repeatedUv += 0.5;

    float t = fract(time * 0.45);
    float v = chasers(repeatedUv, t);

    vec3 ballColor = vec3(0.0, 0.0, 1.0);
    vec3 backgroundColor = vec3(0.9, 0.8, 0.8);

    vec3 rectColor = vec3(1.0, 0.0, 0.0) * b;
    vec3 color = mix(backgroundColor, ballColor, v);

    color -= rectColor;

    gl_FragColor = vec4(color, 1.0);
}
