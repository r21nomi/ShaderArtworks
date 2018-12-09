#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const float EPS = 0.001;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Camera {
	vec3 position;
	vec3 direction;
	vec3 side;
	vec3 top;
	float depth;
};

struct Ray {
	vec3 origin;
	vec3 direction;
};

Camera createCamera(vec3 position, vec3 direction, float depth) {
	Camera cam;
	cam.position = position;
	cam.direction = direction;
	cam.top = vec3(0.0,  1.0,  0.0);
	cam.side = cross(cam.direction, cam.top);
	cam.depth = depth;

	return cam;
}

Ray createRay(vec2 position, Camera camera) {
	vec3 direction = normalize(
		position.x * camera.side
		+ position.y * camera.top
		+ camera.direction * camera.depth
	);

	Ray ray;
	ray.origin = camera.position;
	ray.direction = direction;

	return ray;
}

mat2 rotate2D(float angle) {
	return mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
}

float distBox(vec3 p, vec3 width) {
	vec3 d = abs(p) - width;
	return length(max(d, 0.0)) + min(max(d.x,max(d.y, d.z)), 0.0);
}

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

float distFunc(vec3 p) {
	vec3 _p = p;
	_p = mod(p, 2.0) - 1.0;
	_p.xz *= rotate2D(floor(time) + exposeInOut(fract(time)));

	vec3 _p2 = p;
	_p2.x = 0.5 - 0.4 * sin(time + p.x / 0.8);
	_p2.y = 0.8 + 0.4 * cos(time + p.y / 0.8);
	_p2.z = 0.4 - 0.8 * sin(time + p.z / 0.8);

	float box1 = distBox(_p, vec3(0.3));
	float box2 = distBox(_p2, vec3(0.8));

	float dist = max(box1, box2);

	return dist;
}


vec3 getNormal(vec3 p){
	return normalize(vec3(
		distFunc(p + vec3(EPS, 0.0, 0.0)) - distFunc(p + vec3(-EPS, 0.0, 0.0)),
		distFunc(p + vec3(0.0,  EPS, 0.0)) - distFunc(p + vec3(0.0,  -EPS, 0.0)),
		distFunc(p + vec3(0.0, 0.0,  EPS)) - distFunc(p + vec3(0.0, 0.0,  -EPS))
	));
}

vec3 getRayPosition(Ray ray, float rayLen) {
	return ray.origin + ray.direction * rayLen;
}

void main(void) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	Camera cam = createCamera(
		vec3(0.0, 0.0, -time),
		vec3(0.0, 0.0, -1.0),
		1.0
	);

	Ray ray = createRay(uv, cam);

	float rayLen = 0.001;
	vec3 rayPosition = getRayPosition(ray, rayLen);
	float dist;
	bool hit = false;

	for (int i = 0; i < 100; i++) {
		dist = distFunc(rayPosition);
		rayLen += dist;
		rayPosition = getRayPosition(ray, rayLen);

		if (abs(dist) < EPS) {
			hit = true;
			break;
		}
	}

	vec3 color = vec3(0.0);
	vec3 lightDirection = normalize(vec3(0.5, 0.5, 1.0));

	if (hit) {
		vec3 normal = getNormal(rayPosition);
		float diff = clamp(dot(lightDirection, normal), 0.1, 1.0);
		color = vec3(0.0, 0.4, 0.8) * diff;
	} else {
		color = vec3(0.0, 0.0, 0.0);
	}

	vec3 backgroudColor = vec3(0.8, 0.1, 0.8);
	color = mix(backgroudColor, color, exp(-0.1 * rayLen));

	gl_FragColor = vec4(color, 1.0);
}