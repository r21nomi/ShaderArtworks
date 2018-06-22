// https://www.vertexshaderart.com/art/jtFAXNm8ngq4kTFhA

#define NUM_SEGMENTS 128.0
#define NUM_POINTS (NUM_SEGMENTS * 2.0)
#define PI radians(180.0)

vec3  saturate(vec3 x)  {
	return clamp(x, 0.0, 1.0);
}

vec3 hue2rgb(float h) {
    h = fract(h) * 6.0 - 2.0;
    return saturate(vec3(abs(h - 1.0) - 1.0, 2.0 - abs(h), 2.0 - abs(h - 2.0)));
}

vec2 getCirclePoint(float id, float numCircles, float radiusOffset) {
  	float ux = floor(id / 6.0) + mod(id, 2.0);
  	float uy = mod(floor(id / 2.0) + floor(id / 3.0), 2.0);

  	float angle = ux / numCircles * PI * 2.0;
  	float c = cos(angle);
  	float s = sin(angle);

  	float radius = uy + radiusOffset;

  	float x = c * radius;
  	float y = s * radius;

  	return vec2(x, y);
}

void main() {
  	// Point num for simple circle with line.
  	float pointNumOfCircle = 20.0;

  	// Point num consist of circle.
  	float totalPointNumPerCircle = pointNumOfCircle * 6.0;

  	float circleId = floor(vertexId / totalPointNumPerCircle);
  	float numCircles = floor(vertexCount / totalPointNumPerCircle);

  	float down = floor(sqrt(numCircles));
  	float across = floor(numCircles / down);

  	float x = mod(circleId, across);
  	float y = floor(circleId / across);

  	float u = x / (across - 1.0);
  	float v = y / (across - 1.0);

  	float ux = u * 2.0 - 1.0;
  	float vy = v * 2.0 - 1.0;

  	float radiusOffset = abs(sin(time * 3.0 + circleId));
  	vec2 circleXY= getCirclePoint(vertexId, pointNumOfCircle, radiusOffset);

  	float su = abs(u - 0.5) * 1.0;
  	float sv = abs(v - 0.5) * 1.0;
  	float au = abs(atan(su, sv)) / PI;
  	float av = length(vec2(su, sv));
  	float snd = texture2D(sound, vec2(au * 0.05, av * 0.05)).a;

  	float scale = snd * 2.5;
  	vec2 xy = circleXY * 0.1 + vec2(ux, vy) * scale;
  	vec3 pos = vec3(xy * 0.5, 0.0);

  	gl_Position = vec4(pos, 1.0);
  	float pump = step(0.5, snd);
  	vec3 hue = hue2rgb(snd);
  	vec3 color = vec3(pump, pump, 0.5) * hue;

  	v_color = vec4(color, 1.0);
}
