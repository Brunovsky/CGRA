function computeSurfaceNormal(zfunction, X, Y, delta) {
	var Point = {X: X, Y: Y, Z: zfunction(X, Y)};

	function sub(a, b) {
		var subX = a.X - b.X;
		var subY = a.Y - b.Y;
		var subZ = a.Z - b.Z;
		return {X: subX, Y: subY, Z: subZ};
	}

	function xTangent(delta) {
		var deltaX = X + delta;
		var deltaY = Y;
		var deltaZ = zfunction(deltaX, deltaY);
		return {X: deltaX, Y: deltaY, Z: deltaZ};
	}

	function yTangent(delta) {
		var deltaX = X;
		var deltaY = Y + delta;
		var deltaZ = zfunction(deltaX, deltaY);
		return {X: deltaX, Y: deltaY, Z: deltaZ};
	}

	function cross(a, b) {
		var crossX = a.Y * b.Z - a.Z * b.Y;
		var crossY = a.Z * b.X - a.X * b.Z;
		var crossZ = a.X * b.Y - a.Y * b.X;
		return {X: crossX, Y: crossY, Z: crossZ};
	}

	function normalize(vec) {
		var N = Math.sqrt(vec.X * vec.X + vec.Y * vec.Y + vec.Z * vec.Z);
		var normX = vec.X / N;
		var normY = vec.Y / N;
		var normZ = vec.Z / N;
		return {X: normX, Y: normY, Z: normZ};
	}

	var xTangentVector = sub(xTangent(delta), Point);
	var yTangentVector = sub(yTangent(delta), Point);
	var normal = normalize(cross(xTangentVector, yTangentVector));

	return normal;
}



class zSurface extends CGFobject
{
	constructor(scene, zfunction, boundaries = [-1, 1, -1, 1], slices = 16, coords = [0, 1, 0, 1])
	{
		super(scene);
		this.zfunction = zfunction;
		this.minX = boundaries[0];
		this.maxX = boundaries[1];
		this.minY = boundaries[2];
		this.maxY = boundaries[3];
		this.slices = slices;
		this.coords = coords;
		this.initBuffers();
	};

	initBuffers()
	{
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        
        var zfunction = this.zfunction,
        	slices = this.slices, coords = this.coords;
        var minX = this.minX, maxX = this.maxX,
        	minY = this.minY, maxY = this.maxY;

        var delta = Math.min(maxX - minX, maxY - minY) / (256 * slices);

        // j = 5  . . . . . .
        // j = 4  . . . . . .
        // j = 3  . . . . . .   Y
        // j = 2  . . . . . .   ^
        // j = 1  . . . . . .   |
        // j = 0  . . . . . .   ---> X
        //   i =  0 1 2 3 4 5

        for (var j = 0; j <= slices; ++j) { // iterate the columns, selecting X
        	for (var i = 0; i <= slices; ++i) { // iterate the lines, selecting Y
        		var X = (i * maxX + (slices - i) * minX) / slices;
        		var Y = (j * maxY + (slices - j) * minY) / slices;
        		var Z = zfunction(X, Y);
        		var N = computeSurfaceNormal(zfunction, X, Y, delta);

        		this.vertices.push(X, Y, Z);
        		this.normals.push(N.X, N.Y, N.Z);
        	}
        }

        for (var j = 0; j < slices; ++j) { // column, selects Y
        	for (var i = 0; i < slices; ++i) { // line, selects X
                var above = slices + 1;
                var line = j * above;

                var current = i + line;

                // ... v4  v3 ... --- x + 1
                // 
                // ... v1  v2 ... --- x
                var v1 = current;
                var v2 = current + 1;
                var v3 = current + 1 + above;
                var v4 = current + above;

                this.indices.push(v1, v2, v3);
                this.indices.push(v1, v3, v4);
                
                this.indices.push(v1, v3, v2);
                this.indices.push(v1, v4, v3);
        	}
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
	};
};