/**
 * bezier.js
 *
 * The function protoBezierCurve3D(...points) with n+1 arguments returns a function
 * that takes a real argument t and computes the n-th degree bezier curve
 * with the specified control points, each of the form {X: Y: Z:} or [X, Y, Z].
 *
 * The function protoBezierSurface(...points) takes a (n+1)(m+1) matrix argument
 * and returns a function that computes the uvSurface.
 */

function binomial(n, k) {
    if (k < 0 || k > n) return 0;
    if (k == 0 || k == n) return 1;

    k = Math.min(k, n - k);

    let val = 1;
    while (k > 0) {
        val *= (n-- / k--);
    };

    return Math.round(val);
}

function bernstein(n, i, t) {
    return binomial(n, i) * (t ** i) * ((1 - t) ** (n - i));
}

function protoBezierCurve(...points) {
    const n = points.length - 1;

    const bern = bernstein;
    const mult = multVectors;

    let bezier = function(t) {
        let Point = {X: 0, Y: 0, Z: 0};
        for (let i = 0; i <= n; ++i) {
            Point = mult(Point, points[i], bern(n, i, t));
        }
        return Point;
    }

    return bezier;
}

function protoBezierSurface(...points) {
    const n = points.length - 1;
    const m = points[0].length - 1;

    const bern = bernstein;
    const mult = multVectors;

    let bezier = function(u, v) {
        let Point = {X: 0, Y: 0, Z: 0};
        for (let i = 0; i <= n; ++i) {
            for (let j = 0; j <= m; ++j) {
                Point = mult(Point, points[i][j], bern(n, i, u) * bern(m, j, v));
            }
        }
        return Point;
    }

    return bezier;
}
