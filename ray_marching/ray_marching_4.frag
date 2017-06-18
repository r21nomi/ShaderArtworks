// http://glslsandbox.com/e#41022.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const float EPS = 0.0001;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float exposeInOut(float t) {
	if (t == 0.0) {
		return 0.0;
	
	} else if (t == 1.0) {
		return 1.0;
	
	} else if ((t /= 0.5) < 1.0) {
		return 0.5 * pow(2.0, 10.0 * (t - 1.0));
	
	} else {
		return 0.5 * (-pow(2.0, -10.0 * --t) + 2.0);
	}
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

vec3 repetition(vec3 ray, float offset) {
	vec3 repeatedRay = mod(ray, offset) - offset / 2.0;
	return vec3(repeatedRay.x, ray.y, repeatedRay.z);
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
	vec3 repeatedRay = repetition(ray, 4.0);
	float boxDistance = boxDist(repeatedRay, vec3(0.5, 0.9, 0.0), 0.1);
	
	// left hole
	float sphereDistance = sphereDist(repeatedRay, vec3(-0.2,0.6, 0.0), 0.15);
	float sphereDistance2 = sphereDist(repeatedRay, vec3(-0.2,0.0, 0.0), 0.15);
	float sphereDistance3 = sphereDist(repeatedRay, vec3(-0.2,-0.6, 0.0), 0.15);
	// right hole
	float sphereDistance4 = sphereDist(repeatedRay, vec3(0.2,0.6, 0.0), 0.15);
	float sphereDistance5 = sphereDist(repeatedRay, vec3(0.2,0.0, 0.0), 0.15);
	float sphereDistance6 = sphereDist(repeatedRay, vec3(0.2,-0.6, 0.0), 0.15);
	
	float result = max(boxDistance, -sphereDistance);
	result = max(result,- sphereDistance2);
	result = max(result,- sphereDistance3);
	result = max(result,- sphereDistance4);
	result = max(result,- sphereDistance5);
	result = max(result,- sphereDistance6);
	
	return result;
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
	
	float t = time * 1.5;
	float step = 2.0;
	float easing =  exposeInOut(fract(t));
	float speed = (floor(t) + easing) * step;
	
	vec3 cameraPosition = vec3(speed,  mouse.y * 2.0 - 1.0, 0.0);
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
	
	for (int i = 0; i < 26; i++) {
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
		gl_FragColor = vec4(vec3(0.8, 0.7, 0.0), 1.0);
		
	} else {
		gl_FragColor = vec4(vec3(0.12), 1.0);
	}
}