// A collection of triangles that make up a 
// single polygon.

function Face ( triangles, colorR, colorG, colorB ) {
	this.pieces = triangles;
	this.r = colorR;
	this.g = colorG;
	this.b = colorB;
	
	this.toString = function toString () {
		var result = "" + this.pieces.length + " Pieces\n";
		for (var i = 0; i < this.pieces.length; i++) {
			result += "    " + i + ":   a: " + this.pieces[i].a + ", b: " +
			this.pieces[i].b + ", c: " + this.pieces[i].c + "\n";
		}
		return result + "\n";
	}
	
}