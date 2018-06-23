// https://www.vertexshaderart.com/art/QgXakG4wfDMZ4Au6n

float CUBE_SIZE = 0.08;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float hash(float p) {
	vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
}

vec3  saturate(vec3 x)  {
	return clamp(x, 0.0, 1.0);
}

vec3 hue2rgb(float h) {
    h = fract(h) * 6.0 - 2.0;
    return saturate(vec3(abs(h - 1.0) - 1.0, 2.0 - abs(h), 2.0 - abs(h - 2.0)));
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

float VERTEX_COUNT_FOR_SURFACE = 6.0;
float SURFACE_COUNT_FOR_CUBE = 6.0;
float VERTEX_COUNT_FOR_CUBE = VERTEX_COUNT_FOR_SURFACE * SURFACE_COUNT_FOR_CUBE;

vec3 cube(in float id) {
    float faceId = mod(floor(id / VERTEX_COUNT_FOR_SURFACE), SURFACE_COUNT_FOR_CUBE);
    float faceDiv3 = floor(faceId / 3.0);
    float faceMod3 = mod(faceId, 3.0);
    float quadId = mod(id, VERTEX_COUNT_FOR_SURFACE);
    float baseId = faceId * SURFACE_COUNT_FOR_CUBE;
    float newVertId = abs(faceDiv3 == 0.0 ? quadId - 2.0 : 3.0 - quadId);

  	float x = rotr3(newVertId + faceDiv3 * 4.0,  faceMod3);

    return vec3(mod2(x), mod2(x / 2.0), mod2(x / 4.0));
}

void main() {
    vec3 cubePosition = cube(vertexId);
    float cubeId = floor(vertexId / VERTEX_COUNT_FOR_CUBE);
    float faceId = mod(floor(vertexId / VERTEX_COUNT_FOR_SURFACE), SURFACE_COUNT_FOR_CUBE);

  	float scaleOffset = mod(cubeId, 5.0);
  	float snd = texture2D(sound, vec2(mix(0.1, 0.5, hash(scaleOffset)), hash(scaleOffset) / 5.)).x;
  	float scaleBySound = 0.2 * mix(0.0, 4.0, pow(snd, 5.0));

    cubePosition -= 0.5; // Fix center for cube.
    cubePosition *= scaleBySound * map(sin(time * 10.0 *  fract(cubeId * 0.9)), -1.0, 1.0, 0.5, 1.0);

  	cubePosition.x += sin(cubeId) * 0.5;
  	cubePosition.z += cos(cubeId) * 0.5;

    // Rotate first not to make rotation for whole boxes.
    mat3 rotX = rotateX(time);
    mat3 rotY = rotateY(time);
    cubePosition *= rotX * rotY;

    // Layout
  	float cubeCount = 20.0;
    float gridX = (fract(cubeId / cubeCount) - 0.5) * 1.5;
    float gridY = floor(cubeId / cubeCount) * 0.1 - 1.0;

    cubePosition.x += gridX;
    cubePosition.y += gridY;
    gl_Position = vec4(cubePosition, 1.0);

  	vec3 color = vec3(faceId / SURFACE_COUNT_FOR_CUBE);
  	color += fract(cubeId / 6.0);

	float pump = step(0.3, snd);
  	color *= hue2rgb(cubeId * 0.5) * pump;
  	v_color = vec4(color, 1.0);
}