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



function scaleVector(a, k) {
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

function multVectors(a, b, k) {
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
    return scaleVector(a, 1 / norm(a));
}

function cosVectors(a, b) {
    return dotProduct(a, b) / (norm(a) * norm(b));
}

function sinVectors(a, b) {
    return norm(crossProduct(a, b)) / (norm(a) * norm(b));
}

// Return the orientation of triangle given by vertices A, B, C in this order,
// aka (B-A)x(C-B). The caller should make sense of the result by accessing .X, .Y, .Z
// in its own context.
function triangleOrientation(A, B, C) {
    let vA = makeVector(A), vB = makeVector(B), vC = makeVector(C);
    return crossProduct(subVectors(vA, vB), subVectors(vB, vC));
}

// Consider a function f : R --> AB, where f(0) = A and f(1) = B.
// Then compute f(t).
function interpolateVectors(t, A, B) {
    let vA = makeVector(A), vB = makeVector(B);
    return addVectors(scaleVector(vA, 1 - t), scaleVector(vB, t));
}
