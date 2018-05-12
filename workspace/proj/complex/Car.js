class Car extends CGFobject
{
	constructor(scene, car)
	{
		super(scene);
		this.car = new uvSurface(scene,
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
	};

	display()
	{
		this.car.display();
		this.left.display();
		this.right.display();
	};
};
