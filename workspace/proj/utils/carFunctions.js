let carSmooth = (function() {
    'use strict';
    // <!--- Start of variables
    const dCar = 5.00;
    const lCar = 2.00;
    const hCar = 2.00;
    const bCar = 0.32 / hCar;
    const rWheel = 0.45;
    const rOut = 0.50;
    const xWheel1 = dCar * 0.20;
    const xWheel2 = dCar * 0.78;
    const dWheel = xWheel2 - xWheel1;

    // Knots X00 ... X99 of the spline
    const X00 = 0.00;
    const X10 = dCar * 0.00;
    const X20 = dCar * 0.09375;
    const X30 = dCar * 0.265625;
    const X40 = dCar * 0.421875;
    const X50 = dCar * 0.71875;
    const X60 = dCar * 0.84375;
    const X70 = dCar * 0.953125;
    const X80 = dCar * 1.00;
    const X90 = dCar * 1.00;
    const X99 = dCar;

    // Knots Y00 ... Y99 of the spline
    const Y00 = 0.00;
    const Y10 = hCar * bCar;
    const Y20 = hCar * 0.55;
    const Y30 = hCar * 0.60;
    const Y40 = hCar * 0.90;
    const Y50 = hCar * 0.90;
    const Y60 = hCar * 0.70;
    const Y70 = hCar * 0.65;
    const Y80 = hCar * bCar;
    const Y90 = hCar * bCar;
    const Y99 = hCar;

    // Derivatives of the spline at the knots
    const d00  =  0.00;
    const d10  =  5.80;
    const d20  =  0.20;
    const d30l =  0.05;
    const d30r =  1.00;
    const d40  =  0.40;
    const d50  = -0.40;
    const d60  = -0.50;
    const d70  = -0.10;
    const d80  = -15.0;
    const d90  =  0.00;
    const d99  =  0.00;

    // Fourth-power coefficient of each polynomial, chosen by hand.
    const w10 = -15.00;
    const w20 =   0.00;
    const w30 =   0.00;
    const w40 =  -0.12;
    const w50 =   0.00;
    const w60 =   0.00;
    const w70 = -200.0;

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
    // ----> End of variables

    /**
     * Polynomials of the spline
     */
    let f10 = protoHermitePolynomial(w10, P10,  P20);
    let f20 = protoHermitePolynomial(w20, P20,  P30l);
    let f30 = protoHermitePolynomial(w30, P30r, P40);
    let f40 = protoHermitePolynomial(w40, P40,  P50);
    let f50 = protoHermitePolynomial(w50, P50,  P60);
    let f60 = protoHermitePolynomial(w60, P60,  P70);
    let f70 = protoHermitePolynomial(w70, P70,  P80);

    let hood = function(X) {
        if (X < X20) return f10(X);
        if (X < X30) return f20(X);
        if (X < X40) return f30(X);
        if (X < X50) return f40(X);
        if (X < X60) return f50(X);
        if (X < X70) return f60(X);
                     return f70(X);
    }

    hood.derivate = function(X) {
        if (X < X20) return f10.derivative(X);
        if (X < X30) return f20.derivative(X);
        if (X < X40) return f30.derivative(X);
        if (X < X50) return f40.derivative(X);
        if (X < X60) return f50.derivative(X);
        if (X < X70) return f60.derivative(X);
                     return f70.derivative(X);
    }

    let under = function(X) {
        const abs = Math.abs, sqrt = Math.sqrt;

        let dist1 = abs(X - xWheel1);
        if (dist1 <= rOut) {
            return sqrt(rOut * rOut - dist1 * dist1) + rWheel;
        }

        let dist2 = abs(X - xWheel2);
        if (dist2 <= rOut) {
            return sqrt(rOut * rOut - dist2 * dist2) + rWheel;
        }

        return hCar * bCar;
    }

    let side = protoAreaMap(under, hood, [0, dCar]);

    //  _________________
    // |    |       |    |   u
    // |    |   .   |    |   |
    // |    |   .   |    |   |
    // |    |   .   |    |   +--->v
    //   ...   ...   ...
    // |____|_______|____|
    // 0   0.25   0.75   1
    //   A      B      C
    
    let S1 = 0, S2 = 0.25, S3 = 0.75, S4 = 1;

    let vMapA = protoLinearMap([S1, S2], [0, 1]); // left
    let vMapB = protoLinearMap([S2, S3], [0, 1]); // hood
    let vMapC = protoLinearMap([S3, S4], [1, 0]); // right

    let uMap = protoLinearMap([0, 1], [0, dCar]);
    let vMap = protoLinearMap([0, 1], [-lCar / 2, lCar / 2]);

    let main = function(u, v) {
        if (v <= S2) { // left
            let p = side(u, vMapA(v));
            return {
                X: p.X,
                Y: -lCar / 2,
                Z: p.Y
            };
        } else if (v <= S3) { // hood
            let X = uMap(u);
            return {
                X: X,
                Y: vMap(vMapB(v)),
                Z: hood(X)
            };
        } else { // right
            let p = side(u, vMapC(v));
            return {
                X: p.X,
                Y: lCar / 2,
                Z: p.Y
            };
        }
    }

    let smooth = {
        dCar: dCar,
        lCar: lCar,
        hCar: hCar,
        bCar: bCar,
        xWheel1: xWheel1,
        xWheel2: xWheel2,
        rWheel: rWheel,
        rOut: rOut,
        dWheel: dWheel,

        main: main,
        hood: hood,
        under: under,
        side: side,

        S1: S1, S2: S2, S3: S3, S4: S4,
        boundaries: [0, 1, 0, 1],
        slices: 128
    };

    return smooth;
})();

