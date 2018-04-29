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

// Return the component-wise difference of vectors a and b.
function subVectors(a, b) {
    let subX = a.X - b.X;
    let subY = a.Y - b.Y;
    let subZ = a.Z - b.Z;
    return {
        X: subX,
        Y: subY,
        Z: subZ
    };
}

// Return the cross product of vectors a and b.
function crossProduct(a, b) {
    let crossX = a.Y * b.Z - a.Z * b.Y;
    let crossY = a.Z * b.X - a.X * b.Z;
    let crossZ = a.X * b.Y - a.Y * b.X;
    return {
        X: crossX,
        Y: crossY,
        Z: crossZ
    };
}

// Normalize vector a to length 1.
function normalize(a) {
    let N = Math.sqrt(a.X * a.X + a.Y * a.Y + a.Z * a.Z);
    let normX = a.X / N;
    let normY = a.Y / N;
    let normZ = a.Z / N;
    return {
        X: normX,
        Y: normY,
        Z: normZ
    };
}

let rightHandOrientation = true, leftHandOrientation = false;

// Return the orientation of triangle given by vertices A, B, C in this order
// @return rightHandOrientation if the Z component of (B-A)x(C-B) is >= 0
// @return leftHandOrientation  if the Z component of (B-A)x(C-B) is < 0 
function orientationRule(A, B, C) {
    let vA = anyToXYZ(A), vB = anyToXYZ(B), vC = anyToXYZ(C);
    let normal = crossProduct(subVectors(vA, vB), subVectors(vB, vC));
    if (normal.Z >= 0) {
        return rightHandOrientation;
    } else {
        return leftHandOrientation;
    }
}