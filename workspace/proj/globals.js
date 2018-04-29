// The entire scene's background color, RGB
let BG_COLOR = [0.03, 0.06, 0.02, 1.0];

// Global ambient light
let AMBIENT = [0.5, 0.5, 0.5, 1.0];





function heart(t) {
	const sin = Math.sin, cos = Math.cos;
	return {
		X: 2 * sin(t) * sin(t) * sin(t),
		Y: (13 * cos(t) - 5 * cos(2*t) - 2 * cos(3*t) - cos(4*t)) / 8
	};
}

function butterfly(t) {
	const sin = Math.sin, cos = Math.cos, pow = Math.pow, e = Math.E;
	const p = pow(e, cos(t)) - 2 * cos(4*t) + pow(sin(t/12), 5);
	return {
		X: sin(t) * p,
		Y: cos(t) * p
	};
}

function trifolium(theta) {
	const sin = Math.sin, cos = Math.cos;
	return cos(theta) * (4 * sin(theta) * sin(theta) - 1);
}

function eightSurface(u, v) {
	const sin = Math.sin, cos = Math.cos;
	return {
		X: cos(u) * sin(2*v),
		Y: sin(u) * sin(2*v),
		Z: sin(v)
	};
}

function astroidalEllipsoid(u, v) {
	const sin = Math.sin, cos = Math.cos;
	const s3u = sin(u) * sin(u) * sin(u);
	const c3u = cos(u) * cos(u) * cos(u);
	const s3v = sin(v) * sin(v) * sin(v);
	const c3v = cos(v) * cos(v) * cos(v);
	return {
		X: c3u * c3v,
		Y: s3u * c3v,
		Z: s3v
	};
}

function kissSurface(u, v) {
	const sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt;
	return {
		X: v * v * sqrt((1 - v) / 2) * cos(u),
		Y: v * v * sqrt((1 - v) / 2) * sin(u),
		Z: v
	}
}

function bohemianDome(u, v) {
	const sin = Math.sin, cos = Math.cos;
	return {
		X: 0.5 * cos(u),
		Y: 1.5 * cos(v) + 0.5 * sin(u),
		Z: 1 * sin(v)
	};
}

function sineSurface(u, v) {
	const sin = Math.sin, cos = Math.cos;
	return {
		X: sin(u),
		Y: sin(v),
		Z: sin(u + v)
	};
}

function cayleySurface(x, y) {
	return x * y - Math.cbrt(x) / 3;
}

function mobiusStrip(u, v) {
	const sin = Math.sin, cos = Math.cos;
	return {
		X: 2 * cos(u) + v * cos(u / 2),
		Y: 2 * sin(u) + v * cos(u / 2),
		Z: v * sin(u / 2)
	}
}

function peanoSurface(x, y) {
	return (2 * x * x - y) * (y - x * x);
}

function boursMinimal(r, theta) {
	const sin = Math.sin, cos = Math.cos, pow = Math.pow;
	return {
		X: r * cos(theta) - r * r * cos(2*theta) / 2,
		Y: r * sin(theta) - r * r * sin(2*theta) / 2,
		Z: (4/3) * pow(r, 3/2) * cos((3/2)*theta)
	}
}




function protoFolium(a, b, theta) {
	const sin = Math.sin, cos = Math.cos;
	return cos(theta) * (4 * a * sin(theta) * sin(theta) - b);
}

function protoTorus(c, a, u, v) {
	// c -> radius, from center of torus to center of torus tube
	// a -> radius of torus tube
	// c > a -> ring torus
	// c = a -> horn torus
	// c < a -> spindle torus
	const sin = Math.sin, cos = Math.cos;
	return {
		X: (c + a * cos(v)) * cos(u),
		Y: (c + a * cos(v)) * sin(u),
		Z: a * sin(v)
	};
}

function protoBohemianDome(a, b, c, u, v) {
	const sin = Math.sin, cos = Math.cos;
	return {
		X: a * cos(u),
		Y: b * cos(v) + a * sin(u),
		Z: c * sin(v)
	};
}