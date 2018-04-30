// Car zSurface function
let carFunction = (function() {
	'use strict';
	const base = 1.5;
	
	// Knots A...H of the spline
	//   === X ===            === Y ===      === 1st Derivate ===
	const Ax = 0.0;      const Ay = base;     const dA = 5.8;
	const Bx = 3.0;      const By = 5.5;      const dB = 0.2;
	const Cx = 8.5;      const Cy = 6.0;      const dCl = 0.05;  const dCr = 1.0; // discontinuity
	const Dx = 13.5;     const Dy = 9.0;      const dD = 0.4;
	const Ex = 23.0;     const Ey = 9.0;      const dE = -0.4;
	const Fx = 27.0;     const Fy = 7.0;      const dF = -0.5;
	const Gx = 30.5;     const Gy = 6.5;      const dG = -0.1;
	const Hx = 32.0;     const Hy = base;     const dH = -15.0;

	// Fourth-power coefficient of each polynomial, chosen by hand.
	const w1 = -0.09, w2 = 0.0, w3 = 0.0, w4 = -0.0007, w5 = 0.0, w6 = 0.0, w7 = -1.6;

	/**
	 * Compute 4th-degree polynomial
	 * u4 X^4  +  u3 X^3  +  u2 X^2  +  u1 X  +  u0
	 */
	function poly(X, u4, u3, u2, u1, u0) {
		return u4 * ((X * X) * (X * X)) + u3 * (X * X * X) + u2 * (X * X) + u1 * X + u0;
	}

	/**
	 * Polynomial #1
	 * Knots: A -> B
	 */
	function f1(X) {
		const u3 = 1229/1350, u2 = -341/100, u1 = 29/5, u0 = 3/2;
		return poly(X, w1, u3, u2, u1, u0);
	}

	/**
	 * Polynomial #2
	 * Knots: B -> C
	 */
	function f2(X) {
		const u3 = 3/1331, u2 = -699/13310, u1 = 3023/6655, u0 = 30274/6655;
		return poly(X, w2, u3, u2, u1, u0);
	}

	/**
	 * Polynomial #3
	 * Knots: C -> D
	 */
	function f3(X) {
		const u3 = 1/125, u2 = -81/250, u1 = 2387/500, u0 = -16083/1000;
		return poly(X, w3, u3, u2, u1, u0);
	}

	/**
	 * Polynomial #4
	 * Knots: D -> E
	 */
	function f4(X) {
		const u3 = 511/10000, u2 = -1071129/760000, u1 = 6613289/380000, u0 = -54386253/760000;
		return poly(X, w4, u3, u2, u1, u0);
	}

	/**
	 * Polynomial #5
	 * Knots: E -> F
	 */
	function f5(X) {
		const u3 = 1/160, u2 = -77/160, u1 = 1891/160, u0 = -13487/160;
		return poly(X, w5, u3, u2, u1, u0);
	}

	/**
	 * Polynomial #6
	 * Knots: F -> G
	 */
	function f6(X) {
		const u3 = -44/1715, u2 = 3893/1715, u1 = -229703/3430, u0 = 2282101/3430;
		return poly(X, w6, u3, u2, u1, u0);
	}

	/**
	 * Polynomial #7
	 * Knots: G -> H
	 */
	function f7(X) {
		const u3 = 26494/135, u2 = -81241/9, u1 = 8303773/45, u0 = -381926443/270;
		return poly(X, w7, u3, u2, u1, u0);
	}

	/**
	 * Spline Function
	 * Forwards X to the appropriate polynomial.
	 * X is not checked to be in the interval [A, H]
	 * to allow for derivate calculation at the limits :-)
	 */
	function main(X) {
		if (X < Bx) return f1(X);
		if (X < Cx) return f2(X);
		if (X < Dx) return f3(X);
		if (X < Ex) return f4(X);
		if (X < Fx) return f5(X);
		if (X < Gx) return f6(X);
		            return f7(X);
	}

	// Now comes the part where we modify main(X) based on the value of Y.
	// This is just a stub at the moment (an 8th-degree even polynomial, very bad)
	function yModify(Z, Y) {
		const u8 = -0.0000035, u6 = 0.000085, u4 = -0.0004520406, u2 = -0.0002816925, u0 = 1;
		return (Z - Ay) * poly(Y * Y, u8, u6, u4, u2, u0) + Ay;
	}

	// So this is the car function at the moment
	function car(X, Y) {
		return yModify(main(X), Y);
	}

	return car;
})();

let carProportions = [0, 32, -5.5, 5.5];

let carSlices = 128;



class Car extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.car = new zSurface(scene, carFunction, carProportions, carSlices);
	};

	display()
	{
		this.car.display();
	};
};