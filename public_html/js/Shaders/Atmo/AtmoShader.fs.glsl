
varying float angleIncidence; 
varying vec4 col;

varying vec2 vUv;
varying vec3 vecNormal;

varying vec3 lightdir;
varying vec3 eyenorm;
uniform vec3 lightpos;
uniform float atmoThickness;
uniform vec3 colorlight;
uniform vec3 colordark; 
//Refer the Text Parse in Main.js, replaced this Sexy Text with Dither Methods,
//I just didnt want it cluttering shizz up
AddDither

void main() 
{
    
    float ndotl = normalize(dot(normalize (vecNormal), normalize (lightdir)));

    vec4 finalCol = col * atmoThickness / 1.5;
	
	vec4 mainAtmoColor = vec4(colorlight.r/255.0,colorlight.g/255.0,
	 colorlight.b/255.0, 1.0);
	
	vec4 NoonStartColor = vec4(1.0,
						 201.0/255.0, 
						 73.0/255.0, 1.0);


	vec4 NoonFinalColor = vec4(204.0/255.0,
						        78.0/255.0, 
						        116.0/255.0, 1.0);


	float clampedVal = clamp(angleIncidence, 0.0 , 1.0);
	
	float scaler01 = smoothstep(0.2, 1.0, clampedVal);
	float scaler02 = smoothstep(0.2, 1.0, clampedVal);
	float scaler03 = smoothstep(0.3, 1.0, clampedVal);

	vec4 lerpTColor = mix(mainAtmoColor, NoonStartColor, scaler01);
	vec4 lerpMColor = mix(lerpTColor, NoonFinalColor, scaler02);

    vec4 ditherresult = vec4(dither(finalCol.rgb), finalCol.a) * lerpMColor;

    gl_FragColor = ditherresult; 
}
