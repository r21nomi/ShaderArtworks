// http://glslsandbox.com/e#40543.0
// See https://thebookofshaders.com/12/?lan=jp

#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI  6.283

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float speed = 2.0;

vec2 random2(vec2 p) {
	return fract(sin(vec2(dot(p,vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main() {
	vec2 st = gl_FragCoord.xy / resolution.xy;
	st.x *= resolution.x / resolution.y;
	vec3 color = vec3(0.0);
    
	// Scale
	st *= 8.0;
    
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
			//offset = 0.5 + 0.5 * sin(time + TWO_PI * offset);
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

	color.g += step(0.05, m_dist);
    
	gl_FragColor = vec4(color, 1.0);
}