#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
#define HALF_PI 1.5707963267948966

vec2 mirrorTile(vec2 _st, float _zoom) {
	_st *= _zoom;
	
	if (fract(_st.y * 0.5) > 0.5){
		_st.x = _st.x + 0.5;
		_st.y = 1.0 - _st.y;
	}
	
	return fract(_st);
}

float fillY(vec2 _st, float _pct, float _antia) {
	return  smoothstep(_pct - _antia, _pct, _st.y);
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float elasticOut(float t) {
	return sin(-13.0 * (t + 1.0) * HALF_PI) * pow(2.0, -10.0 * t) + 1.0;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) /min(resolution.x, resolution.y);
	
	uv.y += time * 0.2;

	float vv = elasticOut(map(abs(sin(time * 0.5)), 0.0, 1.0, 0.0, 1.0));
	vec2 s = vec2(vv, 1.0);
	vec2 tile = mirrorTile(uv * s, 5.0);
	
	float x = tile.x * 2.0;
	float a = floor(1.0 + sin(x * PI));
	float b = floor(1.0 + sin((x + 1.0) * PI));
	float f = fract(x);
	
	float v = fillY(tile, mix(a, b, f), 0.01);
	vec3 color = vec3(v, v * 0.5, v * fract(uv.y));

	gl_FragColor = vec4(color, 1.0);
}