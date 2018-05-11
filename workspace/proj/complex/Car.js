let carHood = (function() {
	'use strict';
	const base = 1.5;
	
	// Knots A...H of the spline
	//   === X ===             === Y ===              === 1st Derivate ===
	const Ax =  0.00;     const Ay = base + 0.00;     const dA  =  5.80;
	const Bx =  3.00;     const By = base + 4.00;     const dB  =  0.20;
	const Cx =  8.50;     const Cy = base + 4.50;     const dCl =  0.05;  const dCr = 1.0; // discontinuity
	const Dx = 13.50;     const Dy = base + 7.50;     const dD  =  0.40;
	const Ex = 23.00;     const Ey = base + 7.50;     const dE  = -0.40;
	const Fx = 27.00;     const Fy = base + 5.50;     const dF  = -0.50;
	const Gx = 30.50;     const Gy = base + 5.00;     const dG  = -0.10;
	const Hx = 32.00;     const Hy = base + 0.00;     const dH  = -15.0;

	// Fourth-power coefficient of each polynomial, chosen by hand.
	const w1 = -0.09, w2 = 0.0, w3 = 0.0, w4 = -0.0007, w5 = 0.0, w6 = 0.0, w7 = -1.6;

	/**
	 * Polynomials of the spline
	 */
	let f1 = hermitePolynomial(w1, {X:Ax, Y:Ay, d:dA}, {X:Bx, Y:By, d:dB});
	let f2 = hermitePolynomial(w2, {X:Bx, Y:By, d:dB}, {X:Cx, Y:Cy, d:dCl});
	let f3 = hermitePolynomial(w3, {X:Cx, Y:Cy, d:dCr}, {X:Dx, Y:Dy, d:dD});
	let f4 = hermitePolynomial(w4, {X:Dx, Y:Dy, d:dD}, {X:Ex, Y:Ey, d:dE});
	let f5 = hermitePolynomial(w5, {X:Ex, Y:Ey, d:dE}, {X:Fx, Y:Fy, d:dF});
	let f6 = hermitePolynomial(w6, {X:Fx, Y:Fy, d:dF}, {X:Gx, Y:Gy, d:dG});
	let f7 = hermitePolynomial(w7, {X:Gx, Y:Gy, d:dG}, {X:Hx, Y:Hy, d:dH});

	/**
	 * Spline Function
	 * Forwards X to the appropriate polynomial.
	 * X is not checked to be in the interval [A, H]
	 * to allow for derivate calculation at the limits :-)
	 */
	let hood = function(X) {
		if (X < Bx) return f1(X);
		if (X < Cx) return f2(X);
		if (X < Dx) return f3(X);
		if (X < Ex) return f4(X);
		if (X < Fx) return f5(X);
		if (X < Gx) return f6(X);
		            return f7(X);
	}

	hood.derivate = function(X) {
		if (X < Bx) return f1.derivative(X);
		if (X < Cx) return f2.derivative(X);
		if (X < Dx) return f3.derivative(X);
		if (X < Ex) return f4.derivative(X);
		if (X < Fx) return f5.derivative(X);
		if (X < Gx) return f6.derivative(X);
		            return f7.derivative(X);
	}

	return hood;
})();

let carProportions = [0, 32, -5.5, 5.5];

let carSlices = 128;



class Car extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.car = new zSurface(scene, carHood, carProportions, carSlices);
	};

	display()
	{
		this.car.display();
	};
};