/**
 * Referenced https://www.shadertoy.com/view/MsVfDz
 * http://nanka.hateblo.jp/entry/2018/12/13/080322
 *
 */

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

mat2 rotate2D(float a) {
    return mat2(cos(a), sin(a), -sin(a), cos(a));
}

mat3 createCamera(vec3 origin, vec3 target, float cr) {
    vec3 cw = normalize(target - origin);
    vec3 cp = vec3(sin(cr), cos(cr), 0.0);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));

    return mat3(cu, cv, cw);
}

float sdRect(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float sphere(vec3 p, float s) {
    return length(p) - s;
}

float map(vec3 p) {
    float s = sphere(p - vec3(0.0), 1.0);
    return s;
}

/**
  * Make pattern as texture.
  */
vec3 texture(vec2 p) {
    vec2 q = (fract(p / 10.0) - 0.5) * 10.0;
    float d = 9999.0;
    for (int i = 0; i < 4; ++i) {
        q = abs(q) - 0.5;
        q *= rotate2D(0.8);
        q = abs(q) - 0.5;
        float k = sdRect(q, vec2(1.0, 0.5 + q.x));
        d = min(d, k);
    }
    float f = 1.0 / (1.0 + abs(d));
    return vec3(pow(f, 16.0) + step(0.935, f));
}

void main( void ) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    float t = time * 0.5;
    vec3 origin = vec3(cos(t), sin(t), 1.0);
    vec3 target = vec3(0.0, 0.0, 0.0);
    mat3 cam = createCamera(origin, target, 1.0);
    vec3 ray = cam * normalize(vec3(uv, 0.8));

    float rayLen = 0.01;
    vec3 rayPosition = origin + ray * rayLen;
    bool hit = false;

    for (int i = 0; i < 64; i++) {
        float dist = map(rayPosition);
        rayLen += dist;
        rayPosition = origin + ray * rayLen;

        if (abs(dist) < 0.001) {
            hit = true;
            break;
        }
    }

    vec3 color = vec3(rayPosition);

    if (hit) {
        vec3 normal = normalize(rayPosition) * 26.0 + 5.0 * sin(time * 0.5);
        vec3 globe = texture(normal.zy) + texture(normal.xz) + texture(normal.xy);
        color = mix(vec3(0.0, 0.1, 0.9), vec3(0.9, 0.4, 0.7),  globe);
    } else {
        // Outline color
        color = vec3(0.0);
    }

    vec3 backgroundColor = vec3(0.9, 0.0, 0.2);
    // Draw background and outline
    color = mix(backgroundColor, color, exp(-0.0001 * rayLen));

    gl_FragColor = vec4(color, 1.0);
}