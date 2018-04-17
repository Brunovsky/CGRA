/**
 * MyClock
 * @param gl {WebGLRenderingContext}
 * @constructor
 *
 * altered to have base
 *
 */

class MyClock extends CGFobject
{
	constructor(scene)
    {
        super(scene);
		this.cylinder = new MyCylinder(this.scene, 12, 1);
		this.circle = new MyCircle(this.scene, 12);
    }
	
	display(){
		
	}
};








