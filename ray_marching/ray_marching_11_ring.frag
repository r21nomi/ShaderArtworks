#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define EPS 0.0001

uniform float time;
uniform vec2 resolution;

float radiusOffset = 1.8;

struct Camera {
    vec3 position;
    vec3 direction;
    vec3 top;
    vec3 side;
    float depth;
};

struct Ray {
    vec3 origin;
    vec3 direction;
};

Camera createCamera(vec3 position, vec3 direction, float depth) {
    Camera cam;
    cam.position = position;
    cam.direction = direction;
    cam.top = vec3(0.0, 1.0, 0.0);
    cam.side = normalize(cross(cam.direction, cam.top));
    cam.depth = depth;
    return cam;
}

Ray createRay(vec2 uv, Camera cam) {
    vec3 dir = normalize(
        uv.x * cam.side
        + uv.y * cam.top
        + cam.direction * cam.depth
    );
    Ray ray;
    ray.direction = dir;
    ray.origin = cam.position;
    return ray;
}

mat2 rotate2D(float angle) {
    return mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
}

float distBox(vec3 p, vec3 width) {
    vec3 d = abs(p) - width;
    return length(max(d, 0.0)) + min(max(d.x,max(d.y, d.z)), 0.0);
}

float sdCappedCylinder( vec3 p, vec2 h ) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float distFunc(vec3 p) {
    vec3 v = mod(p, radiusOffset) - radiusOffset / 2.0;
    v.yz *= rotate2D(radians(90.0));

    float vvv = floor(v.y) * 2.0 - 1.0;

    float s = (sin(time) + 1.0) / 2.0 * 0.2 * vvv;
    float c1 = sdCappedCylinder(v, vec2(0.8 + s, 0.05));
    float c2 = sdCappedCylinder(v, vec2(0.7 + s, 0.055));

    float dist = max(c1, -c2);

    return dist;
}

vec3 getRayPosition(Ray ray, float rayLen) {
    return ray.origin + ray.direction * rayLen;
}

vec3 getNormal(vec3 p) {
    return normalize(vec3(
        distFunc(p + vec3(EPS, 0.0, 0.0)) - distFunc(p + vec3(-EPS, 0.0, 0.0)),
        distFunc(p + vec3(0.0, EPS, 0.0)) - distFunc(p + vec3(0.0, -EPS, 0.0)),
        distFunc(p + vec3(0.0, 0.0, EPS)) - distFunc(p + vec3(0.0, 0.0, -EPS))
    ));
}

void main( void ) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    uv *= rotate2D(time * 0.2);

    Camera cam = createCamera(
        vec3(radiusOffset / 2.0, radiusOffset / 2.0, -time * 1.0),
        vec3(0.0, 0.0, -1.0),
        1.0
    );

    Ray ray = createRay(uv, cam);

    float rayLen = 0.01;
    float dist;
    vec3 rayPosition = getRayPosition(ray, rayLen);
    bool hit = false;

    for (int i = 0; i < 64; i++) {
        dist = distFunc(rayPosition);
        rayLen += dist;
        rayPosition = getRayPosition(ray, rayLen);

        if (abs(dist) < EPS) {
            hit = true;
            break;
        }
    }

    vec3 color = vec3(rayPosition);
    vec3 lightDir = normalize(vec3(0.8, 0.8, 1.0));

    if (hit) {
        vec3 normal = getNormal(rayPosition);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        color = vec3(0.0, 0.0, 0.9) * diff;
    } else {
        color = vec3(0.8, 0.8, 0.9);
    }

    vec3 backgroundColor = vec3(0.1);
    color = mix(backgroundColor, color, exp(-0.1 * rayLen));

    gl_FragColor = vec4(color, 1.0);
}