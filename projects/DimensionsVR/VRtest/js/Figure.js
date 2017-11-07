// A collection of vertices, lines, and
// faces intended to make up any Nth dimensional 
// geometry.

function Figure () {
	
	this.center = new Vector();
	this.dimensions;
	this.vertices = [];
	this.segments = [];
	this.faces = [];

	this.scale;
	this.activeAxis = 0;
	this.rotations;
	this.vCount;
	this.posArray;
	this.slide;
	this.input;
	this.devicePixRatio;

	this.offsets;
	this.sizes;
	this.rotationAxis;
	this.globalOffset;

	this.resize;
	
	this.makeMeAMesh = function makeMeAMesh () {
		
		this.faceGeometry = new THREE.InstancedBufferGeometry();
		this.lineGeometry = new THREE.InstancedBufferGeometry();
		this.pointGeometry = new THREE.InstancedBufferGeometry();
		
		var empty = Math.pow( 2, this.dimensions ) * 3;
		this.posArray = [];
		this.vCount = this.vertices.length;
		var positionFluff = new Float32Array( this.vCount * 3 );
		this.axisCount = ( this.dimensions * this.dimensions - this.dimensions ) / 2;
		this.resize = false;
	//	this.totalInstances = this.rendersPerSlide * this.axisCount + 1;


		///////////// NON-INSTANCED ATTRIBUTES ///////////////////

		for ( var pIndex = 0; pIndex < this.dimensions; pIndex++ ) {
			this.posArray[ pIndex ] = new Float32Array( this.vCount /** this.dimensions*/ );
		}
		for ( var i = 0; i < this.vCount; i++ ) {
			positionFluff[ i * 3 + 0 ] = this.vertices[ i ].getAxis( 0 );
			positionFluff[ i * 3 + 1 ] = this.vertices[ i ].getAxis( 1 );
			positionFluff[ i * 3 + 2 ] = this.vertices[ i ].getAxis( 2 );
			for ( var dim = 0; dim < this.dimensions; dim++ ) {
				this.posArray[ dim ][ i ] = this.vertices[ i ].getAxis( dim );
			}
		}
	//	alert(positionFluff + " length: " + positionFluff.length);
	//	alert(this.posArray[ 0 ] + " length: " + this.posArray[0].length);
		positionFluff = new THREE.BufferAttribute( positionFluff, 1 );
		this.addAttributeToAll( 'position', positionFluff );

		//this.faceGeometry.addAttribute( 'normal', positionFluff, 3 ) );
		//this.faceGeometry.computeVertexNormals();  

		for ( var att = 1; att <= this.dimensions; att++ ) {
			var current = new THREE.BufferAttribute( this.posArray[ att - 1 ], 1 );
			this.addAttributeToAll( ('pos' + att), current );
		}
		
		var faceIndices = [];
		for ( var faceIndex = 0; faceIndex < this.faces.length; faceIndex++ ) {
			for ( var triangle = 0; triangle <
			 this.faces[ faceIndex ].pieces.length; triangle++ ) {
				faceIndices.push( this.faces[ faceIndex ].pieces[ triangle ].a );
				faceIndices.push( this.faces[ faceIndex ].pieces[ triangle ].b );
				faceIndices.push( this.faces[ faceIndex ].pieces[ triangle ].c );
			}
		}
		this.faceGeometry.setIndex( 
			new THREE.BufferAttribute( new Uint16Array( faceIndices ), 1 ) );

		var segIndices = [];
		for ( var segIndex = 0; segIndex < this.segments.length; segIndex++ ) {
			segIndices.push( this.segments[ segIndex ].a );
			segIndices.push( this.segments[ segIndex ].b );
		}
		this.lineGeometry.setIndex( 
			new THREE.BufferAttribute( new Uint16Array( segIndices ), 1 ) );

		var vertIndices = new Uint16Array( this.vCount );
		for ( var vertIndex = 0; vertIndex < this.vCount; vertIndex++ ) {
			vertIndices[ vertIndex ] = vertIndex;
		}
		this.pointGeometry.setIndex( new THREE.BufferAttribute( vertIndices, 1 ) );


			////////////////// INSTANCED ATTRIBUTES ////////////

		this.slide = new Slider( this.dimensions, this.winWidth, this.winHeight, this );
		this.input = new Input( this.axisCount );

		this.offsets = new THREE.InstancedBufferAttribute( 
			new Float32Array( this.slide.totalInstances * 3 ), 3, 1 ).setDynamic( true );
		
		this.sizes = new Float32Array( this.slide.totalInstances );
		this.rotationAxis = new Float32Array( this.slide.totalInstances );
		this.globalOffset = new Float32Array( this.slide.totalInstances );
	//	alert(rotationAxis);

		this.addAttributeToAll( 'offset', this.offsets );

		this.sizes = new THREE.InstancedBufferAttribute( this.sizes, 1, 1 );
		this.addAttributeToAll( 'size', this.sizes );

		this.rotationAxis = new 
			THREE.InstancedBufferAttribute( this.rotationAxis, 1, 1 );
		this.addAttributeToAll( 'rotAxis', this.rotationAxis );

		this.globalOffset = new 
		THREE.InstancedBufferAttribute( this.globalOffset, 1, 1 );
		this.addAttributeToAll(  'gOff', this.globalOffset );

		this.updateInstances();


		////////////// PREPARE UNIFORMS ///////////////

		this.scale = new Float32Array( this.dimensions );
		for ( var a = 0; a < this.dimensions; a++ ) {
			this.scale[a] = 0.0;
		}

		this.rotations = new Float32Array( this.axisCount );
		for ( var axis = 0; axis < this.axisCount; axis++ ) {
			this.rotations[ axis ] = 0.0;
		}
		
	//	var cOffset = new THREE.Vector3( this.center.getAxis( 0 ), 
	//		this.center.getAxis( 1 ), this.center.getAxis( 2 ) );
		
		var tMap = THREE.ImageUtils.loadTexture( 'Images/point.png' );
	//	var loader = new THREE.TextureLoader();
	//	loader.load( 'Images/Point.png',
	//					function ( texure ) {
	//						tMap = texure;
	//					}, 
	//					function ( xhr ) {
	//						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	//					},
	//					// Function called when download errors
	//					function ( xhr ) {
	//						console.log( 'An error happened' );
	//	} );
		
		this.uniforms = {
				time: { type: 'f', value: 0.0 },
				nPlaneDistance: { type: 'f', value: 4.5 },
				slideWidth: { type: 'f', value: this.slide.axisSpacing },
				verticalSpace: { type: 'f', value: this.slide.verticalSpacing },
				slideHeight: { type: 'f', value: this.slide.sliderHeight },
				slideCenter: { type: 'f', value: this.slide.sliderVCenter },
				rotMultiplier: { type: 'f', value: this.slide.rotMultiplier },
			//	rotationAxis: { type: 'i', value: -1 },
			//	offset: { type: 'v3', value: cOffset },
				scale: { type: 'fv1', value: this.scale },
				rotations: { type: 'fv1', value: this.rotations },
				texture: { type: 't', value: tMap }
		};
	//	this.uniforms.scale.value[ 0 ] = 0.01;
		
		/////////  CREATE MATERIALS  ///////////

		var sSource = new ShaderSource( this.dimensions, this.axisCount );

		var faceMaterial = new THREE.RawShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader:   sSource.vertexAttrib(),
			fragmentShader: sSource.cubeFragFaces(),
			side: THREE.DoubleSide,
			depthWrite: false,
			depthTest: true,
		//	blending: THREE.MultiplyBlending,
			transparent: true
		} );

		var lineMaterial = new THREE.RawShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader:   sSource.vertexAttrib(),
			fragmentShader: sSource.cubeFragEdges(),
			wireframe: false,
			linewidth: 5,
			blending: THREE.AlphaMultiplyBlending,
			//side: THREE.DoubleSide,
			//depthWrite: false,
			depthTest: true,
			transparent: true
		} );

		var pointMaterial = new THREE.RawShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader: sSource.vertexAttrib(),
			fragmentShader: sSource.cubeFragPoints(),
			depthWrite: true,
			depthTest: false,
		//	blending: THREE.AlphaBlending,
			transparent: true
		} );
		//var pointMaterial = new THREE.PointsMaterial( { size: 0.2, color: 0x00ff00} )
    

		//////// LUMP INTO SINGLE Object  ////////////

		var fM = new THREE.Mesh( this.faceGeometry, faceMaterial );
		var lM = new THREE.LineSegments( this.lineGeometry, lineMaterial );
		var pM = new THREE.Points( this.pointGeometry, pointMaterial );
		pM.renderOrder = 1;
		lM.renderOrder = 2;
		fM.renderOrder = 3;
		pM.add( lM );
		pM.add( fM );
	//	alert(Object.getOwnPropertyNames(pM.material));
		return pM;
	}

	this.addAttributeToAll = function addAttributeToAll ( name, attribute ) {
		this.faceGeometry.addAttribute( name, attribute );
		this.lineGeometry.addAttribute( name, attribute );
		this.pointGeometry.addAttribute( name, attribute );
	}

	this.updateFrame = function() {
		
		if ( this.scale[ this.activeAxis ] < 1.0 ) {
			this.scale[ this.activeAxis ] += 0.00015;
			this.scale[ this.activeAxis ] *= 1.016;
		} else if ( this.activeAxis < this.dimensions ) {
			this.activeAxis++;
		}
		
		if ( this.resize ) {
			this.updateInstances();
			this.resize = false;
		}
		this.updateRotation( this.input.getR() );
		this.slide.damp();
		this.updateRotation( this.slide.spinSpeed );
		var tempRot = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
		if ( this.activeAxis > 1 ) {
			tempRot[0] = 0.003;
			if ( this.activeAxis > 2 ) {
				tempRot[1] = 0.003;
				tempRot[3] = 0.003;
				if ( this.activeAxis > 3 ) {
					tempRot[2] = 0.003;
					tempRot[4] = 0.003;
					tempRot[5] = 0.003;
				}
			}
		} 
		this.updateRotation( tempRot );
	//	this.updateRotation( [ 0.003, 0.003, 0.003, 0.003, 0.003, 0.003 ] );
	}

	this.updateInstances = function updateInstances() {
	//	alert("Get ready cause here we goooo!");
		this.winWidth = this.window.innerWidth;//screen.width;
		this.winHeight = this.window.innerHeight;//screen.height;
		this.slide = new Slider( this.dimensions, this.winWidth, this.winHeight, this );		
		/// LARGE CUBE ATTRIBUTES ///
		this.offsets.setXYZ( 0,  0.0,  0.0,  -0.0);
		this.sizes.setX( 0, this.slide.mainCubeSize );
		this.rotationAxis.setX( 0, -1.0 );
		this.globalOffset.setX( 0, this.slide.mainCubeVCenter );

		/// SMALL CUBE ATTRIBUTES ///
		var instanceIndex;
		for ( var column = 1; column <= this.axisCount; column++ ) {
			for ( var row = 0; row < this.slide.rendersPerSlide; row++ ) {
				instanceIndex = 
					column * this.slide.rendersPerSlide + 
					row - this.slide.rendersPerSlide + 1;
				this.offsets.setXYZ( instanceIndex, 
					this.slide.axisSpacing * ( column - (2.0/3.0) * this.axisCount ) +
					0.5 * this.slide.axisSpacing * ( ( this.axisCount - 1 ) % 2 ),
					this.slide.verticalSpacing * 
					( row - Math.floor( 0.5 * this.slide.rendersPerSlide ) ), -0.0 );
				this.sizes.setX( instanceIndex, this.slide.sliderCubeSize );
				this.rotationAxis.setX( instanceIndex, column - 1 );
				this.globalOffset.setX( instanceIndex, this.slide.sliderVCenter );
			}
		}
		/*
		var attribs = this.mesh.geometry.attributes;
		attribs[ 'offset' ].needsUpdate = true;
		attribs[ 'size' ].needsUpdate = true;
		attribs[ 'rotAxis' ].needsUpdate = true;
		attribs[ 'gOff' ].needsUpdate = true;
		*/
		this.offsets.needsUpdate = true;
		this.sizes.needsUpdate = true;
		this.rotationAxis.needsUpdate = true;
		this.globalOffset.needsUpdate = true;

	}	

	this.updateRotation = function updateRotation ( vals ) {
		var temp;
		for ( var axisColumn = 0; axisColumn < this.axisCount; axisColumn++ ) {
			temp = this.rotations[ axisColumn ] + vals[ axisColumn ];
			this.rotations[ axisColumn ] = temp % this.slide.verticalSpacing;
		} 
		var r = 0;
		for ( var a = 0; a < this.dimensions - 1; a++ ) {
			for ( var b = a + 1; b < this.dimensions; b++ ) {
				if ( vals[ r ] !== 0 ) {
					this.rotate( vals[ r ] * this.slide.rotMultiplier, a, b );
				}
				r++;
			}
		}
	//	alert(this.mesh.geometry.attributes.array)

		for ( var axisUpdate = 1; axisUpdate <= this.dimensions; axisUpdate++ ) {
			this.mesh.geometry.attributes[ ( 'pos' + axisUpdate ) ].needsUpdate = true;
		}

	}

	this.rotate = function rotate ( amount, a, b ) {

		var sin = Math.sin( amount );
		var cos = Math.cos( amount );

		var oldA;
		var oldB;
		for (var v = 0; v < this.vCount; v++ ) {
			oldA = this.posArray[ a ][ v ];
			oldB = this.posArray[ b ][ v ];
			this.posArray[ a ][ v ] = oldA * cos - oldB * sin;
			this.posArray[ b ][ v ] = oldA * sin + oldB * cos;
		}

	}

}