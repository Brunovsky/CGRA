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
	constructor(scene, alphaI, width_m, length_m)
    {
        super(scene);
        this.cube = new MyUnitCubeQuad(scene);
		this.setAngle(alphaI);
		this.width = width_m;
		this.length = length_m;
    }

	 setAngle(degree)
    {
    	this.alpha = Math.PI*degree/180;
    }
	
	display(){
		this.scene.pushMatrix();
			this.scene.rotate(-this.alpha, 0, 0, 1);
			this.scene.translate(0, this.length/4, 0);
			this.scene.scale(this.width, this.length, 1);
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
    	this.alpha = Math.PI*degree/180;
    }

	display(){
		this.scene.pushMatrix();
			this.scene.rotate(alpha, 0, 0, 1);
			this.quad.display();
		this.scene.popMatrix();
	}
};*/