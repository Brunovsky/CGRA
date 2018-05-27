let carFunctionSmooth = (function() {
    'use strict';
    // <!--- Start of variables
    const dCar = 5.00;
    const lCar = 2.00;
    const hCar = 2.00;
    const bCar = 0.32 / hCar;
    const lAxis = lCar / 2;
    const rWheel = 0.45;
    const lWheel = (lCar / 2) * 0.40;
    const rOut = 0.50;
    const xWheelFront = dCar * 0.18;
    const xWheelBack = dCar * 0.81;
    const dWheel = xWheelBack - xWheelFront;

    const cuteU = 1.03;
    const cuteV = 1.04;

    const ceilX = 2.82;
    const ceilY = 1.910 * cuteU * cuteV;
    const rearX = 1.70;
    const rearY = 1.36;
    const frontY = 0.75;
    const backY = 0.95;

    // Knots X00 ... X99 of the spline
    const X00 = 0.00;
    const X10 = dCar * 0.01;
    const X20 = dCar * 0.09375;
    const X30 = dCar * 0.265625;
    const X40 = dCar * 0.421875;
    const X50 = dCar * 0.71875;
    const X60 = dCar * 0.84375;
    const X70 = dCar * 0.953125;
    const X80 = dCar * 1.00;
    const X90 = dCar * 1.00;
    const X99 = dCar;

    const X27 = xWheelFront - rOut;
    const X67 = xWheelBack + rOut;

    // Knots Y00 ... Y99 of the spline
    const Y00 = 0.00;
    const Y10 = hCar * 0.25;
    const Y20 = hCar * 0.55;
    const Y30 = hCar * 0.60;
    const Y40 = hCar * 0.90;
    const Y50 = hCar * 0.90;
    const Y60 = hCar * 0.70;
    const Y70 = hCar * 0.65;
    const Y80 = hCar * 0.30;
    const Y90 = hCar * bCar;
    const Y99 = 0.00;

    const Y27 = hCar * bCar;
    const Y67 = hCar * bCar;

    // Derivatives of the spline at the knots
    const d00  =  0.00;
    const d10  =  4.80;
    const d20  =  0.20;
    const d30l =  0.05;
    const d30r =  1.00;
    const d40  =  0.40;
    const d50  = -0.40;
    const d60  = -0.50;
    const d70  = -0.10;
    const d80  = -13.0;
    const d90  =  0.00;
    const d99  =  0.00;

    const d27 = 0;
    const d67 = 0;

    // Fourth-power coefficient of each polynomial, chosen by hand.
    const w10 = -20.00;
    const w20 =   0.00;
    const w30 =   0.00;
    const w40 =  -0.12;
    const w50 =   0.00;
    const w60 =   0.00;
    const w70 = -300.0;

    const wF = 7;
    const wB = 10;

    // Knots
    const P00 =  {X:X00, Y:Y00, d:d00};
    const P10 =  {X:X10, Y:Y10, d:d10};
    const P20 =  {X:X20, Y:Y20, d:d20};
    const P30l = {X:X30, Y:Y30, d:d30l};
    const P30r = {X:X30, Y:Y30, d:d30r};
    const P40 =  {X:X40, Y:Y40, d:d40};
    const P50 =  {X:X50, Y:Y50, d:d50};
    const P60 =  {X:X60, Y:Y60, d:d60};
    const P70 =  {X:X70, Y:Y70, d:d70};
    const P80 =  {X:X80, Y:Y80, d:d80};
    const P90 =  {X:X90, Y:Y90, d:d90};
    const P99 =  {X:X99, Y:Y99, d:d99};

    const U10 =  {X:X10, Y:Y10, d:-d10/3};
    const U80 =  {X:X80, Y:Y80, d:-d80/6};
    const U27 =  {X:X27, Y:Y27, d:d27};
    const U67 =  {X:X67, Y:Y67, d:d67};
    // ----> End of variables

    // Polynomials of the spline
    let f10 = protoHermitePolynomial(w10, P10,  P20);
    let f20 = protoHermitePolynomial(w20, P20,  P30l);
    let f30 = protoHermitePolynomial(w30, P30r, P40);
    let f40 = protoHermitePolynomial(w40, P40,  P50);
    let f50 = protoHermitePolynomial(w50, P50,  P60);
    let f60 = protoHermitePolynomial(w60, P60,  P70);
    let f70 = protoHermitePolynomial(w70, P70,  P80);

    let gF = protoHermitePolynomial(wF, U10, U27);
    let gB = protoHermitePolynomial(wB, U67, U80);

    /**
     * The hood as seen through the side of the car.
     */
    let hermite = function(X) {
        if (X < X20) return f10(X);
        if (X < X30) return f20(X);
        if (X < X40) return f30(X);
        if (X < X50) return f40(X);
        if (X < X60) return f50(X);
        if (X < X70) return f60(X);
                     return f70(X);
    }

    let hoodContour = function(X) {
        return hermite(X);
    }

    /**
     * The base as seen through the side of the car.
     */
    let baseContour = function(X) {
        const abs = Math.abs, sqrt = Math.sqrt;

        // Close to wheel 1
        let dist1 = abs(X - xWheelFront);
        if (dist1 <= rOut) {
            return sqrt(rOut * rOut - dist1 * dist1) + rWheel;
        }

        // Close to wheel 2
        let dist2 = abs(X - xWheelBack);
        if (dist2 <= rOut) {
            return sqrt(rOut * rOut - dist2 * dist2) + rWheel;
        }

        if (X < X27) return gF(X);

        if (X > X67) return gB(X);

        // Not close enough to either wheel
        return hCar * bCar;
    }

    let cute = function(u, v) {
        return polynomial(2 * u - 1, 1 - cuteU, 0, cuteU)
            * polynomial(2 * v - 1, 1 - cuteV, 0, cuteV);
        // approx 1, but larget the closer u and v are to 0.5.
    }

    /**
     *  ________       ______
     * |        | 1   |      |
     * |        |     |      |
     * |  Hood  | u   |      |
     * |        |     |      |
     * |________| 0   |______|
     * 0    v   1
     *    front
     */
    function hood(u, v) {
        let X = linearMap(u, [0, 1], [X10, X80]);
        let Y = hoodContour(X) * cute(u, v);
        let Z = linearMap(v, [0, 1], [-lAxis, lAxis]);
        return {X: X, Y: Y, Z: Z};
    }

    function leftSide(u, v) {
        let X = linearMap(u, [0, 1], [X10, X80]);
        let Y = linearMap(v, [1, 0], [baseContour(X), hoodContour(X) * cute(u, v)]);
        let Z = lAxis;
        return {X: X, Y: Y, Z: Z};
    }

    function rightSide(u, v) {
        let X = linearMap(u, [0, 1], [X10, X80]);
        let Y = linearMap(v, [1, 0], [baseContour(X), hoodContour(X) * cute(u, v)]);
        let Z = -lAxis;
        return {X: X, Y: Y, Z: Z};
    }

    function base(u, v) {
        let X = linearMap(u, [0, 1], [X10, X80]);
        let Z = linearMap(v, [0, 1], [-lAxis, lAxis]);
        return {X: X, Y: baseContour(X), Z: Z};
    }

    function sideCoordsMap(u, v) {
        let X = linearMap(u, [0, 1], [X10, X80]);
        let Y = linearMap(v, [1, 0], [baseContour(X), hoodContour(X) * cute(u, v)]);
        return {
            U: u,
            V: linearMap(Y, [hCar, 0], [0, 1])
        };
    }

    let car = {
        dCar: dCar,
        lCar: lCar,
        hCar: hCar,
        bCar: bCar,
        lAxis: lAxis,
        xWheelFront: xWheelFront,
        xWheelBack: xWheelBack,
        rWheel: rWheel,
        lWheel: lWheel,
        dWheel: dWheel,
        rOut: rOut,

        ceilX: ceilX,
        ceilY: ceilY,

        rearX: rearX,
        rearY: rearY,
        frontY: frontY,
        backY: backY,

        hoodContour: hoodContour,
        baseContour: baseContour,

        hood: hood,
        left: leftSide,
        right: rightSide,
        base: base,
        sideCoordsMap: sideCoordsMap,

        hoodBoundaries: [0, 1, 0, 1],
        leftBoundaries: [0, 1, 0, 1],
        rightBoundaries: [0, 1, 0, 1],
        frontWindowBoundaries: [X30 / dCar, X40 / dCar, 0.05, 0.95],
        backWindowBoundaries: [X50 / dCar, X60 / dCar, 0.05, 0.95],
        slices: 128
    };

    return car;
})();

