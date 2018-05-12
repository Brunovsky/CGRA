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
	};

	display()
	{
		const car = this.car;
		this.hood.display();
		this.left.display();
		this.right.display();
		this.scene.pushMatrix();
			this.scene.translate(car.xWheelFront,  car.lCar / 2, 0);
			this.wheelLeftFront.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(car.xWheelFront, -car.lCar / 2, 0);
			this.wheelRightFront.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(car.xWheelBack,  car.lCar / 2, 0);
			this.wheelLeftBack.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(car.xWheelBack, -car.lCar / 2, 0);
			this.wheelRightBack.display();
		this.scene.popMatrix();
	};
};
