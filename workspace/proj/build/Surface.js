function zComputeSurfaceNormal(zfunction, X, Y, xDelta, yDelta) {
    const deltaDivider = 256;

    const Point = {
        X: X,
        Y: Y,
        Z: zfunction(X, Y)
    };

    function xTangent() {
        let deltaX = X + xDelta / deltaDivider;
        let deltaY = Y;
        let deltaZ = zfunction(deltaX, deltaY);
        return {
            X: deltaX,
            Y: deltaY,
            Z: deltaZ
        };
    }

    function yTangent() {
        let deltaX = X;
        let deltaY = Y + yDelta / deltaDivider;
        let deltaZ = zfunction(deltaX, deltaY);
        return {
            X: deltaX,
            Y: deltaY,
            Z: deltaZ
        };
    }

    let xTangentVector = subVectors(xTangent(), Point);
    let yTangentVector = subVectors(yTangent(), Point);
    let normalV = normalize(crossProduct(xTangentVector, yTangentVector));

    return normalV;
}



function uvComputeSurfaceNormal(uvfunction, U, V, uDelta, vDelta) {
    const deltaDivider = 256;

    const Point = uvfunction(U, V);

    function uTangent() {
        return uvfunction(U + uDelta / deltaDivider, V);
    }

    function vTangent() {
        return uvfunction(U, V + vDelta / deltaDivider);
    }

    let uTangentVector = subVectors(uTangent(), Point);
    let vTangentVector = subVectors(vTangent(), Point);
    let normalV = normalize(crossProduct(uTangentVector, vTangentVector));

    return normalV;
}



function revComputeSurfaceNormal(revfunction, Z, theta, zDelta) {
    const deltaDivider = 256;
    const sin = Math.sin, cos = Math.cos;

    const r = revfunction(Z);
    const Point = {
        X: r * cos(theta),
        Y: r * sin(theta),
        Z: Z
    };
    function zTangent() {
        let r = revfunction(Z + zDelta / deltaDivider);
        return {
            X: r * cos(theta),
            Y: r * sin(theta),
            Z: Z + zDelta / deltaDivider
        }
    }

    function thetaTangent() {
        return {
            X: -sin(theta),
            Y: cos(theta),
            Z: 0
        };
    }

    let zTangentVector = subVectors(zTangent(), Point);
    let thetaTangentVector = subVectors(thetaTangent(), Point);
    let normalV = normalize(crossProduct(thetaTangentVector, zTangentVector));

    return normalV;
}



function sampleZfunction(zfunction, X, Y, xDelta, yDelta) {
    const Point = {
        X: X,
        Y: Y,
        Z: zfunction(X, Y)
    };
    if (zfunction.normal) {
        Point.N = zfunction.normal(X, Y);
    } else {
        Point.N = zComputeSurfaceNormal(zfunction, X, Y, xDelta, yDelta);
    }
    return Point;
}



function sampleUVfunction(uvfunction, U, V, uDelta, vDelta) {
    const Point = uvfunction(U, V);
    if (uvfunction.normal) {
        Point.N = uvfunction.normal(U, V);
    } else {
        Point.N = uvComputeSurfaceNormal(uvfunction, U, V, uDelta, vDelta);
    }
    return Point;
}



function sampleREVfunction(revfunction, Z, theta, zDelta) {
    const r = revfunction(Z, theta);
    const Point = {
        X: r * Math.cos(theta),
        Y: r * Math.sin(theta),
        Z: Z
    };
    if (revfunction.normal) {
        Point.N = revfunction.normal(Z, theta);
    } else {
        Point.N = revComputeSurfaceNormal(revfunction, Z, theta, zDelta);
    }
    return Point;
}



