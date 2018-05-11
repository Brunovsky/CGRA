let carHoodSurface = (function() {
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
	let f1 = protoHermitePolynomial(w1, {X:Ax, Y:Ay, d:dA}, {X:Bx, Y:By, d:dB});
	let f2 = protoHermitePolynomial(w2, {X:Bx, Y:By, d:dB}, {X:Cx, Y:Cy, d:dCl});
	let f3 = protoHermitePolynomial(w3, {X:Cx, Y:Cy, d:dCr}, {X:Dx, Y:Dy, d:dD});
	let f4 = protoHermitePolynomial(w4, {X:Dx, Y:Dy, d:dD}, {X:Ex, Y:Ey, d:dE});
	let f5 = protoHermitePolynomial(w5, {X:Ex, Y:Ey, d:dE}, {X:Fx, Y:Fy, d:dF});
	let f6 = protoHermitePolynomial(w6, {X:Fx, Y:Fy, d:dF}, {X:Gx, Y:Gy, d:dG});
	let f7 = protoHermitePolynomial(w7, {X:Gx, Y:Gy, d:dG}, {X:Hx, Y:Hy, d:dH});

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

	hood.proportions = [0, 32, -11 / 2, 11 / 2];
	hood.slices = 128;

	return hood;
})();

let carHoodPolygonal = (function() {
	'use strict';
	// globals
	const dCar = 5.00;
	const lCar = 2.00;
	const hCar = 1.80;
	const bCar = 0.16;
	const dWheel = 3.00;
	const rWheel = 0.45;
	const xWheel = dCar * 0.19;

	// Knots X00 ... X99 of the polygonal line
	const X00 = 0.00;
	const X10 = dCar * 0.00;
	const X15 = dCar * 0.02;
	const X20 = dCar * 0.10;
	const X30 = dCar * 0.28;
	const X40 = dCar * 0.40;
	const X50 = dCar * 0.68;
	const X60 = dCar * 0.78;
	const X70 = dCar * 0.92;
	const X75 = dCar * 0.98;
	const X80 = dCar * 1.00;
	const X90 = dCar;
	const X99 = dCar;

	// Knots Y00 ... Y99 of the polygonal line
	const Y00 = 0.00;
	const Y10 = hCar * bCar;
	const Y15 = hCar * 0.54;
	const Y20 = hCar * 0.60;
	const Y30 = hCar * 0.66;
	const Y40 = hCar * 0.96;
	const Y50 = hCar * 0.93;
	const Y60 = hCar * 0.70;
	const Y70 = hCar * 0.65;
	const Y75 = hCar * 0.60;
	const Y80 = hCar * bCar;
	const Y90 = hCar;
	const Y99 = hCar;

	const P00 = {X:X00, Y:Y00};
	const P10 = {X:X10, Y:Y10}; const P15 = {X:X15, Y:Y15};
	const P20 = {X:X20, Y:Y20};
	const P30 = {X:X30, Y:Y30};
	const P40 = {X:X40, Y:Y40};
	const P50 = {X:X50, Y:Y50};
	const P60 = {X:X60, Y:Y60};
	const P70 = {X:X70, Y:Y70}; const P75 = {X:X75, Y:Y75};
	const P80 = {X:X80, Y:Y80};
	const P90 = {X:X90, Y:Y90};
	const P99 = {X:X99, Y:Y99};

	const r10 = protoInterpolate(P10, P15);
	const r15 = protoInterpolate(P15, P20);
	const r20 = protoInterpolate(P20, P30);
	const r30 = protoInterpolate(P30, P40);
	const r40 = protoInterpolate(P40, P50);
	const r50 = protoInterpolate(P50, P60);
	const r60 = protoInterpolate(P60, P70);
	const r70 = protoInterpolate(P70, P75);
	const r75 = protoInterpolate(P75, P80);

	let hood = function(X) {
		if (X < X15) return r10(X);
		if (X < X20) return r15(X);
		if (X < X30) return r20(X);
		if (X < X40) return r30(X);
		if (X < X50) return r40(X);
		if (X < X60) return r50(X);
		if (X < X70) return r60(X);
		if (X < X75) return r70(X);
		             return r75(X);
	}

	hood.proportions = [0, dCar, -lCar / 2, lCar / 2];
	hood.slices = 128;

	return hood;
})();



class Car extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.car = new zSurface(scene,
			carHoodPolygonal,
			carHoodPolygonal.proportions,
			carHoodPolygonal.slices);
	};

	display()
	{
		this.car.display();
	};
};
