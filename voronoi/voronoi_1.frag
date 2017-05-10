// http://glslsandbox.com/e#40431.0
// See https://thebookofshaders.com/12/?lan=jp

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy / resolution.xy );
	st.x *= resolution.x / resolution.y;
	
	vec3 color;
	float m_dist = 1.0;
	vec2 m_point;
	
	st *= 3.0;
	
	vec2 i_st = floor(st);
	vec2 f_st = fract(st);
	
	// check contiguous tiles (9 tiles)
	for (int x = -1; x <= 1; x++) {
		for (int y = -1; y <= 1; y++) {
			vec2 neighbor = vec2(float(x), float(y));
			
			vec2 point = random2(i_st + neighbor);
			// animate
			point = 0.5 + 0.5 * sin(time * 2.0 * point);
			
			vec2 diff = neighbor + point - f_st;
			float dist = length(diff);
			
			// distance field
			// m_dist = min(m_dist, dist);
			
			// voronoi
			if (dist < m_dist) {
				m_dist = dist;
				m_point = point;
			}
		}
	}
	
	// voronoi
	//color += m_dist;
	color.rg += m_point.x;
	
	// cell
	color.r += 1.0 - step(0.02, m_dist);
	
	// grid
	//color += vec3(step(0.99, f_st.x) + step(0.99, f_st.y));

	gl_FragColor = vec4(color, 1.0);
}