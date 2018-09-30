let revSURFACE_DEFAULT_SLICES = 32, revSURFACE_DEFAULT_STACKS = 64;



function revComputeSurfaceNormal(revfunction, Z, theta, zDelta) {
    const deltaDivider = 256;
    const sin = Math.sin, cos = Math.cos;

    const r = revfunction(Z);
    const Point = {
        X: r * cos(theta),
        Y: r * sin(theta),
        Z: Z
    };

    function zClose() {
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

    function orientate(N) {
        let outwards = {
            X: cos(theta),
            Y: sin(theta),
            Z: 0
        };

        if (dotProduct(N, outwards) >= 0) {
            return N;
        } else {
            return flipVector(N);
        }
    }

    let zTangent = subVectors(zClose(), Point);
    let N = normalize(crossProduct(zTangent, thetaTangent()));

    // Force N to point outwards
    return orientate(N);
}



function revSampleFunction(revfunction, Z, theta, zDelta) {
    const r = revfunction(Z);
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
            slices = this.slices, stacks = this.stacks,
            coords = this.coords;

        const zDelta = (b.maxZ - b.minZ) / stacks;
        const thetaDelta = (b.maxTheta - b.minTheta) / slices;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

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
                let theta = b.maxTheta - thetaDelta * i;
                let Point = revSampleFunction(revfunction, Z, theta, zDelta);

                // Up
                this.vertices.push(Point.X, Point.Z, Point.Y);
                this.normals.push(Point.N.X, Point.N.Z, Point.N.Y);

                // Down
                this.vertices.push(Point.X, Point.Z, Point.Y);
                this.normals.push(-Point.N.X, -Point.N.Z, -Point.N.Y);

                // Texture Up, Down
                let stexUnit = i / slices;
                let ttexUnit = 1 - j / stacks;
                let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
                let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
                this.texCoords.push(stex, ttex); // Up
                this.texCoords.push(stex, ttex); // Down
            }
        }

        for (let j = 0; j < stacks; ++j) { // iterate Y (line)
            for (let i = 0; i < slices; ++i) { // iterate X (column)
                let above = 2 * slices + 2;
                let next = 2, right = 2;

                let stack = j * above;
                let current = next * i + stack;

                // ... v4U v4D      v3U v3D ... --- stack + 1
                // 
                // ... v1U v1D      v2U v2D ... --- stack
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

    bindTexture(revSurfaceTexture)
    {
        this.texture = revSurfaceTexture;
    };
};
