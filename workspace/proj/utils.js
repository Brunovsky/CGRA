// Returns the vector B-A, where A and B are vertices [X, Y, Z]
function makeVector(A, B) {
    return {
        X: B[0] - A[0],
        Y: B[1] - A[1],
        Z: B[2] - A[2]
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
    let N = sqrt(a.X * a.X + a.Y * a.Y + a.Z * a.Z);
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
    let normal = crossProduct(makeVector(A, B), makeVector(B, C));
    if (normal.Z >= 0) {
        return rightHandOrientation;
    } else {
        return leftHandOrientation;
    }
}