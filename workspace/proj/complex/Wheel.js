class Wheel extends CGFobject
{
    constructor(scene, radius, width)
    {
        super(scene);
        this.wheel = new ClosedCylinder(scene, radius, width);
        this.radius = radius;
        this.width = width;
        this.theta = 0;
        this.gamma = 0;
    };

    display()
    {
        this.scene.pushMatrix();
            // 4. Orientate the wheel
            this.scene.rotate(-this.gamma, 0, 1, 0);
            // 3. Bring it up on the xz plane.
            this.scene.translate(0, this.radius, 0);
            // 2. Rotate it so it stands like a wheel. 
            this.scene.rotate(Math.PI / 2, 1, 0, 0);
            // 1. Put the center of the cylinder in the origin:
            this.scene.translate(0, -this.width / 2, 0);
            // 0. Rotate the wheel
            this.scene.rotate(this.theta, 0, 1, 0);
            this.wheel.display();
        this.scene.popMatrix();
    };

    forward(distance)
    {
        this.theta += distance / this.radius;
    };

    turn(gamma)
    {
        this.gamma = gamma;
    };

    bindTexture(cylinderTexture, baseTexture)
    {
        this.wheel.bindTexture(cylinderTexture, baseTexture);
    };
};
