class LightingScene extends CGFscene 
{
	constructor()
	{
		super();
	};

	init(application) 
	{ 
		super.init(application);

		this.initCameras();
		this.initLights();

		this.enableTextures(true);

		this.gl.clearColor(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2], BG_COLOR[3]);
		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.axis = new CGFaxis(this, 10);

		function heart(t) {
			const sin = Math.sin, cos = Math.cos;
			return {
				X: 2 * sin(t) * sin(t) * sin(t),
				Y: (13 * cos(t) - 5 * cos(2*t) - 2 * cos(3*t) - cos(4*t)) / 8
			};
		}

		// Scene elements
		this.octagon = new Regular(this, 8);
		this.square = new Square(this, 2);
		this.triangle = new Triangle(this, 2);
		this.rectangle = new Rectangle(this, 1, 3);
		this.circle = new Circle(this, 1);
		this.hexagon = new Regular(this, 6);
		this.trapezium = new Trapezium(this, 3, 2, 1);
		this.quadrangle = new Polygon(this, [[-2, -1], [1, 0], [1.5, 2], [0.5, 2.5], [-1.5, 2], [-3, 2]]);
		this.heart = new tPolygon(this, heart, [0, 2 * Math.PI]);

		this.cube = new Cube(this, 2);
		this.block = new Block(this, 1, 2, 4);
		this.halfsphere = new HalfSphere(this, 1);
		this.closedhalfsphere = new ClosedHalfSphere(this, 1);
		this.sphere = new Sphere(this, 1);

		this.cylinder = new Cylinder(this, 1, 2);
		this.closedcylinder = new ClosedCylinder(this, 1, 3);
		this.prism = new Prism(this, 5, 1, 3);
		this.closedprism = new ClosedPrism(this, 7, 1, 2);

		this.cone = new Cone(this, 1, 2);
		this.closedcone = new ClosedCone(this, 1.5, 3);
		this.doublecone = new DoubleCone(this, 1, 3);
		this.pyramid = new Pyramid(this, 5, 1, 2);
		this.closedpyramid = new ClosedPyramid(this, 7, 1.5, 3);
		this.doublepyramid = new DoublePyramid(this, 4, 1, 3);

		this.cutcone = new CutCone(this, 1.5, 1, 1);
		this.closedcutcone = new ClosedCutCone(this, 1, 0.5, 2);
		this.doublecutcone = new DoubleCutCone(this, 1.5, 1, 1);
		this.cutpyramid = new CutPyramid(this, 3, 1, 1/3, 2);
		this.closedcutpyramid = new ClosedCutPyramid(this, 6, 1.5, 2, 4);
		this.doublecutpyramid = new DoubleCutPyramid(this, 4, 1, 0.5, 1.5);

		this.sqXYsurface = new zSurface(this, (X,Y) => X*X + Y*Y, [-1, 1, -1.5, 2]);
		this.cubesurface = new zSurface(this, (X,Y) => 1 + X*X + Y);
		this.firstUV = new uvSurface(this, (U,V) => {return {X: U*U + V, Y: V + 1, Z: Math.sqrt(V)}});

		this.car = new zSurface(this, carFunction, carProportions, carSlices);



		// Materials
		this.materialDefault = new CGFappearance(this);
	};

	initCameras() 
	{
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
	};

	initLights() 
	{
		this.setGlobalAmbientLight(AMBIENT[0], AMBIENT[1], AMBIENT[2], AMBIENT[3]);

		let i = 0;

		this.lights[i].setPosition(6, 0, 15, 1);
		this.lights[i].setDiffuse(1.0, 1.0, 0.25, 1.0);
        this.lights[i].setVisible(true);
        this.lights[i].enable();
		i++;

        this.lights[i].setPosition(3, 5, -10, 1);
        this.lights[i].setDiffuse(1.0, 0.25, 1.0, 1.0);
        this.lights[i].setVisible(true);
        this.lights[i].enable();
        i++;

        this.lights[i].setPosition(0, 10, 8, 1);
        this.lights[i].setDiffuse(0.25, 1.0, 1.0, 1.0);
        this.lights[i].setVisible(true);
        this.lights[i].enable();
        i++;
	};

	updateLights() 
	{
		for (var i = 0; i < this.lights.length; i++)
			this.lights[i].update();
	}

    setDefaultAppearance() 
    {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);	
    };

	display() 
	{
		// ---- BEGIN Background, camera and axis setup

		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Initialize Model-View matrix as identity (no transformation)
		this.updateProjectionMatrix();
		this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		// Update all lights used
		this.updateLights();

		// Draw axis
		this.axis.display();

		this.setDefaultAppearance();

		// ---- END Background, camera and axis setup

		// ---- BEGIN Scene drawing section

		// Floor
		this.pushMatrix();

		this.octagon.display();
		this.translate(3, 0, 0);
		this.square.display();
		this.translate(3, 0, 0);
		this.triangle.display();
		this.translate(3, 0, 0);
		this.rectangle.display();
		this.translate(3, 0, 0);
		this.circle.display();
		this.translate(3, 0, 0);
		this.hexagon.display();
		this.translate(3, 0, 0);
		this.trapezium.display();
		this.translate(5, 0, 0);
		this.quadrangle.display();
		this.translate(5, 0, 0);
		this.heart.display();
		this.translate(3, 0, 0);

		this.popMatrix();
		this.pushMatrix();
		this.translate(0, 5, 0); // +5

		this.cube.display();
		this.translate(3, 0, 0);
		this.block.display();
		this.translate(3, 0, 0);
		this.halfsphere.display();
		this.translate(3, 0, 0);
		this.closedhalfsphere.display();
		this.translate(3, 0, 0);
		this.sphere.display();
		this.translate(3, 0, 0);

		this.popMatrix();
		this.pushMatrix();
		this.translate(0, 10, 0); // +10

		this.cylinder.display();
		this.translate(3, 0, 0);
		this.closedcylinder.display();
		this.translate(3, 0, 0);
		this.prism.display();
		this.translate(3, 0, 0);
		this.closedprism.display();
		this.translate(3, 0, 0);

		this.popMatrix();
		this.pushMatrix();
		this.translate(0, 15, 0); // +15

		this.cone.display();
		this.translate(3, 0, 0);
		this.closedcone.display();
		this.translate(3, 0, 0);
		this.doublecone.display();
		this.translate(3, 0, 0);
		this.pyramid.display();
		this.translate(3, 0, 0);
		this.closedpyramid.display();
		this.translate(3, 0, 0);
		this.doublepyramid.display();
		this.translate(3, 0, 0);

		this.popMatrix();
		this.pushMatrix();
		this.translate(0, -5, 0); // -5

		this.cutcone.display();
		this.translate(3, 0, 0);
		this.closedcutcone.display();
		this.translate(3, 0, 0);
		this.doublecutcone.display();
		this.translate(3, 0, 0);
		this.cutpyramid.display();
		this.translate(3, 0, 0);
		this.closedcutpyramid.display();
		this.translate(3, 0, 0);
		this.doublecutpyramid.display();
		this.translate(3, 0, 0);

		this.popMatrix();
		this.pushMatrix();
		this.translate(0, -10, 0); // -10

		this.sqXYsurface.display();
		this.translate(3, 0, 0);
		this.cubesurface.display();
		this.translate(3, 0, 0);
		this.firstUV.display();
		this.translate(3, 0, 0);
		this.translate(3, 0, 0);

		this.popMatrix();
		this.pushMatrix();
		this.translate(0, -25, 0);

		this.car.display();

		// ---- END Scene drawing section
	};
};
