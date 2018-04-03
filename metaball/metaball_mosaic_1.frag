// http://glslsandbox.com/e#46205.1

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

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	uv *= 8.0;
	
	uv -= 0.5;
	uv *= rotate2d(time * 0.2);
	uv += 0.5;
	
	vec2 i_st = floor(uv);
	vec2 f_st = fract(uv);

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
			float orb = 0.1 / length(vec2(0.0) - pos);
		}
	}
	
	float cell = 1.0 - step(0.1, m_dist);
	cell *= length(random(floor(uv * 8.0)));
	
	vec3 color = vec3(0.05);
	color.r += cell;

	gl_FragColor = vec4(color, 1.0);
}