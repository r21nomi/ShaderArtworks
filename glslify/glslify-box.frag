float box(vec2 uv, float size) {
	vec2 rect = step(-size, uv) * (1.0 - step(size, uv));
	return min(rect.x, rect.y);
}

#pragma glslify: export(box)
