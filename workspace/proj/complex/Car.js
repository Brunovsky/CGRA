class Car extends CGFobject
{
	constructor(scene, car)
	{
		super(scene);
		this.car = car;
		this.hood = new uvSurface(scene,
			car.hood,
			car.hoodBoundaries,
			car.slices);
		this.left = new uvSurface(scene,
			car.left,
			car.leftBoundaries,
			car.slices);
		this.right = new uvSurface(scene,
			car.right,
			car.rightBoundaries,
			car.slices);
		this.wheelLeftFront = new Wheel(scene, car.rWheel, car.lWheel);
		this.wheelRightFront = new Wheel(scene, car.rWheel, car.lWheel);
		this.wheelLeftBack = new Wheel(scene, car.rWheel, car.lWheel);
		this.wheelRightBack = new Wheel(scene, car.rWheel, car.lWheel);

		this.initVariables();
	};

	initVariables()
	{
		// Force constants.
		this.C = {
			engineForward:  0.0500,
			engineBackward: 0.0350,
			break:  0.0800,
			drag:   0.5000,
			roll:   1.0000
		};

		// Position of the center of the front of the car.
		this.P = {X: 0, Y: 0, Z: 0};

		// Velocity of the car.
		this.V = {X: 0, Y: 0, Z: 0};

		// Direction of the car.
		this.U = {X: 1, Y: 0, Z: 0};

		// Time.
		this.T = -1;

		// Mass.
		this.M = 1500;
	};

	update(currTime)
	{
		// First call
		if (this.T <= 0) {
			this.T = currTime;
			return;
		}

		// Loads variables
		let C = this.C, P = this.P, V = this.V, U = this.U,
			M = this.M, dT = currTime - this.T;

		// Time (save)
		this.T = currTime;

		// Compute forces
		const Fforward  = scaleVector(U, C.engineForward);
		const Fbackward = scaleVector(U, -C.engineBackward);
		const Fdrag  = scaleVector(V, -C.drag * norm(V));
		const Froll  = scaleVector(V, -C.roll);
		const Fbreak = scaleVector(normalize(V), -C.break);

		// Compute resulting force
		let F = addVectors(Fdrag, Froll);
		if (!this.scene.keys.space) {
			if (this.scene.keys.up && !this.scene.keys.down) {
				F = addVectors(F, Fforward);
			} else if (!this.scene.keys.up && this.scene.keys.down) {
				F = addVectors(F, Fbackward);
			}
		} else if (this.scene.keys.space) {
			F = addVectors(F, Fbreak);
		}

		// Acceleration
		const A = scaleVector(F, 1 / M);

		// Velocity (save)
		this.V = addVectors(V, scaleVector(A, dT));

		// Position (save)
		this.P = addVectors(P, scaleVector(V, dT));
	};

	display()
	{
		const car = this.car;
		this.scene.pushMatrix();
			// 2. Move car to appropriate position.
			this.scene.translate(this.P.X, this.P.Y, this.P.Z);

			// 1. Draw car here.
			this.scene.rotate(Math.PI, 0, 1, 0);
			this.hood.display();
			this.left.display();
			this.right.display();
			this.scene.pushMatrix();
				this.scene.translate(car.xWheelFront, 0,  car.lCar / 2);
				this.wheelLeftFront.display();
			this.scene.popMatrix();
			this.scene.pushMatrix();
				this.scene.translate(car.xWheelFront, 0, -car.lCar / 2);
				this.wheelRightFront.display();
			this.scene.popMatrix();
			this.scene.pushMatrix();
				this.scene.translate(car.xWheelBack,  0,  car.lCar / 2);
				this.wheelLeftBack.display();
			this.scene.popMatrix();
			this.scene.pushMatrix();
				this.scene.translate(car.xWheelBack,  0, -car.lCar / 2);
				this.wheelRightBack.display();
			this.scene.popMatrix();
		this.scene.popMatrix();
	};

	bindTexture(hoodTexture, sideTexture, wheelCylinderTexture, wheelSideTexture)
	{
		this.hood.bindTexture(hoodTexture);
		this.left.bindTexture(sideTexture);
		this.right.bindTexture(sideTexture);
		this.wheelLeftFront.bindTexture(wheelCylinderTexture, wheelSideTexture);
		this.wheelRightFront.bindTexture(wheelCylinderTexture, wheelSideTexture);
		this.wheelLeftBack.bindTexture(wheelCylinderTexture, wheelSideTexture);
		this.wheelRightBack.bindTexture(wheelCylinderTexture, wheelSideTexture);
	};
};
