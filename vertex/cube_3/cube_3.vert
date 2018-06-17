float VERTEX_COUNT_FOR_SURFACE = 6.0;
float SURFACE_COUNT_FOR_CUBE = 6.0;
float VERTEX_COUNT_FOR_CUBE = VERTEX_COUNT_FOR_SURFACE * SURFACE_COUNT_FOR_CUBE;  // 36

float CUBE_SIZE = 0.08;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

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
    vec3 cubePosition = cube(rotr3(vertIdx + faceDiv3 * 4.0,  faceMod3));

    cubePosition -= 0.5; // Fix center for cube.
    cubePosition *= CUBE_SIZE * map(sin(time * 10.0 *  fract(cubeIdx * 0.9)), -1.0, 1.0, 0.5, 1.0);

    // Rotate first not to make rotation for whole boxes.
    mat3 rotX = rotateX(time);
    mat3 rotY = rotateY(time);
    cubePosition *= rotX * rotY;

    // Layout
  	float cubeCount = 10.0;
    float gridX = (fract(cubeIdx / cubeCount) - 0.5) * 1.5;
    float gridY = floor(cubeIdx / cubeCount) * 0.1 - 1.0;

    cubePosition.x += gridX;
    cubePosition.y += gridY;
    gl_Position = vec4(cubePosition, 1.0);

  	vec3 color = vec3(faceIdx / SURFACE_COUNT_FOR_CUBE);
  	color.b += fract(cubeIdx / 6.0);
  	v_color = vec4(color, 1.0);
}