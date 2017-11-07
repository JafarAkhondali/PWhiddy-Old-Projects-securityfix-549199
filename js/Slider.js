function Slider ( dimensions, wWidth, wHeight, figure ) {

	this.dimensions = dimensions;
	this.figure = figure;
	this.wWidth = wWidth;
	this.wHeight = wHeight;
	this.aspRatio = wWidth / wHeight;
	this.axisCount = ( this.dimensions * this.dimensions - this.dimensions ) / 2;
	this.axisSpacing = 2 / ( this.axisCount + 1 );
	this.sliderHeight = 1.37;// / 3; //Math.PI;
	this.rendersPerSlide = 7;
	this.verticalSpacing = this.sliderHeight / this.rendersPerSlide;
	this.sliderCubeSize = Math.min(
	this.verticalSpacing * 1.00, 
	this.axisSpacing * this.aspRatio ) * 0.6; 
	this.mainCubeSize = ( 2 - this.sliderHeight ) * 0.68;
	this.mainCubeVCenter =  0.5 * this.sliderHeight - 0.02;
	this.sliderVCenter = 0.5 * this.sliderHeight - 1.17;
	this.totalInstances = this.rendersPerSlide * this.axisCount + 1;
	this.speedFactor = 1.2 / 3;//this.figure.devicePixRatio;
	this.rotMultiplier = 1.5;
	this.dampRate = 0.95;


	this.activeTouches = [];
	this.spinSpeed = [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ];

	this.damp = function damp () {
		var length = this.axisCount;
		var vertSpacing = this.verticalSpacing;
		for ( var a = 0; a < length; a++ ) {
			// Also add force that pushes the sliders into "notches"
			//console.log(this.figure.rotations[a]);
			if ( this.activeTouches[a] == null ) {
		//		this.spinSpeed[ a ] -= 0.0007*(((50*(this.figure.rotations[a]+0.5*vertSpacing))%(50*vertSpacing))-0.5*vertSpacing);//%vertSpacing-0.0*vertSpacing);
			}
			this.spinSpeed[ a ] *= this.dampRate;
		}

	}

	this.handleStartTouch = function handleStartTouch ( event ) {
		var newTouches = event.changedTouches;
		var length = newTouches.length;
		for ( var tIndex = 0; tIndex < length; tIndex++ ) {
			var touch = this.normalize( newTouches[ tIndex ] );
			if ( touch.y < this.sliderVCenter + 0.5 * this.sliderHeight - 0.08 ) {
				this.activeTouches[ touch.id ] = 
				{ aX: 
				Math.floor( 
					( touch.x + 1 - 0.5 * this.axisSpacing ) / this.axisSpacing ),
				  lastY: touch.y
				}
			}
		}
	}

	this.handleDragTouch = function handleDragTouch ( event ) {
	
		var movedTouches = event.changedTouches;
		var length = movedTouches.length;
		for ( var tIndex = 0; tIndex < length; tIndex++ ) {
			var touch = this.normalize( movedTouches[ tIndex ] );
		//	console.log( "x: " + touch.x + " y: " + touch.y );
			var dragStatus = this.activeTouches[ touch.id ];
			if ( dragStatus ) {
				var amount = this.speedFactor * ( dragStatus.lastY - touch.y );
				this.spinSpeed[ dragStatus.aX ] = //make MAX
				0.8 * amount + 0.5 * this.spinSpeed[ dragStatus.aX ];
				
				var temp = this.figure.rotations[ dragStatus.aX ] + amount;
				this.figure.rotations[ dragStatus.aX ] = temp % this.verticalSpacing;
				var r = 0;
				for ( var a = 0; a < this.dimensions - 1; a++ ) {
					for ( var b = a + 1; b < this.dimensions; b++ ) {
						if ( dragStatus.aX === r ) {
							this.figure.rotate( 
								amount * this.rotMultiplier, a, b );
						}
						r++;
					}
				}
				dragStatus.lastY = touch.y;
			}
		}

	}

	this.handleEndTouch = function handleEndTouch ( event ) {
		var movedTouches = event.changedTouches;
		var length = movedTouches.length;
		for ( var tIndex = 0; tIndex < length; tIndex++ ) {
			this.activeTouches[ movedTouches[ tIndex ].identifier ] = null;
		}
	}

	this.handleStartClick = function handleStartClick ( event ) {
		this.handleStartTouch( this.spiffClickEvent( event ) );
	}

	this.handleDragClick = function handleDragClick ( event ) {
		this.handleDragTouch( this.spiffClickEvent( event ) );
	}

	this.handleEndClick = function handleEndClick ( event ) {
		this.handleEndTouch( this.spiffClickEvent( event ) );
	}

	this.spiffClickEvent = function spiffClickEvent ( event ) {
		event.identifier = 117;
		var temp = { changedTouches: [] };
		temp.changedTouches[ 0 ] = event;
		return temp;
	}

	this.normalize = function normalize ( event ) {
		var dpr = 1;//this.figure.devicePixRatio;	
		return { x: ( event.clientX / 
					( dpr * this.wWidth ) ) * 2 - 1,
				 y: - ( event.clientY / 
					( dpr * this.wHeight ) ) * 2 + 1,
				id: event.identifier };
	}

}