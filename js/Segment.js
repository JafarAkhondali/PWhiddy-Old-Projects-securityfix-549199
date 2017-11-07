// Stores the indexes of two vertices that 
// make up a line segment

function Segment ( a, b ) {
	this.a = a;
	this.b = b;
	
	this.toString = function toString () {
		return this.a + " --- " + this.b;
	}
	
}