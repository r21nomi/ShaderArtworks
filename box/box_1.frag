/*{
    "glslify": true,
    "server": 3000
}*/

precision mediump float;
uniform vec2 resolution;
uniform float time;

#pragma glslify: box = require(../glslify/glslify-box.frag)
#pragma glslify: map = require(../glslify/glslify-map.frag)

void main( void ) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    vec3 color = vec3(0.0, 0.0, 1.0);

    for (float i = 0.2; i <= 1.0; i += 0.1) {
        float size = 1.0 - fract(time * (i * 2.0));
        float angle = map(i, 0.2, 1.0, 0.0, 360.0);
        vec2 position = vec2(uv.x + cos(angle), uv.y + sin(angle));
        float b = box(position, size * 0.8);

        if (mod(i * 10.0, 2.0) == 0.0) {
            color.r += b;
        } else {
            color.g += b;
        }
    }

	gl_FragColor = vec4(color, 1.0);
}
