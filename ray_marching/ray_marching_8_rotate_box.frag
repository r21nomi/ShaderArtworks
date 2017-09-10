// http://glslsandbox.com/e#42386.2

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float EPS = 0.0001;
const float PI = 3.14159265358979323844;

float box(vec3 p) {
	return length(max(abs(p) - vec3(1.0), 0.0));
}

float sceneDist(vec3 ray) {
	return box(ray);
}

vec3 getNormal(vec3 p){
	return normalize(vec3(
		sceneDist(p + vec3(EPS, 0.0, 0.0)) - sceneDist(p + vec3(-EPS, 0.0, 0.0)),
		sceneDist(p + vec3(0.0,  EPS, 0.0)) - sceneDist(p + vec3(0.0,  -EPS, 0.0)),
		sceneDist(p + vec3(0.0, 0.0,  EPS)) - sceneDist(p + vec3(0.0, 0.0,  -EPS))
	));
}

// Referred from http://glslsandbox.com/e#42286.0
mat3 camera(vec3 cameraPosition, vec3 la) {
	vec3 roll = vec3(0, 1, 0);
	vec3 f = normalize(la - cameraPosition);
	vec3 r = normalize(cross(roll, f));
	vec3 u = normalize(cross(f, r));
	
	return mat3(r, u, f);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 -  resolution.xy ) / min(resolution.x, resolution.y);
	
	// Repetition.
	uv *= 3.0;
	uv = fract(uv);
	uv -= 0.5;  // Move box axis to center.
	
	float speed = time * 0.35;
	float angle = speed * 2.0 * PI * pow(floor(uv.x - 0.5), 50.0);
	float scale = 8.0;
	vec3 cameraPosition = scale * vec3(cos(angle), 0.5, -sin(angle));
	vec3 ray = camera(cameraPosition, vec3(0.0, 0.0, 0.0)) * normalize(vec3(uv, 2.0));  // Rotate box.
	
	uv += 0.5;
	
	vec3 rayPosition = cameraPosition;
	float distance = 0.0;
	float currentRayLength = 0.0;
	bool hit = false;
	
	for (int i = 0; i < 100; i++) {
		distance = sceneDist(rayPosition);
		currentRayLength += distance;
		rayPosition = cameraPosition + ray * currentRayLength;
		
		if (abs(distance) < EPS) {
			hit = true;
			break;
		}
	}
	
	vec3 color = vec3(0.0);
	vec3 lightDirection = normalize(vec3(1.0, 1.0, -2.0));
	
	if (hit) {
		vec3 normal = getNormal(rayPosition);
		float diff = clamp(dot(lightDirection, normal), 0.2, 1.0);
		color = vec3(1.0, 0.0, 1.0) * diff ;
		
	} else {
		color = vec3(0.1);
	}
	
	gl_FragColor = vec4(color, 1.0);
}