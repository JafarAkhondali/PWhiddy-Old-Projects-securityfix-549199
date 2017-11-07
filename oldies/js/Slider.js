function Slider ( dimensions, wWidth, wHeight, figure ) {

	this.dimensions = dimensions;
	this.figure = figure;
	this.wWidth = wWidth;
	this.wHeight = wHeight;
	this.aspRatio = wWidth / wHeight;
	this.axisCount = ( this.dimensions * this.dimensions - this.dimensions ) / 2;
	this.axisSpacing = 2 / ( this.axisCount + 1 );
	this.sliderHeight = 4 / 3; //Math.PI;
	this.rendersPerSlide = 7;
	this.verticalSpacing = this.sliderHeight / this.rendersPerSlide;
	this.sliderCubeSize = Math.min(
	this.verticalSpacing * 1.08, 
	this.axisSpacing * this.aspRatio ) * 0.6; 
	this.mainCubeSize = ( 2 - this.sliderHeight ) * 0.6;
	this.mainCubeVCenter =  0.5 * this.sliderHeight;
	this.sliderVCenter = 0.5 * this.sliderHeight - 1;
	this.totalInstances = this.rendersPerSlide * this.axisCount + 1;
//	this.mysteryPixelSize = 250;
	this.speedFactor = 1.3333 / this.figure.devicePixRatio;
	this.rotMultiplier = 1.5;
	this.dampRate = 0.95;

	/*
	this.axisSpacing = 0.7;
	this.sliderHeight = Math.PI;
	this.rendersPerSlide = 8;
	this.verticalSpacing = this.sliderHeight / this.rendersPerSlide;
	this.sliderCubeSize = 0.12;
	this.mainCubeSize = 0.6;
	this.mainCubeVCenter = 1.45;
	this.sliderVCenter = -1.0;
	this.axisCount = ( this.dimensions * this.dimensions - this.dimensions ) / 2;
	this.totalInstances = this.rendersPerSlide * this.axisCount + 1;
	this.wWidth = wWidth;
	this.wHeight = wHeight;
	this.mysteryPixelSize = 250;
	this.magicSpeedFactor = 700;
	this.dampRate = 0.965;
	*/

	this.activeTouches = [];
	this.spinSpeed = [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ];

	this.damp = function damp () {
		var length = this.spinSpeed.length;
		for ( var a = 0; a < length; a++ ) {
			this.spinSpeed[ a ] *= this.dampRate;
		}
	//	length = this.activeTouches.length;
	//	for ( var t = 0; t < length; t++ ) {
	//		this.spinSpeed[ this.activeTouches[ t ].aX ] = 0.0;
	//	}
	}

	this.handleStartTouch = function handleStartTouch ( event ) {
		//alert(Object.getOwnPropertyNames( event ));
		var newTouches = event.changedTouches;
		var length = newTouches.length;
		for ( var tIndex = 0; tIndex < length; tIndex++ ) {
			var touch = this.normalize( newTouches[ tIndex ] );
			if ( touch.y < this.sliderVCenter + 0.5 * this.sliderHeight ) {
				this.activeTouches[ touch.id ] = 
				{ aX: 
				Math.floor( 
					( touch.x + 1 - 0.5 * this.axisSpacing ) / this.axisSpacing ),
				  lastY: touch.y
				}
		//		alert( "x: " + newTouches[ tIndex ].x + " y: " + 
		//			newTouches[ tIndex ].y );
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

	this.normalize = function normalize( event ) {
		var dpr = 1;//this.figure.devicePixRatio;	
		return { x: ( event.clientX / 
					( dpr * this.wWidth ) ) * 2 - 1,
				 y: - ( event.clientY / 
					( dpr * this.wHeight ) ) * 2 + 1,
				id: event.identifier };
	}

}