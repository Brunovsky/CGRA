/**
 * MyClockHand
 * @param gl {WebGLRenderingContext}
 * @constructor
 *
 * altered to have base
 *
 */

var CLOCKHAND_WIDTH = 0.1;
var CLOCKHAND_LENGTH = 0.5;

class MyClockHand extends CGFobject
{
	constructor(scene)
    {
        super(scene);
        this.cube = new MyUnitCubeQuad(scene);
    }

	display(){
		this.scene.pushMatrix();
			this.scene.scale(CLOCKHAND_WIDTH, CLOCKHAND_LENGTH, 0.1);
			this.scene.translate(0, 0, 2);
			this.cube.display();
		this.scene.popMatrix();
	}
};

/*class MyClockHand extends CGFobject
{
	constructor(scene, alphaI = 0)
    {
        super(scene);

        this.quad = new MyQuad(scene);
        setAngle(alphaI);
    }

    setAngle(degree)
    {
    	this.alpha = degree * degToRad;
    }

	display(){
		this.scene.pushMatrix();
			this.scene.rotate(alpha, 0, 0, 1);
			this.quad.display();
		this.scene.popMatrix();
	}
};*/