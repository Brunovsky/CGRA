let uvSURFACE_DEFAULT_SLICES = 32;



function uvComputeSurfaceNormal(uvfunction, U, V, uDelta, vDelta) {
    const deltaDivider = 256;

    const Point = uvfunction(U, V);

    function uClose() {
        return uvfunction(U + uDelta / deltaDivider, V);
    }

    function vClose() {
        return uvfunction(U, V + vDelta / deltaDivider);
    }

    let uTangent = subVectors(uClose(), Point);
    let vTangent = subVectors(vClose(), Point);
    let N = normalize(crossProduct(uTangent, vTangent));

    return N;
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
        this.texCoords = [];

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

                // Texture Up, Down
                let stexUnit = i / slices;
                let ttexUnit = j / slices;
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

    display()
    {
        this.scene.pushTexture(this.texture);
        super.display();
        this.scene.popTexture();
    };

    bindTexture(uvSurfaceTexture)
    {
        this.texture = uvSurfaceTexture;
    };
};
