var DitherPattern = [0,  32, 8,  40, 2,  34, 10, 42,
                     48, 16, 56, 24, 50, 18, 58, 26,
                     12, 44, 4,  36, 14, 46, 6,  38,
                     60, 28, 52, 20, 62, 30, 54, 22,
                     3,  35, 11, 43, 1,  33, 9,  41,
                     51, 19, 59, 27, 49, 17, 57, 25,
                     15, 47, 7,  39, 13, 45, 5,  37,
                     63, 31, 55, 23, 61, 29, 53, 21];

//This is giving Wierd Results at times so will need to test or change later
var GrayScalePallete = [new THREE.Vector3( 0.0, 0.0, 0.0 ),
                        new THREE.Vector3( .14, .14, .14 ),
                        new THREE.Vector3( .28, .28, .28 ),
                        new THREE.Vector3( .43, .43, .43 ),
                        new THREE.Vector3( .57, .57, .57 ),
                        new THREE.Vector3( .71, .71, .71 ),
                        new THREE.Vector3( .85, .85, .85 ),
                        new THREE.Vector3( .99, .99, .99)];