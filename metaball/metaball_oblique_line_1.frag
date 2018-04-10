// http://glslsandbox.com/e#46205.3

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.141592653589793
#define TWO_PI  6.283

uniform vec2 resolution;
uniform float time;

float backOut(float t) {
	float f = 1.0 - t;
	return 1.0 - (pow(f, 3.0) - f * sin(f * PI));
}

vec2 random(vec2 p) {
	return fract(sin(vec2(dot(p,vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float obliqueLine(vec2 uv){
	return step(0.6, fract((uv.x + uv.y + time * 0.8) * 4.0));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	vec2 scaledUv = uv * 8.0;
	
	scaledUv -= 0.5;
	scaledUv *= rotate2d(time * 0.2);
	scaledUv += 0.5;
	
	vec2 i_st = floor(scaledUv);
	vec2 f_st = fract(scaledUv);

	float m_dist = 1.0;
	
	float t = time * 1.5;
	float speed = (floor(t) + backOut(fract(t)));
	
	for (int j = -1; j <= 1; j++) {
		for (int i = -1; i <= 1; i++) {
			// Neighbor place in the grid
			vec2 neighbor = vec2(float(i), float(j));
            
			// Random position from current + neighbor place in the grid
			vec2 offset = random(i_st + neighbor);

			// Animate the offset
			offset = vec2(
				map(sin(speed + TWO_PI * offset).x, -1.0, 1.0, 0.0, 1.0),
				map(sin(speed + TWO_PI * offset).y, -1.0, 1.0, 0.0, 1.0)
			);
			
			// Position of the cell             
			vec2 pos = neighbor + offset - f_st;
            
			// Cell distance
			float dist = length(pos);

			// Metaball
			m_dist = min(m_dist, m_dist * dist);
		}
	}
	
	float cell = 1.0 - step(0.1, m_dist);
	
	vec3 color = vec3(0.05);
	color += cell;
	
	color.r *= obliqueLine(uv * 4.0);
	color.g *= obliqueLine(uv * 8.0);

	gl_FragColor = vec4(color, 1.0);
}