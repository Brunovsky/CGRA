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
            Y: P[1],
            Z: 0
        };
    } else if (P.X != null && P.Y != null && P.Z != null) {
        return {
            X: P.X,
            Y: P.Y,
            Z: P.Z
        };
    } else if (P.X != null && P.Y != null) {
        return {
            X: P.X,
            Y: P.Y,
            Z: 0
        };
    } else {
        console.log("Error (anyToXYZ): Invalid P");
        return null; // let it crash
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

function dotProduct(a, b) {
    return {
        X: a.X * b.X,
        Y: a.Y * b.Y,
        Z: a.Z * b.Z
    };
}

function crossProduct(a, b) {
    return {
        X: a.Y * b.Z - a.Z * b.Y,
        Y: a.Z * b.X - a.X * b.Z,
        Z: a.X * b.Y - a.Y * b.X
    };
}

function norm(a) {
    return Math.sqrt(a.X * a.X + a.Y * a.Y + a.Z * a.Z);
}

function normalize(a) {
    let N = norm(a);
    return {
        X: a.X / N,
        Y: a.Y / N,
        Z: a.Z / N
    };
}

function cosVectors(a, b) {
    return dotProduct(a, b) / (norm(a) * norm(b));
}

function sinVectors(a, b) {
    return crossProduct(a, b) / (norm(a) * norm(b));
}

function angleVectors(a, b) {
    return Math.acos(cosVectors(a,b));
}

let rightHandOrientation = true, leftHandOrientation = false;

// Return the orientation of triangle given by vertices A, B, C in this order
// @return rightHandOrientation if the Z component of (B-A)x(C-B) is >= 0
// @return leftHandOrientation  if the Z component of (B-A)x(C-B) is < 0
function orientationRule(A, B, C) {
    let vA = makeVector(A), vB = makeVector(B), vC = makeVector(C);
    let N = crossProduct(subVectors(vA, vB), subVectors(vB, vC));

    if (N.Z >= 0) {
        return rightHandOrientation;
    } else {
        return leftHandOrientation;
    }
}

// Consider a function f : R --> AB, where f(0) = A and f(1) = B.
// Then compute f(t).
function interpolateVectors(t, A, B) {
    let vA = makeVector(A), vB = makeVector(B);
    return addVectors(scaleVector(vA, 1 - t), scaleVector(vB, t));
}

function protoInterpolateVectors(A, B) {
    let vA = makeVector(A), vB = makeVector(B);
    return t => addVectors(scaleVector(vA, 1 - t), scaleVector(vB, t));
}