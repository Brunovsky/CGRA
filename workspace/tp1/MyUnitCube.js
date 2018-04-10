class MyUnitCube extends CGFobject
{
    constructor(scene) 
	{
		super(scene);
		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [
            0.5, -0.5, 0.5,  //EBF 0
            0.5, -0.5, -0.5, //EBT 1
            0.5, 0.5, 0.5,   //ECF 2
            0.5, 0.5, -0.5,  //ECT 3
            -0.5, -0.5, 0.5,  //DBF 4
            -0.5, -0.5, -0.5, //DBT 5
            -0.5, 0.5, 0.5,   //DCF 6
            -0.5, 0.5, -0.5,  //DCT 7
				];

		this.indices = [ // 6 faces F/T/E/D/B/C tendo como perspectiva estar no referencial
            0, 2, 4,// F
            6, 4, 2,
            
            1, 5, 3,// T
            7, 3, 5,
            
            0, 1, 2,// E
            3, 2, 1,
            
            5, 4, 6,// D
            6, 7, 5,
            
            0, 4, 1,// B
            4, 5, 1,
            
            2, 3, 6,// C
            3, 7, 6
            
			];
			
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};    
};