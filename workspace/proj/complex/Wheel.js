class Wheel extends CGFobject
{
    constructor(scene, radius, width)
    {
        super(scene);
        this.wheel = new ClosedCylinder(scene, radius, width);
        this.radius = radius;
        this.width = width;
    };

    display()
    {
        this.scene.pushMatrix();
            this.scene.translate(0, 0, this.radius);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.scene.translate(0, 0, -this.width / 2);
            this.wheel.display();
        this.scene.popMatrix();
    };

    bindTexture(cylinderTexture, baseTexture)
    {
        this.wheel.bindTexture(cylinderTexture, baseTexture);
    };
};