class zSurface extends CGFobject
{
    constructor(scene, zfunction, boundary = [-1, 1, -1, 1], slices = 16, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.zfunction = zfunction;
        this.boundary = {
            minX: boundary[0],
            maxX: boundary[1],
            minY: boundary[2],
            maxY: boundary[3]
        }
        this.slices = slices;
        this.coords = {
            minS: coords[0],
            maxS: coords[1],
            minT: coords[2],
            maxT: coords[3]
        };
        this.initBuffers();
    };

    initBuffers()
    {
        const zfunction = this.zfunction, b = this.boundary,
            slices = this.slices, coords = this.coords;

        const xDelta = (b.maxX - b.minX) / slices;
        const yDelta = (b.maxY - b.minY) / slices;

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        // j = 5  . . . . . .
        // j = 4  . . . . . .
        // j = 3  . . . . . .   Y
        // j = 2  . . . . . .   ^
        // j = 1  . . . . . .   |
        // j = 0  . . . . . .   ---> X
        //    i = 0 1 2 3 4 5

        for (let j = 0; j <= slices; ++j) { // iterate Y (line)
            for (let i = 0; i <= slices; ++i) { // iterate X (column)
                let X = b.minX + xDelta * i;
                let Y = b.minY + yDelta * j;
                let Point = sampleZfunction(zfunction, X, Y, xDelta, yDelta);

                // Up
                this.vertices.push(Point.X, Point.Y, Point.Z);
                this.normals.push(Point.N.X, Point.N.Y, Point.N.Z);

                // Down
                this.vertices.push(Point.X, Point.Y, Point.Z);
                this.normals.push(-Point.N.X, -Point.N.Y, -Point.N.Z);
            }
        }

        for (let j = 0; j < slices; ++j) { // iterate Y (line)
            for (let i = 0; i < slices; ++i) { // iterate X (column)
                let above = 2 * slices + 2;
                let next = 2, right = 2;

                let line = j * above;
                let current = next * i + line;

                // ... v4  v3 ... --- line x + 1
                // 
                // ... v1  v2 ... --- line x
                let v1U = current;
                let v2U = current + right;
                let v3U = current + right + above;
                let v4U = current + above;
                let v1D = 1 + v1U;
                let v2D = 1 + v2U;
                let v3D = 1 + v3U;
                let v4D = 1 + v4U;

                this.indices.push(v1U, v2U, v3U);
                this.indices.push(v1U, v3U, v4U);
                
                this.indices.push(v1D, v3D, v2D);
                this.indices.push(v1D, v4D, v3D);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};



class uvSurface extends CGFobject
{
    constructor(scene, uvfunction, boundary = [0, 1, 0, 1], slices = 32, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.uvfunction = uvfunction;
        this.boundary = {
            minU: boundary[0],
            maxU: boundary[1],
            minV: boundary[2],
            maxV: boundary[3]
        };
        this.slices = slices;
        this.coords = {
            minS: coords[0],
            maxS: coords[1],
            minT: coords[2],
            maxT: coords[3]
        };
        this.initBuffers();
    };

    initBuffers()
    {
        const uvfunction = this.uvfunction, b = this.boundary,
            slices = this.slices, coords = this.coords;

        const uDelta = (b.maxU - b.minU) / slices;
        const vDelta = (b.maxV - b.minV) / slices;

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        // j = 5  . . . . . .
        // j = 4  . . . . . .
        // j = 3  . . . . . .   V
        // j = 2  . . . . . .   ^
        // j = 1  . . . . . .   |
        // j = 0  . . . . . .   ---> U
        //    i = 0 1 2 3 4 5

        for (let j = 0; j <= slices; ++j) { // iterate V
            for (let i = 0; i <= slices; ++i) { // iterate U
                let U = b.minU + uDelta * i;
                let V = b.minV + vDelta * j;
                let Point = sampleUVfunction(uvfunction, U, V, uDelta, vDelta);

                // Up
                this.vertices.push(Point.X, Point.Y, Point.Z);
                this.normals.push(Point.N.X, Point.N.Y, Point.N.Z);

                // Down
                this.vertices.push(Point.X, Point.Y, Point.Z);
                this.normals.push(-Point.N.X, -Point.N.Y, -Point.N.Z);
            }
        }

        for (let j = 0; j < slices; ++j) { // iterate Y (line)
            for (let i = 0; i < slices; ++i) { // iterate X (column)
                let above = 2 * slices + 2;
                let next = 2, right = 2;

                let line = j * above;
                let current = next * i + line;

                // ... v4U v4D      v3U v3D ... --- line x + 1
                // 
                // ... v1U v1D      v2U v2D ... --- line x
                let v1U = current;
                let v2U = current + right;
                let v3U = current + right + above;
                let v4U = current + above;
                let v1D = 1 + v1U;
                let v2D = 1 + v2U;
                let v3D = 1 + v3U;
                let v4D = 1 + v4U;

                this.indices.push(v1U, v2U, v3U);
                this.indices.push(v1U, v3U, v4U);
                
                this.indices.push(v1D, v3D, v2D);
                this.indices.push(v1D, v4D, v3D);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};



class revSurface extends CGFobject
{
    constructor(scene, revfunction, boundary = [0, 1, -Math.PI, Math.PI], slices = 32, stacks = 64, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.revfunction = revfunction;
        this.boundary = {
            minZ: boundary[0],
            maxZ: boundary[1],
            minTheta: boundary[2],
            maxTheta: boundary[3]
        };
        this.slices = slices;
        this.stacks = stacks;
        this.coords = {
            minS: coords[0],
            maxS: coords[1],
            minT: coords[2],
            maxT: coords[3]
        };
        this.initBuffers();
    };

    initBuffers()
    {
        const sin = Math.sin, cos = Math.cos, PI = Math.PI;
        const revfunction = this.revfunction, b = this.boundary,
            slices = this.slices, stacks = this.stacks, coords = this.coords;

        const zDelta = (b.maxZ - b.minZ) / stacks;
        const thetaDelta = 2 * PI / slices;

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        // j = 5  . . . . . .
        // j = 4  . . . . . .
        // j = 3  . . . . . .   Z
        // j = 2  . . . . . .   ^
        // j = 1  . . . . . .   |
        // j = 0  . . . . . .   ---> Theta
        //    i = 0 1 2 3 4 5

        for (let j = 0; j <= stacks; ++j) { // iterate Z
            for (let i = 0; i <= slices; ++i) { // iterate Theta
                let Z = b.minZ + zDelta * j;
                let theta = b.minTheta + thetaDelta * i;
                let Point = sampleREVfunction(revfunction, Z, theta, zDelta);

                // Up
                this.vertices.push(Point.X, Point.Y, Point.Z);
                this.normals.push(Point.N.X, Point.N.Y, Point.N.Z);

                // Down
                this.vertices.push(Point.X, Point.Y, Point.Z);
                this.normals.push(-Point.N.X, -Point.N.Y, -Point.N.Z);
            }
        }

        for (let j = 0; j < stacks; ++j) { // iterate Y (line)
            for (let i = 0; i < slices; ++i) { // iterate X (column)
                let above = 2 * slices + 2;
                let next = 2, right = 2;

                let line = j * above;
                let current = next * i + line;

                // ... v4U v4D      v3U v3D ... --- line x + 1
                // 
                // ... v1U v1D      v2U v2D ... --- line x
                let v1U = current;
                let v2U = current + right;
                let v3U = current + right + above;
                let v4U = current + above;
                let v1D = 1 + v1U;
                let v2D = 1 + v2U;
                let v3D = 1 + v3U;
                let v4D = 1 + v4U;

                this.indices.push(v1U, v2U, v3U);
                this.indices.push(v1U, v3U, v4U);
                
                this.indices.push(v1D, v3D, v2D);
                this.indices.push(v1D, v4D, v3D);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
}