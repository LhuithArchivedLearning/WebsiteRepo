
varying float angleIncidence; 
varying vec4 col;

uniform sampler2D Gradient;
varying vec2 vUv;
varying vec3 vecNormal;

varying vec3 lightdir;
varying vec3 eyenorm;
uniform vec3 lightpos;
uniform float atmoThickness;


//Refer the Text Parse in Main.js, replaced this Sexy Text with Dither Methods,
//I just didnt want it cluttering shizz up
AddDither

void main() 
{
    
    float ndotl = normalize(dot(normalize (vecNormal), normalize (lightdir)));

    vec2 gradientLevel = vec2(angleIncidence, 0.0);
    vec4 finalCol = (col) * atmoThickness;
	
	vec4 dayColor = vec4(0, 0.490, 1, 1.0);
	vec4 NoonColor =vec4(0.980, 0.411, 0, 1.0);
	vec4 midColor = vec4(0.854, 0.941, 0.941, 1.0);

	float test = clamp(angleIncidence, 0.0, 1.0);

	float scaler01 = smoothstep(0.0,1.0,test);
	float scaler02 = smoothstep(0.2,1.0,test);

	vec4 lerpTColor = mix(dayColor, NoonColor, scaler01);
	vec4 lerpMColor = mix(lerpTColor, NoonColor, scaler02);

	vec4 tex = texture2D(Gradient, gradientLevel);

    vec4 ditherresult = vec4(dither(finalCol.rgb), finalCol.a) 
	* lerpMColor;
    gl_FragColor = vec4(ditherresult); 
}
