/*{
    "pixelRatio": 1,
    "vertexCount": 3000,
    "vertexMode": "POINTS",
    "PASSES": [{
        "vs": "./vertex_3.vert",
    }],
    "server": 3000,
}*/
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec4 v_color;
varying vec2 v_uv;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

// Convert the v_uv range (-1.0 ~ 1.0) to vu range.
// The position for right edge on display is over 1.0
vec2 getAsUvRange() {
	vec2 minUv = (0.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 maxUv = resolution.xy / min(resolution.x, resolution.y);

    return vec2(
        map(v_uv.x, -1.0, 1.0, minUv.x, maxUv.x),
        map(v_uv.y, -1.0, 1.0, minUv.y, maxUv.y)
    );
}

void main( void ) {
	// If resolution.x > resolution.y
	// the range for y is -1.0 ~ 1.0, range for x is (-1.0 ~ 1.0) * resolution.x / resolution.y
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    vec2 new_v_uv = getAsUvRange();

	// Repetition.
	// ex.
	// v_uv: 0.1  0.1  0.1
	// uv  : 0.11 0.12 0.13
	vec2 repeatedUv = (uv - new_v_uv) * 1.0;

	vec3 color = vec3(smoothstep(0.0, 0.02, distance(vec2(0.0), repeatedUv)));

	gl_FragColor = vec4(color, 1.0) * v_color;
}
