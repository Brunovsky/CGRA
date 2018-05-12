class Car extends CGFobject
{
	constructor(scene, func = carSmooth)
	{
		super(scene);
		this.car = new uvSurface(scene,
			func.main,
			func.boundaries,
			func.slices);
	};

	display()
	{
		this.car.display();
	};
};
