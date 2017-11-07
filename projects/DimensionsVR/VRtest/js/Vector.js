// A Vector in R^n

function Vector ( axisValues ) {
	
	// Constructor creates an empty 
	// array if no values are provided
	this.components = [];   
	if ( axisValues != null ) {
		this.components = axisValues;
	}
	
	// Sets the given axis to the provided value
	this.setAxis = function setAxis ( axis, value ) {
		this.components[ axis ] = value;
	}
	
	// Returns the coordinate in the provided axis
	this.getAxis = function getAxis ( axis ) {
	//	if ( this.components.length + 1 < axis ) {
	//		return 0.0;
	//	} else {
			return this.components[ axis ];
	//	}
	}
 	
	// Adds the provided vector to this one.  If the 
	// provided vector has more defined axes than this
	// one, those axes are ignored.
	this.add = function add ( other ) {
		for ( var axis = 0; axis < this.dimensions; axis++ ) {
			this.components[ axis ] += other.getAxis( axis );
		} 
	}
	
	// Subtracts the provided vector from this one.  
	// If the provided vector has more defined 
	// axes than this one, those axes are ignored.
	this.subtract = function subtract ( other ) {
		for ( var axis = 0; axis < this.dimensions; axis++ ) {
			this.components[ axis ] -= other.getAxis( axis );
		}
	}

	this.dimensions = function dimensions () {
		return this.components.length;
	}
	
	// Returns the values of each axis surrounded by brackets
	this.toString = function toString () {
		var result = "[";
		if (this.components[0] >= 0) {
			result += " ";
		}
		result += this.components[0];
		for (var t = 1; t < this.components.length; t++) {
			result += ", ";
			if (this.components[t] >= 0) {
				result += " ";
			}
			result += this.components[t];
		}
		result += "]";
		return result;
	}

}