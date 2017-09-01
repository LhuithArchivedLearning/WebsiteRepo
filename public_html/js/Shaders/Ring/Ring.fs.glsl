
		varying vec3 lightdir;
		varying vec3 eyenorm;
		uniform vec3 color; 	
		varying vec2 vUv;
		varying vec4 eyepos;

		varying vec3 vecNormal;
		varying vec3 vWorldPosition;
		
		//Although looks random as fuck, its being parsed//recplaced with Shadow.glsl, 
		//refer to mains callback async nested bumb 
		AddShadow
		AddDither		
		//--------------------------------------------------------------------
		//-------------------------------------------------------------------
		
		#if NUM_DIR_LIGHTS > 0
		struct DirectionalLight 
		{
			vec3 direction;
			vec3 color;
			int shadow;
			float shadowBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];

		#endif

		vec4 firstColor = vec4(1,0,0,1);
		vec4 middleColor = vec4(1,1,0,1);
		vec4 secondColor = vec4(0,1,0.4,1);

		void main()
		{

				vec4 col;

				if(vUv.x >= 0.0)
				col = (firstColor);

				if(vUv.x <= 0.3 && vUv.x <= 0.3)
				col = (middleColor);

				if(vUv.x <= 0.6 && vUv.x > 0.3)
				col = (secondColor);


			vec4 ditherCol = vec4(dither(col.rgb), 1.0);

			vec3 lightDirection = normalize(directionalLights[0].direction - vWorldPosition);

			vec3 sumDirLights = clamp( dot( directionalLights[0].direction, 
			vecNormal ), 0.0, 1.0 ) * directionalLights[0].color  * 1.0;

			float shadowValue = getShadow(directionalShadowMap[ 0 ], directionalLights[0].shadowMapSize, 
			directionalLights[0].shadowBias, directionalLights[0].shadowRadius, vDirectionalShadowCoord[0] );

			vec4 ditherShadow =  vec4(dither(vec3(shadowValue, shadowValue, shadowValue)), 1.0);
			vec4 ditherLight =  vec4(dither(sumDirLights), 1.0);

			vec3 finalCol = col.rgb * ditherShadow.rgb;

			gl_FragColor =  vec4(finalCol, 1.0) * vec4(color.r, color.g, color.b, 1.0);
		}