// Converts [X, Y, Z] to {X: X, Y: Y, Z: Z}
function arrayToXYZ(P) {
    return {
        X: P[0],
        Y: P[1],
        Z: P[2]
    };
}

// Detects if P is written as [X, Y, Z] or {X: X, Y: Y, Z: Z}, returns later.
function anyToXYZ(P) {
    if (Array.isArray(P) && P.length >= 3) {
        return arrayToXYZ(P);
    } else if (P.X != null && P.Y != null && P.Z != null) {
        return P;
    } else {
        console.log("Error (anyToXYZ): Invalid P");
        return null; // let it crash
    }
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

let rightHandOrientation = true, leftHandOrientation = false;

// Return the orientation of triangle given by vertices A, B, C in this order
// @return rightHandOrientation if the Z component of (B-A)x(C-B) is >= 0
// @return leftHandOrientation  if the Z component of (B-A)x(C-B) is < 0
function orientationRule(A, B, C) {
    let vA = anyToXYZ(A), vB = anyToXYZ(B), vC = anyToXYZ(C);
    let N = crossProduct(subVectors(vA, vB), subVectors(vB, vC));

    if (N.Z >= 0) {
        return rightHandOrientation;
    } else {
        return leftHandOrientation;
    }
}