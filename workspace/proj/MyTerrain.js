class MyTerrain extends Plane {
	
	constructor(scene, nrDivs){
		super(scene, nrDivs);
		
		nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;

		
		this.nrDivs = nrDivs;
		this.patchLength = 1.0 / nrDivs;

		this.initBuffers();
	}
}
