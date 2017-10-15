/*{
    "pixelRatio": 1,
    "vertexCount": 3000,
    "vertexMode": "POINTS",
    //"server": 3000,
}*/
precision mediump float;
attribute float vertexId;
uniform float vertexCount;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
varying vec4 v_color;

void main() {
    float across = 30.0;
    float x = mod(vertexId, across);
    float y = floor(vertexId / across);
    vec2 uv = vec2(x / (across - 1.0), y / (across - 1.0)) * 2.0 - 1.0;

    float offsetX = sin(time + y * 0.2) * 0.2;
    float offsetY = sin(time + x * 0.3) * 0.1;
    uv.x += offsetX;
    uv.y += offsetY;

    gl_Position = vec4(uv, 0, 1);

    float sizeOffset = sin(time + x + y) * 5.0;
    gl_PointSize = 10.0 + sizeOffset;

    vec3 color = vec3(abs(uv.x), abs(uv.y), 1.0);
    v_color = vec4(color, 1);
}
