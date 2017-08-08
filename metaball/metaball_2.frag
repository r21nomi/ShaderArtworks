// http://glslsandbox.com/e#41858.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define TWO_PI  6.283

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float speed = 2.0;

vec2 random2(vec2 p) {
	return fract(sin(vec2(dot(p,vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	st *= 10.0;
	
	st -= 0.5;
	st *= rotate2d(time * 0.2);
	st += 0.5;
	
	vec2 i_st = floor(st);
	vec2 f_st = fract(st);

	float m_dist = 1.0;
	
	for (int j = -1; j <= 1; j++) {
		for (int i = -1; i <= 1; i++) {
			// Neighbor place in the grid
			vec2 neighbor = vec2(float(i), float(j));
            
			// Random position from current + neighbor place in the grid
			vec2 offset = random2(i_st + neighbor);

			// Animate the offset
			offset = vec2(
				map(sin(time * speed + TWO_PI * offset).x, -1.0, 1.0, 0.0, 1.0),
				map(sin(time * speed + TWO_PI * offset).y, -1.0, 1.0, 0.0, 1.0)
			);
			
			// Position of the cell             
			vec2 pos = neighbor + offset - f_st;
            
			// Cell distance
			float dist = length(pos);

			// Metaball
			m_dist = min(m_dist, m_dist * dist);
		}
	}
	
	vec3 color = vec3(0.0);
	
	color.rb += smoothstep(0.1, 0.01, m_dist);
	
	// Spotlight
	color *= (1.0 - length(st * 0.08 ));

	gl_FragColor = vec4(color, 1.0);
}