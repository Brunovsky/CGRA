let ySURFACE_DEFAULT_SLICES = 32;



function yComputeSurfaceNormal(yfunction, X, Z, xDelta, zDelta) {
    const deltaDivider = 256;

    const Point = {
        X: X,
        Y: yfunction(X, Z),
        Z: Z
    };

    function xClose() {
        let deltaX = X + xDelta / deltaDivider;
        let deltaZ = Z;
        let deltaY = yfunction(deltaX, deltaZ);
        return {
            X: deltaX,
            Y: deltaY,
            Z: deltaZ
        };
    }

    function zClose() {
        let deltaX = X;
        let deltaZ = Z + zDelta / deltaDivider;
        let deltaY = yfunction(deltaX, deltaZ);
        return {
            X: deltaX,
            Y: deltaY,
            Z: deltaZ
        };
    }

    let xTangent = subVectors(xClose(), Point);
    let zTangent = subVectors(zClose(), Point);
    let N = normalize(crossProduct(zTangent, xTangent));

    return N;
}



function ySampleFunction(yfunction, X, Z, xDelta, zDelta) {
    const Point = {
        X: X,
        Y: yfunction(X, Z),
        Z: Z
    };
    if (yfunction.normal) {
        Point.N = yfunction.normal(X, Z);
    } else {
        Point.N = yComputeSurfaceNormal(yfunction, X, Z, xDelta, zDelta);
    }
    return Point;
}



class ySurface extends CGFobject
{
    constructor(scene, yfunction, boundary = [-1, 1, -1, 1], slices = 32, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.yfunction = yfunction;
        this.boundary = {
            minX: boundary[0],
            maxX: boundary[1],
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
        const yfunction = this.yfunction, b = this.boundary,
            slices = this.slices, coords = this.coords;

        const xDelta = (b.maxX - b.minX) / slices;
        const zDelta = (b.maxZ - b.minZ) / slices;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        //    i = 0 1 2 3 4 5
        // j = 0  . . . . . .
        // j = 1  . . . . . .   ---> X
        // j = 2  . . . . . .   |
        // j = 3  . . . . . .   |
        // j = 4  . . . . . .   Z
        // j = 5  . . . . . .

        for (let j = 0; j <= slices; ++j) { // iterate Y (line)
            for (let i = 0; i <= slices; ++i) { // iterate X (column)
                let X = b.minX + xDelta * i;
                let Z = b.minZ + zDelta * j;
                let Point = ySampleFunction(yfunction, X, Z, xDelta, zDelta);

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
            for (let i = 0; i < slices; ++i) { // iterate X (column)
                let above = 2 * slices + 2;
                let next = 2, right = 2;

                let line = j * above;
                let current = next * i + line;

                // ... v1  v2 ... --- line x
                // 
                // ... v4  v3 ... --- line x + 1
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
