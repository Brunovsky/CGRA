/**
 * MyClockHand
 * @param gl {WebGLRenderingContext}
 * @constructor
 *
 * altered to have base
 *
 */

var CLOCKHAND_WIDTH = 0.1;

class MyClockHand extends CGFobject
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
			this.scene.rotate(alpha, 0, 1, 0);
			this.quad.display();
		this.scene.popMatrix();
	}
};