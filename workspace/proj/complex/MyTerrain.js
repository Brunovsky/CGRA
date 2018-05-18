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

        //    i = 0 1 2 3 4 5
        // j = 0  . . . . . .
        // j = 1  . . . . . .   ---> X
        // j = 2  . . . . . .   |
        // j = 3  . . . . . .   |
        // j = 4  . . . . . .   Z
        // j = 5  . . . . . .

        for (let i = 0; i <= nrDivs; ++i) { // Z
            for (let j = 0; j <= nrDivs; ++j) { // X
                //      p4        Z - 1
                // p1   p0   p3   Z
                //      p2        Z + 1
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
                let bisectorX = triangleBisector(p1, p0, p3);
                let bisectorZ = triangleBisector(p2, p0, p4);

                if (bisectorX.Y < 0) bisectorX = flipVector(bisectorX);
                if (bisectorZ.Y < 0) bisectorZ = flipVector(bisectorZ);
                if (bisectorX.Y == 0) bisectorX = yVector();
                if (bisectorZ.Y == 0) bisectorZ = yVector();

                let bisector = vectorBisector(bisectorX, bisectorZ);
                let N = normalize(bisector);

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

        for (let j = 0; j < nrDivs; ++j) { // Z
            for (let i = 0; i < nrDivs; ++i) { // X
                let above = 2 * nrDivs + 2;
                let next = 2, right = 2;

                let stack = j * above;
                let current = next * i + stack;

                // ... v1U v1D      v2U v2D ... --- line j
                // 
                // ... v4U v4D      v3U v3D ... --- line j + 1
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
