
function Input ( size ) {
	
	this.size = size;
	this.rotate = new Array( this.size );
	this.increasePressed = new Array( this.size );
	this.decreasePressed = new Array( this.size );

	//this.rate = 0.021;
	
	//for (var r = 0; r < this.rotate.length; r++) {
	//	this.rotate[ r ] = 0;
	//}
	
	for (var k = 0; k < this.size; k++) {
		this.rotate[ k ] = 0;
		this.increasePressed[ k ] = false;;
		this.decreasePressed[ k ] = false;
	}
	
	this.key = function key ( event, press ) {

	//	alert( event.keyCode );
		switch ( event.keyCode ) {
			case 81: // q
				this.increasePressed[ 0 ] = press;
			break;
			
			case 87: // w
				this.increasePressed[ 1 ] = press;
			break;
			
			case 69: // e
				this.increasePressed[ 2 ] = press;
			break;
			
			case 82: // r
				this.increasePressed[ 3 ] = press;
			break;
			
			case 84: // t
				this.increasePressed[ 4 ] = press;
			break;
			
			case 89: // y
				this.increasePressed[ 5 ] = press;
			break;
			
			case 65: // a 
				this.decreasePressed[ 0 ] = press;
			break;
			
			case 83: // s
				this.decreasePressed[ 1 ] = press;
			break;
			
			case 68: // d
				this.decreasePressed[ 2 ] = press;
			break;
			
			case 70: // f
				this.decreasePressed[ 3 ] = press;
			break;

			case 71: // g
				this.decreasePressed[ 4 ] = press;
			break;

			case 72: // h
				this.decreasePressed[ 5 ] = press;
			break;
		}
	}
	
	this.getR = function getR () {
		var tempUp;
		var tempDn;
		for (var r = 0; r < this.size; r++) {
			tempUp = this.increasePressed[ r ] ? -1 : 0;
			tempDn = this.decreasePressed[ r ] ?  1 : 0;
			this.rotate[ r ] = 0.015 * ( tempUp + tempDn ); 
		}
		return this.rotate;
	}
	
}