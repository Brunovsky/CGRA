var SMALL_COMP = 0.2;
var AVG_COMP = 0.45;
var LARGE_COMP = 0.75;
var HUGE_COMP = 0.95;

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

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.axis = new CGFaxis(this);

		// Scene elements
		this.octagon = new Polygon(this, 8);
		this.square = new Square(this, 2);
		this.triangle = new Triangle(this, 2);
		this.rectangle = new Rectangle(this, 1, 3);
		this.circle = new Circle(this, 1);
		this.hexagon = new Polygon(this, 6);
		this.trapezium = new Trapezium(this, 3, 2, 1);

		this.cube = new Cube(this, 2);
		this.block = new Block(this, 1, 2, 4);
		this.halfsphere = new HalfSphere(this, 1);
		this.closedhalfsphere = new ClosedHalfSphere(this, 1);
		this.sphere = new Sphere(this, 1);

		this.cylinder = new Cylinder(this, 1, 2);
		this.closedcylinder = new ClosedCylinder(this, 1, 3);
		this.prism = new Prism(this, 5, 1, 3);
		this.closedprism = new ClosedPrism(this, 7, 1, 2);

		// Materials
		this.materialDefault = new CGFappearance(this);
	};

	initCameras() 
	{
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
	};

	initLights() 
	{
		this.setGlobalAmbientLight(0.2, 0.2, 0.2, 1.0);
        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
        this.lights[0].enable();
        this.lights[0].update();
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

		this.popMatrix();
		this.translate(0, 5, 0);
		this.pushMatrix();

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
		this.translate(0, 5, 0);
		this.pushMatrix();

		this.cylinder.display();
		this.translate(3, 0, 0);
		this.closedcylinder.display();
		this.translate(3, 0, 0);
		this.prism.display();
		this.translate(3, 0, 0);
		this.closedprism.display();
		this.translate(3, 0, 0);

		this.popMatrix();
		this.translate(0, 5, 0);
		this.pushMatrix();

		// ---- END Scene drawing section
	};
};
