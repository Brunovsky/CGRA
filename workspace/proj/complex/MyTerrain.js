class MyTerrain extends CGFobject
{
    constructor(scene, nrDivs, altimetry, side, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.nrDivs = nrDivs;
        this.side = side ? side : nrDivs;
        this.altimetry = altimetry;
        this.coords = {
            minS: coords[0],
            maxS: coords[1],
            minT: coords[2],
            maxT: coords[3]
        }
        this.initBuffers();
    };

    initBuffers()
    {
        const nrDivs = this.nrDivs, altimetry = this.altimetry, coords = this.coords;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        //    j = 0 1 2 3 4 5
        // i = 0  . . . . . .
        // i = 1  . . . . . .   ---> X
        // i = 2  . . . . . .   |
        // i = 3  . . . . . .   |
        // i = 4  . . . . . .   Z
        // i = 5  . . . . . .

        for (let i = 0; i <= nrDivs; ++i) { // Z
            for (let j = 0; j <= nrDivs; ++j) { // X
                // q4   p4   q3   Z - 1
                // p1   p0   p3   Z
                // q1   p2   q2   Z + 1
                // X-1   X   X+1
                let X = j, Y = altimetry[i][j], Z = i;

                // p0: current vertex
                let p0 = {X: X, Y: Y, Z: Z};

                this.vertices.push(X, Y, Z); // Up
                this.vertices.push(X, Y, Z); // Down

                // p1: west vertex
                if (X > 0) {
                    Y = altimetry[i][j - 1];
                } else {
                    Y = 2 * altimetry[i][j] - altimetry[i][j + 1];
                }
                let p1 = {X: X - 1, Y: Y, Z: Z};

                // p2: south vertex
                if (Z < nrDivs) {
                    Y = altimetry[i + 1][j];
                } else {
                    Y = 2 * altimetry[i][j] - altimetry[i - 1][j];
                }
                let p2 = {X: X, Y: Y, Z: Z + 1};

                // p3: east vertex
                if (X < nrDivs) {
                    Y = altimetry[i][j + 1];
                } else {
                    Y = 2 * altimetry[i][j] - altimetry[i][j - 1];
                }
                let p3 = {X: X + 1, Y: Y, Z: Z};

                // p4: north vertex
                if (Z > 0) {
                    Y = altimetry[i - 1][j];
                } else {
                    Y = 2 * altimetry[i][j] - altimetry[i + 1][j];
                }
                let p4 = {X: X, Y: Y, Z: Z - 1};

                // Normals

                // Method 1: Bisectors of bisectors.
                //*//
                let bisectorX = triangleBisector(p1, p0, p3, axisZ);
                let bisectorZ = triangleBisector(p4, p0, p2, axisX);
                if (bisectorX.Y < 0) bisectorX = flipVector(bisectorX);
                if (bisectorZ.Y < 0) bisectorZ = flipVector(bisectorZ);

                let bisector = vectorBisector(bisectorX, bisectorZ);
                if (bisector == nullVector()) bisector = yVector();

                let N = normalize(bisector);
                //*//

                // Method 2: Average of averages.
                /*//
                let q1 = triangleOrientation(p1, p0, p4);
                let q2 = triangleOrientation(p2, p0, p1);
                let q3 = triangleOrientation(p3, p0, p2);
                let q4 = triangleOrientation(p4, p0, p3);

                let u13 = normalize(addVectors(normalize(q1), normalize(q2)));
                let u24 = normalize(addVectors(normalize(q3), normalize(q4)));
                let N = normalize(addVectors(normalize(u13), normalize(u24)));
                //*/

                this.normals.push(N.X, N.Y, N.Z); // Up
                this.normals.push(-N.X, -N.Y, -N.Z); // Down

                // Texture Up, Down
                let stexUnit = j / nrDivs;
                let ttexUnit = i / nrDivs;
                let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
                let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
                this.texCoords.push(stex, ttex); // Up
                this.texCoords.push(stex, ttex); // Down
            }
        }

        for (let i = 0; i < nrDivs; ++i) { // Z
            for (let j = 0; j < nrDivs; ++j) { // X
                let below = 2 * nrDivs + 2;
                let next = 2, right = 2;

                let stack = i * below;
                let current = next * j + stack;

                // ... v1U v1D      v2U v2D ... --- line i
                // 
                // ... v4U v4D      v3U v3D ... --- line i + 1
                let v1U = current;
                let v2U = current + right;
                let v3U = current + right + below;
                let v4U = current + below;
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
        this.scene.pushMatrix();
        this.scene.pushTexture(this.texture);
            this.scene.translate(-this.side / 2, 0, -this.side / 2);
            this.scene.scale(this.side / this.nrDivs, 1, this.side / this.nrDivs);
            super.display();
        this.scene.popTexture();
        this.scene.popMatrix();
    };

    bindTexture(terrainTexture)
    {
        this.texture = terrainTexture;
    };
};
