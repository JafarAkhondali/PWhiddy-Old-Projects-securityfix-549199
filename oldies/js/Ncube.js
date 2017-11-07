/// Square class (extends Figure class)
// A specific instance of the figure class that 
// represents an Nth dimensional square, cube, ect
function Ncube ( dimensions, scale, position, win ) {
	
	this.dimensions = dimensions;
	this.window = win;
	this.winWidth = this.window.innerWidth;//screen.width;
	this.winHeight = this.window.innerHeight;//screen.height;
	this.devicePixRatio = win.devicePixelRatio; 
	this.center = new Vector( position );
	if ( position == null ) {
		this.center = new Vector( [ 0.0, 0.0, 0.0 ] );
	}
	
	// First we generate the vertices
	// Number of vertices will always be 2^dimensions
	this.createVertices = function createVertices () {
		var verts = new Array( Math.pow( 2, this.dimensions ) );
		for (var i = 0; i < verts.length; i++) {
			// Creates each needed point
			var p = new Vector( new Float32Array( this.dimensions ) );
			// Gives the proper value to each of the points axes.
			for (var axis = 0; axis < this.dimensions; axis++) {
				// This expression is very confusing and maybe
				// even a little magic, the notes2.png file 
				// may shed a little light on things
				p.setAxis( axis, Math.pow( -1.0, 
				Math.floor( ( 2.0 * i * ( Math.pow( 2.0, axis ) ) ) / verts.length ) )
				* (scale / 2.0 ) );
			}
			verts[i] = p;
		}
		return verts;
	}
	
	// Use this method to store the vertices
	this.vertices = this.createVertices();

	// Now we generate associations between vertices that
	// represent the lines (edges) the "square" should have.
	// Turns out there are { ((2^d) * d ) / 2 } segments for any d dimensions
	// These loops go through every possible combination of 
	// vertices and then ...
	this.createSegments = function createSegments () {
		var lines = [];
		for (var a = 0; a < this.vertices.length - 1; a++) {
			for (var b = a + 1; b < this.vertices.length; b++) {
				var sharedAxes = 0;
				for (var axis = 0; axis < this.dimensions; axis++) {
					// ... counts the number of axis in which 
					// the vertices have the same value.
					if (this.vertices[a].getAxis( axis ) ===
						this.vertices[b].getAxis( axis )) {
						sharedAxes++;
					}
				}
				// If they share all axis values except for 1, 
				// then they should be connected (a new line is born)
				if (sharedAxes === this.dimensions - 1) {
					lines.push(new Segment( a, b ));
				}
			}
		}
		return lines;
	}
	
	// Use the method to store the segments
	this.segments = this.createSegments();
	
	
	this.isFace = function isFace ( a, b, c, d ) {
		var count = 0;
		for (var axis = 0; axis < this.dimensions; axis++ ) {
			var sum = this.vertices[ a ].getAxis( axis ) +
				      this.vertices[ b ].getAxis( axis ) +
				      this.vertices[ c ].getAxis( axis ) +
				      this.vertices[ d ].getAxis( axis ) ;
			if (sum === scale * 2 || sum === - scale * 2) {
				count++;
			}
		}
		return count === this.dimensions - 2;
	}
	
	this.createFaces = function createFaces () {
		var faces = [];
	//	alert ("entering");
		var length = this.vertices.length;
		for (var a = 0; a < length - 3; a++) {
			for (var b = a + 1; b < length - 2; b++) {
				for (var c = b + 1; c < length - 1; c++) {
					for (var d = c + 1; d < length; d++) {
						if (this.isFace( a, b, c, d )) {
							faces.push( new Face ( [ new THREE.Face3 ( c, b, a ), 
							              new THREE.Face3 ( b, c, d ) ] ) );
						}
					}
				} 
			}
		}
		
		return faces;
	}
	
	this.faces = this.createFaces();
	
	this.mesh = this.makeMeAMesh();
	
}

//This makes the Square class inherit all of the 
//figure classes functions and properties 
//(these are known as methods and fields in regular java)
//Its like saying "Square extends Figure"
Ncube.prototype = new Figure();