let carPolygonal = (function() {
    'use strict';
    // meta
    const dCar = 5.00;
    const lCar = 2.00;
    const hCar = 1.80;
    const bCar = 0.16;
    const rWheel = 0.45;
    const rOut = 0.50;
    const xWheel1 = dCar * 0.19;
    const xWheel2 = dCar * 0.78;
    const dWheel = xWheel2 - xWheel1;

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

    let under = function(X) {
        const abs = Math.abs, sqrt = Math.sqrt;

        let dist1 = abs(X - xWheel1);
        if (dist1 <= rOut) {
            return sqrt(rOut * rOut - dist1 * dist1) + rWheel;
        }

        let dist2 = abs(X - xWheel2);
        if (dist2 <= rOut) {
            return sqrt(rOut * rOut - dist2 * dist2) + rWheel;
        }

        return hCar * bCar;
    }

    let side = protoAreaMap(under, hood, [0, dCar]);

    //  _________________
    // |    |       |    |   u
    // |    |       |    |   |
    // |    |       |    |   |
    // |    |       |    |   +--->v
    //   ...   ...   ...
    // |____|_______|____|
    // 0   0.25   0.75   1
    //   A      B      C
    
    let S1 = 0, S2 = 0.25, S3 = 0.75, S4 = 1;

    let vMapA = protoLinearMap([S1, S2], [0, 1]);
    let vMapB = protoLinearMap([S2, S3], [0, 1]);
    let vMapC = protoLinearMap([S3, S4], [1, 0]);

    let uMap = protoLinearMap([0, 1], [0, dCar]);
    let vMap = protoLinearMap([0, 1], [-lCar / 2, lCar / 2]);

    let main = function(u, v) {
        if (v <= S2) {
            let p = side(u, vMapA(v));
            return {
                X: p.X,
                Y: -lCar / 2,
                Z: p.Y
            };
        } else if (v <= S3) {
            let X = uMap(u);
            return {
                X: X,
                Y: vMap(vMapB(v)),
                Z: hood(X)
            };
        } else {
            let p = side(u, vMapC(v));
            return {
                X: p.X,
                Y: lCar / 2,
                Z: p.Y
            };
        }
    }

    let polygonal = {
        dCar: dCar,
        lCar: lCar,
        hCar: hCar,
        bCar: bCar,
        xWheel1: xWheel1,
        xWheel2: xWheel2,
        rWheel: rWheel,
        rOut: rOut,
        dWheel: dWheel,

        main: main,
        hood: hood,
        under: under,
        side: side,

        S1: S1, S2: S2, S3: S3, S4: S4,
        boundaries: [0, 1, 0, 1],
        slices: 128
    };

    return polygonal;
})();
