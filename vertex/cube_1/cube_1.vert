/*{
    "pixelRatio": 1,
    "vertexCount": 18000,
    "vertexMode": "TRIANGLES",
    "server": 3000,
}*/
precision mediump float;
attribute float vertexId;
uniform float vertexCount;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
varying vec4 v_color;
varying vec2 v_uv;

float VERTEX_COUNT_FOR_CUBE = 36.0;
float VERTEX_COUNT_FOR_SURFACE = 6.0;
float SURFACE_COUNT_FOR_CUBE = 6.0;

float CUBE_SIZE = 0.03;

mat3 rotateX(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, s,
        0.0, -s, c
    );
}

mat3 rotateY(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0, c
    );
}

float rotr3(float x, float n) {
    return floor(x / pow(2.0, n)) + mod(x * pow(2.0, 3.0 - n), 8.0);
}

float mod2(float x) {
    return mod(floor(x), 2.0);
}

vec3 cube(float x) {
    return vec3(mod2(x), mod2(x / 2.0), mod2(x / 4.0));
}

void main() {
    float aspectRatio = resolution.y / resolution.x;
    float cubeIdx = floor(vertexId / VERTEX_COUNT_FOR_CUBE);
    float faceIdx = mod(floor(vertexId / VERTEX_COUNT_FOR_SURFACE), SURFACE_COUNT_FOR_CUBE);
    float faceDiv3 = floor(faceIdx / 3.0);
    float faceMod3 = mod(faceIdx, 3.0);
    float quadIdx = mod(vertexId, VERTEX_COUNT_FOR_SURFACE);
    float baseIdx = faceIdx * SURFACE_COUNT_FOR_CUBE;
    float vertIdx = abs(faceDiv3 == 0.0 ? quadIdx - 2.0 : 3.0 - quadIdx);
    vec3 pos = cube(rotr3(vertIdx + faceDiv3 * 4.0,  faceMod3));
    pos -= 0.5; // Fix center for cube.
    pos *= CUBE_SIZE;

    // Rotate first not to make rotation for whole boxes.
    mat3 rotX = rotateX(time);
    mat3 rotY = rotateY(time);
    pos *= rotX * rotY;

    // Layout
    float gridX = (mod(cubeIdx, 20.0) - 10.0) / 10.0;
    float gridY = floor(cubeIdx / 20.0 - 10.0) / 10.0;
    pos.x += gridX;
    pos.y += gridY;
    pos.x *= aspectRatio;
    gl_Position = vec4(pos, 1.0);

    float colIdx = faceIdx + 1.0;
    v_color = vec4(mod2(colIdx), mod2(colIdx / 2.0), mod2(colIdx / 4.0), 1.0);
}
