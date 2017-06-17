// http://glslsandbox.com/e#41002.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const float EPS = 0.0001;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

vec3 repetition(vec3 ray, float offset) {
	return mod(ray, offset) - offset / 2.0;
}

vec2 repetition(vec2 st) {
	return fract(vec2(st));
}

float sphereDist(vec3 ray, vec3 target, float size) {
	return length(target - ray) - size;
}

float boxDist(vec3 ray, vec3 size, float round) {
	return length(max(abs(ray) - size, 0.0)) - round;
}

//Draw box and sphere
float sceneDist(vec3 ray) {
	vec3 repeatedRay = repetition(ray, 6.0);
	float boxDist = boxDist(repeatedRay, vec3(map(sin(time * 5.0), -1.0, 1.0, 0.3, 0.2), map(sin(time * 5.0), -1.0, 1.0, 0.6, 0.9), 0.1), 0.1);
	float sphereDist = sphereDist(repeatedRay, vec3(0.0), 0.6);
	
	return min(
		boxDist,
		sphereDist
	);
}

vec3 getNormal(vec3 p){
	return normalize(vec3(
		sceneDist(p + vec3(EPS, 0.0, 0.0)) - sceneDist(p + vec3(-EPS, 0.0, 0.0)),
		sceneDist(p + vec3(0.0,  EPS, 0.0)) - sceneDist(p + vec3(0.0,  -EPS, 0.0)),
		sceneDist(p + vec3(0.0, 0.0,  EPS)) - sceneDist(p + vec3(0.0, 0.0,  -EPS))
	));
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	vec3 cameraPosition = vec3(0.0,  mouse.y * 2.0 - 1.0, -time * 3.0);
	vec3 cameraDirection = vec3(0.0,  0.0, -1.0);
	vec3 cameraUp  = vec3(0.0,  1.0,  0.0);
	vec3 cameraSide = cross(cameraDirection, cameraUp);
	float targetDepth = 1.0;
	
	vec3 ray = normalize(cameraSide * st.x + cameraUp * st.y + cameraDirection * targetDepth);
	
	vec3 rayPosition = cameraPosition;
	float distance = 0.0;
	float currentRayLength = 0.0;
	bool hit = false;
	
	vec3 lightDirection = vec3(cameraPosition.xy, 0.7);
	
	for (int i = 0; i < 16; i++) {
		distance = sceneDist(rayPosition);
		currentRayLength += distance;
		rayPosition = cameraPosition + ray * currentRayLength;
		
		if (abs(distance) < EPS) {
			hit = true;
			break;
		}
	}
	
	if (hit) {
		vec3 normal = getNormal(rayPosition);
		float diff = clamp(dot(lightDirection, normal), 0.1, 1.0);
		gl_FragColor = vec4(vec3(diff, sin(time) + 1.0 / 2.0, 0.0), 1.0);
		
	} else {
		gl_FragColor = vec4(vec3(0.12), 1.0);
	}
}