let zSURFACE_DEFAULT_SLICES = 32;



function zComputeSurfaceNormal(zfunction, X, Y, xDelta, yDelta) {
    const deltaDivider = 256;

    const Point = {
        X: X,
        Y: Y,
        Z: zfunction(X, Y)
    };

    function xClose() {
        let deltaX = X + xDelta / deltaDivider;
        let deltaY = Y;
        let deltaZ = zfunction(deltaX, deltaY);
        return {
            X: deltaX,
            Y: deltaY,
            Z: deltaZ
        };
    }

    function yClose() {
        let deltaX = X;
        let deltaY = Y + yDelta / deltaDivider;
        let deltaZ = zfunction(deltaX, deltaY);
        return {
            X: deltaX,
            Y: deltaY,
            Z: deltaZ
        };
    }

    let xTangent = subVectors(xClose(), Point);
    let yTangent = subVectors(yClose(), Point);
    let N = normalize(crossProduct(xTangent, yTangent));

    return N;
}



function zSampleFunction(zfunction, X, Y, xDelta, yDelta) {
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



class zSurface extends CGFobject
{
    constructor(scene, zfunction, boundary = [-1, 1, -1, 1], slices = 32, coords = [0, 1, 0, 1])
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
        this.texCoords = [];

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
                let Point = zSampleFunction(zfunction, X, Y, xDelta, yDelta);

                // Up
                this.vertices.push(Point.X, Point.Y, Point.Z);
                this.normals.push(Point.N.X, Point.N.Y, Point.N.Z);

                // Down
                this.vertices.push(Point.X, Point.Y, Point.Z);
                this.normals.push(-Point.N.X, -Point.N.Y, -Point.N.Z);

                // Texture Up, Down
                let stexUnit = i / slices;
                let ttexUnit = 1 - j / slices;
                let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
                let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
                this.texCoords.push(stex, ttex); // Up
                this.texCoords.push(stex, ttex); // Down
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

    display()
    {
        this.scene.pushTexture(this.texture);
        super.display();
        this.scene.popTexture();
    };

    bindTexture(zSurfaceTexture)
    {
        this.texture = zSurfaceTexture;
    };
};
