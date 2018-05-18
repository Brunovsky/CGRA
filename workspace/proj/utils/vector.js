'use strict';

// Skip this ugliness
// Detects if P is written as [X, Y, Z] or {X: X, Y: Y, Z: Z}, returns later.
function makeVector(P) {
    if (Array.isArray(P) && P.length === 3) {
        return {
            X: P[0],
            Y: P[1],
            Z: P[2]
        };
    } else if (Array.isArray(P) && P.length === 2) {
        return {
            X: P[0],
            Y: 0,
            Z: P[1]
        };
    } else if (P.X != null && P.Y != null && P.Z != null) {
        return {
            X: P.X,
            Y: P.Y,
            Z: P.Z
        };
    } else if (P.X != null || P.Y != null || P.Z != null) {
        return {
            X: P.X || 0,
            Y: P.Y || 0,
            Z: P.Z || 0
        };
    } else {
        console.log("Invalid makeVector for ", P);
        return null;
    }
}



function nullVector() {
    return {
        X: 0,
        Y: 0,
        Z: 0
    };
}

function xVector() {
    return {
        X: 1,
        Y: 0,
        Z: 0
    };
}

function yVector() {
    return {
        X: 0,
        Y: 1,
        Z: 0
    };
}

function zVector() {
    return {
        X: 0,
        Y: 0,
        Z: 1
    };
}

function scaleVector(k, a) {
    return {
        X: k * a.X,
        Y: k * a.Y,
        Z: k * a.Z
    };
}

function flipVector(a) {
    return {
        X: -a.X,
        Y: -a.Y,
        Z: -a.Z
    }
}

function multVectors(a, k, b) {
    return {
        X: a.X + k * b.X,
        Y: a.Y + k * b.Y,
        Z: a.Z + k * b.Z
    };
}

function addVectors(a, b) {
    return {
        X: a.X + b.X,
        Y: a.Y + b.Y,
        Z: a.Z + b.Z
    };
}

function subVectors(a, b) {
    return {
        X: a.X - b.X,
        Y: a.Y - b.Y,
        Z: a.Z - b.Z
    };
}

function crossProduct(a, b) {
    return {
        X: a.Y * b.Z - a.Z * b.Y,
        Y: a.Z * b.X - a.X * b.Z,
        Z: a.X * b.Y - a.Y * b.X
    };
}

function dotProduct(a, b) {
    return a.X * b.X + a.Y * b.Y + a.Z * b.Z;
}

function norm(a) {
    return Math.sqrt(dotProduct(a, a));
}

function normalize(a) {
    // Protect against division by zero.
    const N = norm(a);
    if (N === 0) {
        return nullVector();
    } else {
        return scaleVector(1 / N, a);
    }
}

function cosVectors(a, b) {
    return dotProduct(a, b) / (norm(a) * norm(b));
}

function sinVectors(a, b) {
    return norm(crossProduct(a, b)) / (norm(a) * norm(b));
}

function multMatrix(M, a) {
    return {
        X: M[0][0] * a.X + M[0][1] * a.Y + M[0][2] * a.Z,
        Y: M[1][0] * a.X + M[1][1] * a.Y + M[1][2] * a.Z,
        Z: M[2][0] * a.X + M[2][1] * a.Y + M[2][2] * a.Z
    };
}

function rotateXaxis(theta, a) {
    const cos = Math.cos, sin = Math.sin;
    const M = [
        [          1,           0,           0],
        [          0,  cos(theta), -sin(theta)],
        [          0,  sin(theta),  cos(theta)]
    ];
    return multMatrix(M, a);
}

function rotateYaxis(theta, a) {
    const cos = Math.cos, sin = Math.sin;
    const M = [
        [ cos(theta),           0,  sin(theta)],
        [          0,           1,           0],
        [-sin(theta),           0,  cos(theta)]
    ];
    return multMatrix(M, a);
}

function rotateZaxis(theta, a) {
    const cos = Math.cos, sin = Math.sin;
    const M = [
        [ cos(theta), -sin(theta),           0],
        [ sin(theta),  cos(theta),           0],
        [          0,           0,           1]
    ];
    return multMatrix(M, a);
}

function unrotateXaxis(theta, a) {
    return rotateXaxis(-theta, a);
}

function unrotateYaxis(theta, a) {
    return rotateYaxis(-theta, a);
}

function unrotateZaxis(theta, a) {
    return rotateZaxis(-theta, a);
}

function vectorBisector(a, b) {
    return scaleVector(norm(addVectors(a, b)),
        normalize(addVectors(normalize(a), normalize(b))));
}

// Return the orientation of triangle given by vertices A, B, C in this order,
// aka (B-A)x(C-B). The caller should make sense of the result by accessing .X, .Y, .Z
// in its own context.
function triangleOrientation(A, B, C) {
    let vA = makeVector(A), vB = makeVector(B), vC = makeVector(C);
    return crossProduct(subVectors(vB, vA), subVectors(vC, vB));
}

// Consider a function f : R --> AB, where f(0) = A and f(1) = B.
// Then compute f(t).
function interpolateVectors(t, A, B) {
    let vA = makeVector(A), vB = makeVector(B);
    return addVectors(scaleVector(1 - t, vA), scaleVector(t, vB));
}

// Bisector of vectors ba and bc with magnitude ||ba+bc||.
function triangleBisector(A, B, C) {
    let vA = makeVector(A), vB = makeVector(B), vC = makeVector(C);
    let v1 = subVectors(vA, vB), v2 = subVectors(vC, vB);
    return vectorBisector(v1, v2);
}
