/**
 * poly.js
 *
 * The function polynomial(X, ...coefs) computes the value of the polynomial with
 * coefficients coefs (degree descending) at real X, and returns a real.
 *
 * The function polyDerivative(X, ...coefs) computes the derivative of said polynomial.
 *
 * The function hermitePolynomial(w, I, F) is used for the car hood. It is used to
 * implement a 4th degree spline of polynomials in the xOy plane following
 * the hermite fashion (of specifying derivatives at the end points).
 */

function polynomial(X, ...coefs) {
    let val = 0;
    for (let i = 0; i < coefs.length; ++i) {
        val = val * X + coefs[i];
    }
    return val;
}

function polyDerivative(X, ...coefs) {
    let val = 0;
    let k = coefs.length;
    for (let i = 0; i < coefs.length - 1; ++i) {
        val = val * X + (--k * coefs[i]);
    }
    return val;
}

polynomial.derivative = polyDerivative;

/**
 * Compute the 4th degree polynomial starting at I = (I.X, I.Y) and ending at F = (F.X, F.Y)
 * with slope I.d at I and slope F.d at F.
 * The 4th degree coefficient w is given.
 *
 * This is the solution of the system:
 *
 * [  1       0       0       0       0  ] [ u4 ]   [  w ]
 * [ Ix^4    Ix^3    Ix^2    Ix^1     1  ] [ u3 ]   [ Iy ]
 * [ Fx^4    Fx^3    Fx^2    Fx^1     1  ] [ u2 ] = [ Fy ]
 * [4Ix^3   3Ix^2   2Ix^1     1       0  ] [ u1 ]   [ dI ]
 * [4Fx^3   3Fx^2   2Fx^1     1       0  ] [ u0 ]   [ dF ]
 */
function hermitePolynomial(w, I, F) {
    let det = (I.X - F.X) ** 3;

    // u4 X**4
    let u4 = w;

    // u3 X**3
    let u3 = 2 * w * ((I.X ** 4) - (2 * F.X * I.X ** 3) + (2 * F.X ** 3 * I.X) - (F.X ** 4));
    u3 += (F.X - I.X) * (I.d + F.d);
    u3 += 2 * (I.Y - F.Y);
    u3 = -u3 / det;

    // u2 X**2
    let u2 = w * ((I.X ** 5) + (F.X * I.X ** 4) - (8 * F.X ** 2 * I.X ** 3) + (8 * F.X ** 3 * I.X ** 2) - (F.X ** 4 * I.X) - (F.X ** 5));
    u2 += I.d * ((2 * F.X ** 2) - (F.X * I.X) - (I.X ** 2));
    u2 -= F.d * ((2 * I.X ** 2) - (I.X * F.X) - (F.X ** 2));
    u2 += 3 * (I.X + F.X) * (I.Y - F.Y);
    u2 = u2 / det;

    // u1 X
    let u1 = 2 * w * ((F.X * I.X ** 5) - (2 * F.X ** 2 * I.X ** 4) + (2 * F.X ** 4 * I.X ** 2) - (F.X ** 5 * I.X));
    u1 += I.d * ((-2 * F.X * I.X ** 2) + (F.X ** 2 * I.X) + (F.X ** 3));
    u1 -= F.d * ((-2 * I.X * F.X ** 2) + (I.X ** 2 * F.X) + (I.X ** 3));
    u1 += 6 * F.X * I.X * (I.Y - F.Y);
    u1 = -u1 / det;

    // u0
    let u0 = w * ((F.X ** 2 * I.X ** 5) - (3 * F.X ** 3 * I.X ** 4) + (3 * F.X ** 4 * I.X ** 3) - (F.X ** 5 * I.X ** 2));
    u0 += I.d * ((I.X * F.X ** 3) - (I.X ** 2 * F.X ** 2));
    u0 -= F.d * ((F.X * I.X ** 3) - (F.X ** 2 * I.X ** 2));
    u0 += 3 * F.X * I.X * (F.X * I.Y - I.X * F.Y) + (F.Y * I.X ** 3) - (I.Y * F.X ** 3);
    u0 = u0 / det;

    let poly = function(X) {
        return polynomial(X, u4, u3, u2, u1, u0);
    }

    console.log(u4, u3, u2, u1, u0);
    return poly;
}
