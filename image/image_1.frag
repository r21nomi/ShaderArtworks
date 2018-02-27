/*{
	"glslify": true,
	"IMPORTED": {
		"img1": {
			"PATH": "thumb.jpg",
		},
	},
	"server": 3000,
}*/

precision mediump float;
uniform vec2 resolution;
uniform float time;

uniform sampler2D img1;
uniform sampler2D backbuffer;

#pragma glslify: box = require(../glslify/glslify-box.frag)
#pragma glslify: map = require(../glslify/glslify-map.frag)

float random(in vec2 uv){
	return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
}

float obliqueLine(vec2 uv){
	return step(0.6, fract((uv.x + uv.y + time * 0.8) * 4.0));
}

void main() {
	vec2 uv = gl_FragCoord.xy / min(resolution.x, resolution.y);

	uv.x += time * 0.08;

	vec2 scaledUv = uv * 5.0;
	vec2 repeatedUv = fract(scaledUv);

	vec4 img = (texture2D(img1, repeatedUv));
	vec4 color = img;

    float b = box(uv, 0.8);
	float offset = map(sin(time), -1.0, 1.0, 0.2, 0.35);
	if ((color.r + color.g + color.b) / 3.0 < offset) {
		float randomOffset = random(floor(scaledUv));
		float line = obliqueLine(uv * 12.0 + time * randomOffset * 0.3);
		color.b += line * randomOffset;
		color.r /= line;
	}

	gl_FragColor = color;
}