// Not updated...
/**
let carFunctionPolygonal = (function() {
    'use strict';
    // <!--- Start of variables
    const dCar = 5.00;
    const lCar = 2.00;
    const hCar = 1.80;
    const bCar = 0.16;
    const lAxis = lCar / 2;
    const rWheel = 0.45;
    const lWheel = (lCar / 2) * 0.40;
    const rOut = 0.50;
    const xWheelFront = dCar * 0.19;
    const xWheelBack = dCar * 0.78;
    const dWheel = xWheelBack - xWheelFront;
    const ceilX = 2.5;
    const ceilY = 1.85;
    const rearX = 1.70;
    const rearY = 1.36;
    const frontY = 0.75;

    // Knots X00 ... X99 of the polygonal line
    const X00 = 0.00;
    const X10 = dCar * 0.00;
    const X15 = dCar * 0.02;
    const X20 = dCar * 0.09375;
    const X30 = dCar * 0.265625;
    const X40 = dCar * 0.421875;
    const X50 = dCar * 0.71875;
    const X60 = dCar * 0.84375;
    const X70 = dCar * 0.953125;
    const X75 = dCar * 0.985;
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
    const Y90 = 0.00;
    const Y99 = 0.00;

    const P00 = {X:X00, Y:Y00};
    const P10 = {X:X10, Y:Y10};
    const P15 = {X:X15, Y:Y15};
    const P20 = {X:X20, Y:Y20};
    const P30 = {X:X30, Y:Y30};
    const P40 = {X:X40, Y:Y40};
    const P50 = {X:X50, Y:Y50};
    const P60 = {X:X60, Y:Y60};
    const P70 = {X:X70, Y:Y70};
    const P75 = {X:X75, Y:Y75};
    const P80 = {X:X80, Y:Y80};
    const P90 = {X:X90, Y:Y90};
    const P99 = {X:X99, Y:Y99};
    // ----> End of variables

    // Rectangles of the polygonal line
    const r10 = X => interpolate(X, P10, P15);
    const r15 = X => interpolate(X, P15, P20);
    const r20 = X => interpolate(X, P20, P30);
    const r30 = X => interpolate(X, P30, P40);
    const r40 = X => interpolate(X, P40, P50);
    const r50 = X => interpolate(X, P50, P60);
    const r60 = X => interpolate(X, P60, P70);
    const r70 = X => interpolate(X, P70, P75);
    const r75 = X => interpolate(X, P75, P80);

    // The hood as seen through the side of the car.
    let hoodContour = function(X) {
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

    // The base as seen through the side of the car.
    let baseContour = function(X) {
        const abs = Math.abs, sqrt = Math.sqrt;

        // Close to wheel 1
        let dist1 = abs(X - xWheelFront);
        if (dist1 <= rOut) {
            return sqrt(rOut * rOut - dist1 * dist1) + rWheel;
        }

        // Close to wheel 2
        let dist2 = abs(X - xWheelBack);
        if (dist2 <= rOut) {
            return sqrt(rOut * rOut - dist2 * dist2) + rWheel;
        }

        // Not close enough to either wheel
        return hCar * bCar;
    }

    //
    //  ________       ______
    // |        | 1   |      |
    // |        |     |      |
    // |  Hood  | u   |      |
    // |        |     |      |
    // |________| 0   |______|
    // 1    v   0
    //    front
    // 
    function hood(u, v) {
        let X = linearMap(u, [0, 1], [X10, X80]);
        let Y = hoodContour(X);
        let Z = linearMap(v, [0, 1], [-lCar / 2, lCar / 2]);
        return {X: X, Y: Y, Z: Z};
    }

    function leftSide(u, v) {
        let X = linearMap(u, [0, 1], [X10, X80]);
        let Y = linearMap(v, [1, 0], [baseContour(X), hoodContour(X)]);
        let Z = lCar / 2;
        return {X: X, Y: Y, Z: Z};
    }

    function rightSide(u, v) {
        let X = linearMap(u, [0, 1], [X10, X80]);
        let Y = linearMap(v, [1, 0], [baseContour(X), hoodContour(X)]);
        let Z = -lCar / 2;
        return {X: X, Y: Y, Z: Z};
    }

    function sideCoordsMap(u, v) {
        let X = linearMap(u, [0, 1], [X00, X90]);
        let Y = linearMap(v, [1, 0], [baseContour(X), hoodContour(X)]);
        return {
            U: u,
            V: linearMap(Y, [hCar, 0], [0, 1])
        };
    }

    let car = {
        dCar: dCar,
        lCar: lCar,
        hCar: hCar,
        bCar: bCar,
        lAxis: lAxis,
        xWheelFront: xWheelFront,
        xWheelBack: xWheelBack,
        rWheel: rWheel,
        lWheel: lWheel,
        dWheel: dWheel,
        rOut: rOut,

        ceilX: ceilX,
        ceilY: ceilY,

        rearX: rearX,
        rearY: rearY,
        frontY: frontY,

        hoodContour: hoodContour,
        baseContour: baseContour,

        hood: hood,
        left: leftSide,
        right: rightSide,
        sideCoordsMap: sideCoordsMap,

        hoodBoundaries: [0, 1, 0, 1],
        leftBoundaries: [0, 1, 0, 1],
        rightBoundaries: [0, 1, 0, 1],
        frontWindowBoundaries: [X30 / dCar, X40 / dCar, 0.05, 0.95],
        backWindowBoundaries: [X50 / dCar, X60 / dCar, 0.05, 0.95],
        slices: 128
    };

    return car;
})();
*/
