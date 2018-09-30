let ySURFACE_DEFAULT_SLICES = 32;



function xComputeSurfaceNormal(xfunction, Y, Z, yDelta, zDelta) {
    const deltaDivider = 256;

    const Point = {
        X: xfunction(Y, Z),
        Y: Y,
        Z: Z
    };

    function xClose() {
        let deltaY = Y + yDelta / deltaDivider;
        let deltaZ = Z;
        let deltaX = xfunction(deltaY, deltaZ);
        return {
            X: deltaX,
            Y: deltaY,
            Z: deltaZ
        };
    }

    function zClose() {
        let deltaY = Y;
        let deltaZ = Z + zDelta / deltaDivider;
        let deltaY = xfunction(deltaY, deltaZ);
        return {
            X: deltaX,
            Y: deltaY,
            Z: deltaZ
        };
    }

    let yTangent = subVectors(yClose(), Point);
    let zTangent = subVectors(zClose(), Point);
    let N = normalize(crossProduct(yTangent, zTangent));

    return N;
}



function xSampleFunction(xfunction, Y, Z, yDelta, zDelta) {
    const Point = {
        X: xfunction(Y, Z),
        Y: Y,
        Z: Z
    };
    if (xfunction.normal) {
        Point.N = xfunction.normal(Y, Z);
    } else {
        Point.N = yComputeSurfaceNormal(xfunction, Y, Z, yDelta, zDelta);
    }
    return Point;
}



class xSurface extends CGFobject
{
    constructor(scene, xfunction, boundary = [-1, 1, -1, 1], slices = 32, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.xfunction = xfunction;
        this.boundary = {
            minY: boundary[0],
            maxY: boundary[1],
            minZ: boundary[2],
            maxZ: boundary[3]
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
        const xfunction = this.xfunction, b = this.boundary,
            slices = this.slices, coords = this.coords;

        const yDelta = (b.maxY - b.minY) / slices;
        const zDelta = (b.maxZ - b.minZ) / slices;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        //    i = 0 1 2 3 4 5
        // j = 0  . . . . . .
        // j = 1  . . . . . .   ---> Y
        // j = 2  . . . . . .   |
        // j = 3  . . . . . .   |
        // j = 4  . . . . . .   Z
        // j = 5  . . . . . .

        for (let j = 0; j <= slices; ++j) { // iterate Z (line)
            for (let i = 0; i <= slices; ++i) { // iterate Y (column)
                let Y = b.minY + yDelta * i;
                let Z = b.minZ + zDelta * j;
                let Point = ySampleFunction(xfunction, Y, Z, yDelta, zDelta);

                // Up
                this.vertices.push(Point.X, Point.Y, Point.Z);
                this.normals.push(Point.N.X, Point.N.Y, Point.N.Z);

                // Down
                this.vertices.push(Point.X, Point.Y, Point.Z);
                this.normals.push(-Point.N.X, -Point.N.Y, -Point.N.Z);

                // Texture Up, Down
                let stexUnit = i / slices;
                let ttexUnit = j / slices;
                let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
                let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
                this.texCoords.push(stex, ttex); // Up
                this.texCoords.push(stex, ttex); // Down
            }
        }

        for (let j = 0; j < slices; ++j) { // iterate Z (line)
            for (let i = 0; i < slices; ++i) { // iterate Y (column)
                let above = 2 * slices + 2;
                let next = 2, right = 2;

                let line = j * above;
                let current = next * i + line;

                // ... v1  v2 ... --- line z
                // 
                // ... v4  v3 ... --- line z + 1
                let v1U = current;
                let v2U = current + right;
                let v3U = current + right + above;
                let v4U = current + above;
                let v1D = 1 + v1U;
                let v2D = 1 + v2U;
                let v3D = 1 + v3U;
                let v4D = 1 + v4U;

                this.indices.push(v1U, v3U, v2U);
                this.indices.push(v1U, v4U, v3U);
                
                this.indices.push(v1D, v2D, v3D);
                this.indices.push(v1D, v3D, v4D);
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

    bindTexture(ySurfaceTexture)
    {
        this.texture = ySurfaceTexture;
    };
};
