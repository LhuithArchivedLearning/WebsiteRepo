
//Credit to davidr : https://lightshaderdevlog.wordpress.com/source-code/-->

varying float angleIncidence; 
varying vec4 col;
uniform float fresnelExp;
uniform float transitionWidth; //? Da fleq?

const float PI = 3.14159265359;

varying vec2 vUv;

varying vec3 lightdir;
varying vec3 eyenorm;
varying vec3 vecNormal;
uniform vec3 lightpos;
uniform vec4 skycolor;

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


void main() 
{

   vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
   vec3 vWorldPosition = worldPosition.xyz;
    vec4 eyepos = modelViewMatrix * vec4 (position, 1.0);
    vec4 lighteye = viewMatrix * vec4 (lightpos, 1.0);
	vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
  
    lightdir = lighteye.xyz - eyepos.xyz;
    eyenorm = normalMatrix * normal;

    float ndotl = normalize(dot(normalize (eyenorm), normalize (lightdir)));
    vec3 normalDirection = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vUv = uv;

    vec3 lightDirection = normalize(directionalLights[0].direction);

   vec3 viewDirection = normalize(cameraPosition.xyz - vWorldPosition);

   angleIncidence = acos(dot(lightDirection, normalDirection)) / PI;

   float shadeFactor = 0.1 * (1.0 - angleIncidence) + 0.9 * 
    (1.0 - (clamp(angleIncidence, 0.5, 0.5 + transitionWidth) - 0.5) 
    / transitionWidth);

   float angleToViewer = sin(acos(dot(normalDirection, viewDirection)));

   float perspectiveFactor = 0.3 + 0.2 * pow((angleToViewer), fresnelExp)
     + 0.5 * pow((angleToViewer), fresnelExp * 20.0);

    col = vec4(1.0, 1.0, 1.0, 1.0) * perspectiveFactor * shadeFactor;
 
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
}