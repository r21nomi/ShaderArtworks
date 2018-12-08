/**
 * Referenced FMS_Cat's work.
 */

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265
#define MARCH_ITER 100
#define MARCH_MUL 0.8
#define MARCH_EPSILON 0.01

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate2D(float t) {
    return mat2(cos(t), sin(t), -sin(t), cos(t));
}

float smin(float a, float b, float k) {
    float res = exp(-k * a) + exp(-k * b);
    return -log(res) / k;
}

struct Camera {
    vec3 pos;
    vec3 dir;
    vec3 side;
    vec3 top;
    float depth;
};

struct Ray {
    vec3 dir;
    vec3 ori;
};

Camera camInit(in vec3 position, in vec3 target, in float rotation, in float depth) {
    Camera cam;
    cam.pos = position;
    cam.dir = normalize(target - position);
    cam.side = normalize(cross(cam.dir, vec3(0.0, 1.0, 0.0)));
    cam.top = normalize(cross(cam.side, cam.dir));

    cam.side = cos(rotation) * cam.side + sin(rotation) * cam.top;
    cam.top = normalize(cross(cam.side, cam.dir));

    cam.depth = depth;

    return cam;
}

Ray rayInit(in vec3 ori, in vec3 dir) {
    Ray ray;
    ray.dir = dir;
    ray.ori = ori;
    return ray;
}

Ray rayFromCam(in vec2 pos, in Camera cam) {
    vec3 dir = normalize(
        pos.x * cam.side
        + pos.y * cam.top
        + cam.dir * cam.depth
    );
    return rayInit(cam.pos, dir);
}

float distBox(vec3 p, vec3 width) {
    vec3 d = abs(p) - width;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

vec3 typeIfs(vec3 p, vec3 rot, vec3 shift) {
    vec3 pos = p;

    for (int i = 0; i < 5; i++) {
        float intensity = pow(2.0, -float(i));
        pos = abs(pos) - shift * intensity;

        shift.yz = rotate2D(rot.x) * shift.yz;
        shift.zx = rotate2D(rot.y) * shift.zx;
        shift.xy = rotate2D(rot.z) * shift.xy;

        if (pos.x < pos.y) {
            pos.xy = pos.yx;
        }
        if (pos.x < pos.z) {
            pos.xz = pos.zx;
        }
        if (pos.y < pos.z) {
            pos.yz = pos.zy;
        }
    }

    return pos;
}

float distFunc(vec3 _p) {

    vec3 p = _p;
    /** Fractal
    p.z = (mod(p.z - 5.0 * time, 2.0) - 2.5);
    p.y = mod(p.y, 4.0) - 2.0;
    p.xyz = p.xzy;
    */

    p.x = mod(p.x, 4.0);
    p.y = mod(p.y, 4.0);
    p.z = mod(p.z - time, 4.0);

    float f = 0.0 + 0.4 * _p.z;
    float ff = 1.2 + 0.4 * _p.z;

    vec3 p2 = typeIfs(
        p,
        vec3(0.01, 0.02, 0.03),
        vec3(
            0.5 + 0.4 * sin(f + time),
            0.6 + 0.1 * sin(f + time / 0.7),
            0.7 * 0.2 * sin(f + time / 0.8)
        )
    );
    float dist = distBox(p2, vec3(0.2));

    p2 = typeIfs(
        p,
        vec3(0.04, 0.05, 0.06),
        vec3(
            3.1 + 0.4 * sin(ff + time),
            2.1 + 0.1 * sin(ff + time / 0.7) ,
            2.7 * 0.2 * sin(ff + time / 0.8)
        )
    );
    dist = min(dist, distBox(p2, vec3(0.2)));

    /**  Triangle pole
    _p.zx = rotate2D(time) * _p.zx;
    dist = min(dist, distBox(_p, vec3(-0.1 * (_p.y - 2.0), 1E9, -0.1 * (_p.y - 2.0))));
    */

    return dist;
}

/**
  *  p: レイとオブジェクトの交点
  *
  *  return: 法線（勾配）
  */
vec3 getNormal(vec3 p, float d) {
    return normalize(vec3(
        distFunc(p + vec3(d, 0.0, 0.0)) - distFunc(p + vec3(-d, 0.0, 0.0)),
        distFunc(p + vec3(0.0, d, 0.0)) - distFunc(p + vec3(0.0, -d, 0.0)),
        distFunc(p + vec3(0.0, 0.0, d)) - distFunc(p + vec3(0.0, 0.0, -d))
    ));
}

bool isHit(float dist) {
return dist < MARCH_EPSILON;
}

vec3 getRayPosition(Ray ray, float rayLen) {
    return ray.ori + ray.dir * rayLen;
}

void main( void ) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    //uv *= rotate2D(sin(time) * 0.1);

    vec3 camPos = vec3(0.5 * cos(time), 0.5 * sin(time / 0.9), 5.0);
    vec3 camTarget = vec3(0.0);
    float rotation = time * 0.4;
    float depth = 1.0;

    Camera cam = camInit(
        camPos,
        camTarget,
        rotation,
        depth
    );

    Ray ray = rayFromCam(uv, cam);

    float rayLen = 0.001;
    vec3 rayPos = getRayPosition(ray, rayLen);
    float dist;
    for (int i = 0; i < MARCH_ITER; i++) {
        dist = distFunc(rayPos);
        rayLen += MARCH_MUL * dist;
        rayPos = getRayPosition(ray, rayLen);
    }

    vec3 col = vec3(0.0);
    if (isHit(dist)) {
        vec3 normal = getNormal(rayPos, 1E-4);
        float edge = smoothstep(0.1, 0.4, length(normal - getNormal(rayPos, 2E-2)));

        // Blightness of surface?
        vec3 ligPos = vec3(3.0, 4.0, 5.0);
        vec3 ligDir = normalize(cam.pos - ligPos);
        col += vec3(0.4, 0.5, 0.6) * (0.5 + 0.5 * dot(normal, ligDir));

        col += vec3(0.0, 0.4, 0.9) * edge;
    }

    col -= 0.4 * length(uv);
    col = vec3(
        smoothstep(0.0, 1.0, col.x),
        col.y,
        col.z
    );
    vec3 backgroudCol = vec3(1.0, 0.1, 0.8);
    col = mix(backgroudCol, col, exp(-0.1 * rayLen));

    gl_FragColor = vec4(col, 1.0);
}