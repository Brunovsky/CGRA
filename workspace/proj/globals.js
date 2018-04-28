// The entire scene's background color, RGB
var BG_COLOR = [0.03, 0.06, 0.02, 1.0];

// Global ambient light
var AMBIENT = [0.5, 0.5, 0.5, 1.0];

// Car zSurface function
var carFunction = (function() {
	// X-coordinate of reference points A...H
	const Ax = 0.0, Bx = 3.0, Cx = 8.5, Dx = 13.5, Ex = 23.0, Fx = 27.0, Gx = 30.5, Hx = 32;
	// Y-coordinate of reference points A...H
	const Ay = 1.5, By = 5.5, Cy = 6.0, Dy = 9.0, Ey = 9.0, Fy = 7.0, Gy = 6.5, Hy = Ay;
	// Derivates at reference points A...H, derivate discontinuity at C.
	const dA = 5.8, dB = 0.2, dCl = 0.05, dCr = 1, dD = 0.4, dE = -0.4, dF = -0.5, dG = -0.1, dH = -15.0;
	// Fourth-power coefficient for each function
	const w1 = -0.09, w2 = 0.0, w3 = 0.0, w4 = -0.0007, w5 = 0.0, w6 = 0.0, w7 = -1.6;

	function poly(X, u4, u3, u2, u1, u0) {
		return u4 * ((X * X) * (X * X)) + u3 * (X * X * X) + u2 * (X * X) + u1 * X + u0;
	}

	function yModify(val, Y) {
		const u8 = -0.0000035, u6 = 0.000085, u4 = -0.0004520406, u2 = -0.0002816925, u0 = 1;
		return (val - Ay) * poly(Y * Y, u8, u6, u4, u2, u0) + Ay;
	}

	function f1(X, Y) {
		const u3 = 1229/1350, u2 = -341/100, u1 = 29/5, u0 = 3/2;
		return yModify(poly(X, w1, u3, u2, u1, u0), Y);
	}

	function f2(X, Y) {
		const u3 = 3/1331, u2 = -699/13310, u1 = 3023/6655, u0 = 30274/6655;
		return yModify(poly(X, w2, u3, u2, u1, u0), Y);
	}

	function f3(X, Y) {
		const u3 = 1/125, u2 = -81/250, u1 = 2387/500, u0 = -16083/1000;
		return yModify(poly(X, w3, u3, u2, u1, u0), Y);
	}

	function f4(X, Y) {
		const u3 = 511/10000, u2 = -1071129/760000, u1 = 6613289/380000, u0 = -54386253/760000;
		return yModify(poly(X, w4, u3, u2, u1, u0), Y);
	}

	function f5(X, Y) {
		const u3 = 1/160, u2 = -77/160, u1 = 1891/160, u0 = -13487/160;
		return yModify(poly(X, w5, u3, u2, u1, u0), Y);
	}

	function f6(X, Y) {
		const u3 = -44/1715, u2 = 3893/1715, u1 = -229703/3430, u0 = 2282101/3430;
		return yModify(poly(X, w6, u3, u2, u1, u0), Y);
	}

	function f7(X, Y) {
		const u3 = 26494/135, u2 = -81241/9, u1 = 8303773/45, u0 = -381926443/270;
		return yModify(poly(X, w7, u3, u2, u1, u0), Y);
	}

	return function(X, Y) {
		if (X < Bx) return f1(X, Y);
		if (X < Cx) return f2(X, Y);
		if (X < Dx) return f3(X, Y);
		if (X < Ex) return f4(X, Y);
		if (X < Fx) return f5(X, Y);
		if (X < Gx) return f6(X, Y);
		            return f7(X, Y);
	}
})();

var carProportions = [0, 32, -5.5, 5.5];

var carSlices = 128;







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

function protoFolium(a, b, theta) {
	const sin = Math.sin, cos = Math.cos;
	return cos(theta) * (4 * a * sin(theta) * sin(theta) - b);
}

function trifolium(theta) {
	const sin = Math.sin, cos = Math.cos;
	return cos(theta) * (4 * sin(theta) * sin(theta) - 1);
}

function protoTorus(c, a, u, v) {
	const sin = Math.sin, cos = Math.cos;
	return {
		X: (c + a * cos(v)) * cos(u),
		Y: (c + a * cos(v)) * sin(u),
		Z: a * sin(v)
	};
}