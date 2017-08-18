   
	var container, stats, resolution, map;
    var camera, scene, renderer, clock, planet, moon;
    var moonList;
    var inPlanet, gui;
    var planetSize, outline, selected, planetText;
    var lightpos, dirLight, angle;
    var x,y,z, controls, square, lineUI, PlanetMaterial;
    var   textlabels = new Array();
    // Custom global variables
    var mouse = {x: 0, y: 0};

    var octaves; 
    var persistance; 
    var lacunarity; 
    var seed = 1;
    var noiseScale; 
    var offset = {x:0, y:0};
    var textureSize = 256;
    var mouseDown = false;
    var boxsize = 25;

    var firstLetter = "UYEEOOOOOOOIIIIIIIIAAAAAAAAAAAAKJVRRGGNNPPDDDLLLCCCCFFFFMMMMMBBBBBWWWWWWWHHHHHHHHSSSSSSSSTTTTTTTTTTTTTTTTT"; // Most words(17%) start with T. Few start with K. Multiples of the same letter increases the odds of being chosen. 
    var cDiagraphs = "thhereedndhantledertvetito"; // letter pairs
    var vDiagraphs = "anineronatenesofeaioisouaras"; // letter pairs
    var endL = "estdnryfloghakmpuw";
    var cons = "ttttttttttnnnnnnnnsssssshhhhhhrrrrrdddddllllcccmmmwfffggyppbbvkjxz";
    var vowel = "eeeeeeeeeeeeeeaaaaaaaaooooooooiiiiiiiuuuy"; // Y is sometimes a vowel
                
	init();
    animate();
    
    //Credit : https://codepen.io/brandonisgreen/pen/Khibx?editors=0010
    function word(len)
  {
				var theword = "";
				while(theword.length < (len)){ // word length
            if (theword.length === 0){ 
              var fLetterPos = (Math.random())*vowel.length;
                theword = theword + firstLetter.substr(fLetterPos,1);
              if (fLetterPos > 31){
                theword = theword+vowel.substr((Math.random())*vowel.length,1);
              }
            }//end first letter
            // Get a diagraph
            var llet = theword.substr(theword.length-1,1);
            // if word is good 'as-is'
            if(theword.length > 4){
            if ( goodEnd(llet) == true){
                  theword = theword+endL.substr((Math.random())*endL.length,1);//extra spaces to stop the loop(which goes by word length)
                  
                  break;
            }
            }
            var getDG = Math.floor(Math.random()*20);
            var newRan = Math.floor(Math.random()*5);
            // Use diagraph if vowel
            if (getDG > 15){
                //get last letter
                var llet = theword.substr(theword.length-1,1);
                if (isVowel(llet) == true){
                  theword = theword + cDiagraphs.substr(Math.floor(Math.random() * (cDiagraphs.length /2))*2, 2);
                }
              // roll a dice for diagraphs first letter (vowel vs const)
              var d3 = Math.floor(Math.random() * 3);
              if (d3 == 1){
                theword = theword + cDiagraphs.substr(Math.floor(Math.random() * (cDiagraphs.length /2))*2, 2);
              }
              else{
                theword = theword + vDiagraphs.substr(Math.floor(Math.random() * (vDiagraphs.length /2))*2, 2);
              }
            }
            if(newRan < 1){ // odds of vowel
                
                theword = theword+vowel.substr((Math.random())*vowel.length,1);
              } else {
					
					theword = theword +cons.substr((Math.random())*cons.length,1);
             }
				}
        
				return theword;
        }
  
function goodEnd (letter)
 {
    var chars = ["e", "s", "t", "d", "n", "r", "y", "f", "l", "o", "g", "h", "a", "k", "m", "p", "u", "w"];
    for(var i = 0; i < chars.length; i++){
        if(letter === chars[i]){
            return true;
         }
    }
    return false;
};

function isVowel (letter) {
    var vowels = ["a","e","i","o","u"];
    for(var i = 0; i < vowels.length; i++){
        if(letter === vowels[i]){
            return true;
         }
    }
    return false;
};

    function init()
    {    
        CalculateParametres();

        resolution = 3;
        clock = new THREE.Clock();


        var map = new MapGenerator(octaves, persistance, lacunarity, 
            seed, noiseScale, offset, textureSize);

        const dataTexture = new THREE.DataTexture
        (
        Uint8Array.from(map),
        textureSize,
        textureSize,
        THREE.RGBFormat,
        THREE.UnsignedByteType,
        );

        dataTexture.needsUpdate = true;

        const dataMaterial = new THREE.MeshBasicMaterial({
        transparent: false,
        map: dataTexture
        });
        dataMaterial.needsUpdate = true;

        container = document.getElementById( 'webGL-container' );
        document.body.appendChild( container );

        var width = window.innerWidth;
        var height = window.innerHeight;
                
        //Creates empty scene object and renderers

        camera = new THREE.OrthographicCamera( width / - 2, width / 2, 
                                height / 2, height / - 2, - 500, 1000 );
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 200;

        scene = new THREE.Scene();
        
        dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(50, 25, 50);
        dirLight.castShadow = true;
        scene.add(dirLight);

        createPlanet(true);

        var square = new THREE.Geometry();
        square.vertices.push(new THREE.Vector3(0, 0, 0));
        square.vertices.push(new THREE.Vector3(0, boxsize, 0));
        square.vertices.push(new THREE.Vector3(boxsize, boxsize, 0));
        square.vertices.push(new THREE.Vector3(boxsize, 0, 0));

        square.vertices.push(new THREE.Vector3(0, 0, 0));

        square.faces.push(new THREE.Face3(0, 1, 2));
        square.faces.push(new THREE.Face3(0, 3, 2));

        lineUI = new THREE.Line(square, new THREE.LineDashedMaterial({
	    color: 0xfff000,
	    dashSize: 2,
	    gapSize: 5,
	    linewidth: 1
      }));

        lineUI.position.set(250,-200,0);
        scene.add(lineUI);

        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( window.innerWidth / resolution, window.innerHeight / resolution );
        renderer.setClearColor( 0x000000, 1);
        renderer.domElement.id = "Poo Poo";


        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        renderer.shadowCameraNear = 3;
        renderer.shadowCameraFar = camera.far;
        renderer.shadowCameraFov = 50;

        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.5;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;


        container.appendChild( renderer.domElement );               
        
        renderer.domElement.style.width = renderer.domElement.width * resolution + 'px';
        renderer.domElement.style.height = renderer.domElement.height * resolution + 'px';

        //Add Controls
        //controls = new THREE.OrbitControls(camera, renderer.domElement);
        //controls.minZoom = 0.5;
       // controls.maxZoom = 1.5;

        //controls.addEventListener("change", render);
        var gridHelper = new THREE.GridHelper( 1000, 20 );
        //scene.add( gridHelper );
        
        var axisHelper = new THREE.AxisHelper( 5 );
        //scene.add( axisHelper )

         moonAxis = new THREE.Vector3(0,1,0);//tilted a bit on x and y
    
        // When the mouse moves, call the given function
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mousedown', MouseDown, true);
        document.addEventListener('mouseup', function (e) {
        onMouseUp(e);
    }, false);

        window.addEventListener("resize", onWindowResize, false);

        
        controls = new function() 
        {
        this.xPos = 0;
        this.yPos = 0;
        this.zPos = 0;

        this.xRot = 0;
        this.yRot = 0;
        this.zRot = 0;

        }

        gui = new dat.GUI();
        gui.add(controls, 'xPos', -200, 200);
        gui.add(controls, 'yPos', -200, 200);
        gui.add(controls, 'zPos', -200, 200);

        gui.add(controls, 'xRot', -1, 1);
        gui.add(controls, 'yRot', -1, 1);
        gui.add(controls, 'zRot', -1, 1);

        dat.GUI.toggleHide();

         var geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);

        for (var i = 0; i < 5; i++) 
    {
        var material = new THREE.MeshBasicMaterial({
          color: 0xffffff
        });

        var object = new THREE.Object3D();
        object.position.x = (Math.random() - 0.5) * 1000;
        object.position.y = (Math.random() - 0.5) * 1000;
        object.position.z = (Math.random() - 0.5) * 1000;
        object.updateMatrix();
        object.matrixAutoUpdate = false;
        scene.add(object);
    }

    }

    https://codepen.io/brandonisgreen/pen/Khibx


    function createTextLabel() 
    {

    var div = document.createElement('div');
    div.className = 'text-label';
    div.style.position = 'absolute';
    div.style.width = 100;
    div.style.color = "#ffffff";
    div.style.height = 100;
    div.innerHTML = "hi there!";
    div.style.top = -1000;
    div.style.left = -1000;
    div.style.fontSize = "50px";
    var _this = this;
    
    return {
      element: div,
      parent: false,
      position: new THREE.Vector3(0,0,0),
      setHTML: function(html)
       {
        this.element.innerHTML = html;
      },
      setParent: function(threejsobj) {
        this.parent = threejsobj;
      },
      updatePosition: function(size, isPlanet) {
        if(parent) 
        {
            if(isPlanet)
                {
           this.position.x = this.parent.position.x - this.element.clientWidth/2;
           this.position.y = this.parent.position.y + size + 55;
                }
        else
            {
            this.position.x = this.parent.position.x;
           this.position.y = this.parent.position.y + size + 25;  
            }
        
          //this.position.copy(this.parent.position);
        }       
        var coords2d = this.get2DCoords(this.position, _this.camera);
        this.element.style.left = coords2d.x + 'px';
        this.element.style.top = coords2d.y + 'px';
      },
      get2DCoords: function(position, camera) {
        var vector = position.project(camera);
        vector.x = (vector.x + 1)/2 * window.innerWidth;
        vector.y = -(vector.y - 1)/2 * window.innerHeight;
        return vector;
      }
    };
  }

    function onWindowResize()
    {	
        // notify the renderer of the size change
        // update the camera
        camera.left =   window.innerWidth / - 2;
        camera.right =  window.innerWidth /   2;
        camera.top =    window.innerHeight /  2;
        camera.bottom = window.innerHeight / - 2;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth / resolution, window.innerHeight / resolution );

        renderer.domElement.style.width = renderer.domElement.width * resolution + 'px';
        renderer.domElement.style.height = renderer.domElement.height * resolution + 'px';
    }
			
    function animate()
    {
         angle += 0.01;
        dirLight.position.set (550, 475, 650);
        PlanetMaterial.uniforms.lightpos.value.copy (dirLight.position);
        if (inPlanet) 
        {
        $('html,body').css('cursor', 'pointer');
        }
        else
        {
        $('html,body').css('cursor', 'default');
        }
        requestAnimationFrame(animate);

        var delta = clock.getDelta(); 
        var curtime;
        curtime += delta;

        planet.rotation.y += 0.002;

        //ShowHideOutline();

        var axis = new THREE.Vector3(0.5,0.5,0);

        input();
        planetText.updatePosition(planetSize, true);

        if(moonList.length != 0)
        {
            for(var i = 0; i < moonList.length; i++)
            {
              moonList[i].text.updatePosition(moonList[i].moonSize);
              orbit(moonList[i], moonList[i].moonObject, 
                planet, clock.getElapsedTime() * moonList[i].orbitSpeedMult, 
                1000, delta/12);
               ShowHideOrbitPath(moonList[i], moonList[i].moonOrbit);             
            }
        }
            
        render();
    }

    function ShowHideOutline()
    {  
         if (inPlanet) 
        {
        outline.traverse ( function (child) 
        {
        if (child instanceof THREE.Line) 
            {
            child.visible = true;
            }
        });
        }
        else
        {
            outline.traverse ( function (child)
            {
            if (child instanceof THREE.Line) 
            {
            child.visible = false;
            }
        });
        }
    }

    function ShowHideOrbitPath(moon, orbit)
    {  
            if (moon.selected) 
            {
                moon.text.element.style.visibility = "visible";  

            orbit.traverse ( function (child) {
        if (child instanceof THREE.Line) 
            {
            child.visible = true;
            }
        });

            }
            else
            {
            moon.text.element.style.visibility = "hidden"; 

            orbit.traverse ( function (child)
            {
            if (child instanceof THREE.Line) 
            {
            child.visible = false;
            }
        });

            }
    }

    function input()
    {
        //MouseInPlanet(planet.position, planetSize);
        MouseInSquare();
        for(var i = 0; i < moonList.length; i++)
        {
            MouseInMoon(moonList[i].moonObject, moonList[i].moonSize + 5, moonList[i]);
        }
    }
    //Credit to https://doc.qt.io/qt-5/qtcanvas3d-threejs-planets-planets-js.html
    //very smexy!
    function orbit(planet, object, centre, currTimeD, auScale , deltaTimeD)
    {
        // Calculate the planet orbital elements from the current time in days
        var N =  (planet["N1"] + planet["N2"] * currTimeD) * Math.PI / 180;
        var iPlanet = (planet["i1"] + planet["i2"] * currTimeD) * Math.PI / 180;
        var w =  (planet["w1"] + planet["w2"] * currTimeD) * Math.PI / 180;
        var a = planet["a1"] + planet["a2"] * currTimeD;
        var e = planet["e1"] + planet["e2"] * currTimeD;
        var M = (planet["M1"] + planet["M2"] * currTimeD) * Math.PI / 180;
        var E = M + e * Math.sin(M) * (1.0 + e * Math.cos(M));

        var xv = a * (Math.cos(E) - e);
        var yv = a * (Math.sqrt(1.0 - e * e) * Math.sin(E));
        var v = Math.atan2(yv, xv);

        // Calculate the distance (radius)
        var r = Math.sqrt(xv * xv + yv * yv);

        // From http://www.davidcolarusso.com/astro/
        // Modified to compensate for the right handed coordinate system of OpenGL
        var xh = r * (Math.cos(N) * Math.cos(v + w)
                      - Math.sin(N) * Math.sin(v + w) * Math.cos(iPlanet));
        var zh = -r * (Math.sin(N) * Math.cos(v + w)
                       + Math.cos(N) * Math.sin(v + w) * Math.cos(iPlanet));
        var yh = r * (Math.sin(w + v) * Math.sin(iPlanet));

        // Apply the position offset from the center of orbit to the bodies
        var centerOfOrbit = centre;//objects[planet["centerOfOrbit"]];
        object.position.set(centerOfOrbit.position.x + xh * auScale,
                            centerOfOrbit.position.y + yh * auScale,
                            centerOfOrbit.position.z + zh * auScale);

        // Calculate and apply the appropriate axis tilt to the bodies
        // and rotate them around the axis
        var radians = planet["tilt"] * Math.PI / 180; // tilt in radians
        object.rotation.order = 'ZXY';
        object.rotation.x = 0;
        object.rotation.y += (deltaTimeD / planet["period"]) * 2 * Math.PI;
        object.rotation.z = radians;
    }

    function render()
    {
         renderer.render( scene, camera );
    }

    function MouseInPlanet(object, rad)
    {
        //Setting Object to screen position

        var vector = new THREE.Vector2();

       vector.x = object.x;
       vector.y = object.y;

        vector.x = Math.round(  vector.x + window.innerWidth  / 2 );
        vector.y = Math.round(  vector.y + window.innerHeight / 2 );

        if(circlePointCollision(mouse.x, mouse.y, new THREE.Vector2(vector.x, vector.y), rad))
        {     
           inPlanet = true;
        }
        else
        {
           inPlanet = false;
        }
    }

    function MouseInSquare()
    {
        //Setting Object to screen position

        var vector = new THREE.Vector2();

        vector = toScreenPosition(lineUI, camera);

       vector.x = lineUI.position.x;
       vector.y = -lineUI.position.y;

        vector.x = Math.round(  vector.x + window.innerWidth  / 2 );
        vector.y = Math.round(  vector.y + window.innerHeight / 2 );
        
        var p0 = {x: vector.x + lineUI.geometry.vertices[0].x,
                  y: vector.y + lineUI.geometry.vertices[0].y - boxsize}

 
        var p1 = {x: vector.x + lineUI.geometry.vertices[2].x,
                  y: vector.y + lineUI.geometry.vertices[2].y - boxsize}

        if(pointInRect(mouse.x, mouse.y, p0, 
                                         p1))
        {     
           inPlanet = true;
        }
        else
        {
           inPlanet = false;
        }
    }
    
    function MouseInMoon(moon, rad, data)
    {
        var vector = new THREE.Vector2();
   
       vector = toScreenPosition(moon, camera);

        if(circlePointCollision(mouse.x, mouse.y, new THREE.Vector2(vector.x, vector.y), rad))
        {
           if(mouseDown)
           data.selected = true;
           data.inMoon = true;
        }
        else
        {
            if(mouseDown)
            data.selected = false;

           data.inMoon = false;
        }
    }

    function toScreenPosition(obj, camera)
    {
        var vector = new THREE.Vector3();

        var widthHalf = window.innerWidth  / 2;
        var heightHalf = window.innerHeight / 2;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;
        return { 
            x: vector.x,
            y: vector.y
        };

    };

    // Follows the mouse event
    function onMouseMove(event) 
    {
        // Update the mouse variable
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        mouse.x = Math.round( (   mouse.x + 1 ) * window.innerWidth  / 2 );
        mouse.y = Math.round( ( - mouse.y + 1 ) * window.innerHeight / 2 );
        
    };       

      function onMouseUp(evt)
    {
        evt.preventDefault();

        mouseDown = false;
    }

    function MouseDown (event)
     {
        event.preventDefault();   
                  
        if (inPlanet) 
        {
            switch ( event.button ) 
            {
            case 0: // left
                createPlanet(false);
                break;
            case 1: // middle
                break;
            case 2: // right
                break;
            }
        }
  
        mouseDown = true;

    };

    function replaceThreeChunkFn(a, b) {
    return THREE.ShaderChunk[b] + '\n';
}

function shaderParse(glsl) {
    return glsl.replace(/\/\/\s?chunk\(\s?(\w+)\s?\);/g, replaceThreeChunkFn);
}

    function CalculateParametres()
    {
        persistance = randomRange(0.65, 0.85);
        lacunarity = randomRange(1.9, 2.2);
        octaves = Math.round(randomRange(4,6));
        noiseScale = randomRange(10, 200);
        planetSize = randomRange(40, 125);
        moonList = new Array(Math.round(randomRange(1, 4)));     

    // Planet Data
    // radius - planet radius in millions of meters
    // tilt - planet axis angle
    // N1 N2 - longitude of the ascending node
    // i1 i2 - inclination to the ecliptic (plane of the Earth's orbit)
    // w1 w2 - argument of perihelion
    // a1 a2 - semi-major axis, or mean distance from Sun
    // e1 e2 - eccentricity (0=circle, 0-1=ellipse, 1=parabola)
    // M1 M2 - mean anomaly (0 at perihelion; increases uniformly with time)
    // period - sidereal rotation period
    // centerOfOrbit - the planet in the center of the orbit
    // (orbital elements based on http://www.stjarnhimlen.se/comp/ppcomp.html)
    //Creates empty scene object and renderers
    //i1: 115.1454

     for(var i = 0; i < moonList.length; i++)
        {

        var roll = randomRange(0,10);
        
        var mat;
        size =  randomRange(5, Math.round(planetSize/3));

        if(roll > 2.2)
            {
                var map = new MapGenerator(octaves, persistance, lacunarity, 
                seed, 128, offset, 24);

                const dataTexture = new THREE.DataTexture
                (
                Uint8Array.from(map),
                24,
                24,
                THREE.RGBFormat,
                THREE.UnsignedByteType,
                );

                dataTexture.needsUpdate = true;
                

                var uniforms = {
             indexMatrix4x4:{ type: "fv1" , value: [0,  32, 8,  40, 2,  34, 10, 42,
                                     48, 16, 56, 24, 50, 18, 58, 26,
                                     12, 44, 4,  36, 14, 46, 6,  38,
                                     60, 28, 52, 20, 62, 30, 54, 22,
                                     3,  35, 11, 43, 1,  33, 9,  41,
                                     51, 19, 59, 27, 49, 17, 57, 25,
                                     15, 47, 7,  39, 13, 45, 5,  37,
                                     63, 31, 55, 23, 61, 29, 53, 21]},

                palette:{type:"v3v", value:[new THREE.Vector3( 0.0, 0.0, 0.0 ),
                                            new THREE.Vector3( .14, .14, .14 ),
                                            new THREE.Vector3( .28, .28, .28 ),
                                            new THREE.Vector3( .43, .43, .43 ),
                                            new THREE.Vector3( .57, .57, .57 ),
                                            new THREE.Vector3( .71, .71, .71 ),
                                            new THREE.Vector3( .85, .85, .85 ),
                                            new THREE.Vector3( .9, .9, .9)]},
                paletteSize:{type:"i", value:8},
               texture: { type: "t", value: dataTexture },
               lightpos: {type: 'v3', value: new THREE.Vector3(0,30,20) },
                  noTexture:{type:"i", value:0}
        };

         moonMaterial = new THREE.ShaderMaterial({
             uniforms: uniforms,
            vertexShader: $("#vertexshader").text(),
            fragmentShader: $("#fragmentshader").text()
        });

                const dataMaterial = new THREE.MeshBasicMaterial({
                transparent: false,
                map: dataTexture
                });
                dataMaterial.needsUpdate = true;
                mat = moonMaterial;
            }
            else
            { 

                  var uniforms = {
             indexMatrix4x4:{ type: "fv1" , value: [0,  32, 8,  40, 2,  34, 10, 42,
                                     48, 16, 56, 24, 50, 18, 58, 26,
                                     12, 44, 4,  36, 14, 46, 6,  38,
                                     60, 28, 52, 20, 62, 30, 54, 22,
                                     3,  35, 11, 43, 1,  33, 9,  41,
                                     51, 19, 59, 27, 49, 17, 57, 25,
                                     15, 47, 7,  39, 13, 45, 5,  37,
                                     63, 31, 55, 23, 61, 29, 53, 21]},

                palette:{type:"v3v", value:[new THREE.Vector3( 0.0, 0.0, 0.0 ),
                                            new THREE.Vector3( .14, .14, .14 ),
                                            new THREE.Vector3( .28, .28, .28 ),
                                            new THREE.Vector3( .43, .43, .43 ),
                                            new THREE.Vector3( .57, .57, .57 ),
                                            new THREE.Vector3( .71, .71, .71 ),
                                            new THREE.Vector3( .85, .85, .85 ),
                                            new THREE.Vector3( .9, .9, .9)]},
                paletteSize:{type:"i", value:8},
               texture: { type: "t", value: null },
               lightpos: {type: 'v3', value: new THREE.Vector3(0,30,20) },
               noTexture:{type:"i", value:1}
        };

         moonMaterial = new THREE.ShaderMaterial({
             uniforms: uniforms,
            vertexShader: $("#vertexshader").text(),
            fragmentShader: $("#fragmentshader").text()
        });

                mat = moonMaterial;
            }

            moonList[i] = 
            {
                radius: 1.5424, tilt: 0, N1: 125.1228, N2: 0,
                i1: randomRange(0,360), i2: 0, w1: 318.0634, w2: 0.1643573223,
                a1: randomRange(planetSize/1000 + .02, 0.32), a2: 0, e1: 0, e2: 0,
                M1: 115.3654, M2: 13.0649929509, period: 1, moonSize :  size,
                moonObject : createMoon(size, mat),
                moonOrbit : 0, orbitSpeedMult : randomRange(-2, 2), inMoon : false, text : false 
            }
        }

    }

    function createPlanet(init)
    {
        if(!init)
        {
            scene.remove(planet);
            scene.remove(moon);
            scene.remove(outline);
            scene.remove(moonorbit);
            planetText.element.remove();
           
        for(var i = 0; i < moonList.length; i++)
        {   
            moonList[i].text.element.remove();
            scene.remove(moonList[i].moonObject);
            scene.remove(moonList[i].moonOrbit);
        }
            CalculateParametres();
        }

        var segmentCount = 32,
        radius = planetSize + 1,
        geometry = new THREE.Geometry(),
        material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });


        //for (var i = 0; i < segmentCount; i++) 
        //{
        //    var theta = (i / segmentCount) * Math.PI * 4;
        //    geometry.vertices.push(
        //    new THREE.Vector3(
        //    Math.cos(theta) * radius,
        //    Math.sin(theta) * radius, 0));            
        //}
//
        //outline = new THREE.Line(geometry, material);
        //outline.position.z = camera.position.z - 5;
        //
        //if(!scene.getObjectByName('outline')) scene.add(outline);
        //outline.parent = camera;
        
        var map = new MapGenerator(octaves, persistance, lacunarity, 
            seed, noiseScale, offset, textureSize);

        var dataTexture = new THREE.DataTexture
        (
        Uint8Array.from(map),
        textureSize,
        textureSize,
        THREE.RGBFormat,
        THREE.UnsignedByteType,
        );

        dataTexture.needsUpdate = true;
        
        var uniforms = {
             indexMatrix4x4:{ type: "fv1" , value: [0,  32, 8,  40, 2,  34, 10, 42,
                                     48, 16, 56, 24, 50, 18, 58, 26,
                                     12, 44, 4,  36, 14, 46, 6,  38,
                                     60, 28, 52, 20, 62, 30, 54, 22,
                                     3,  35, 11, 43, 1,  33, 9,  41,
                                     51, 19, 59, 27, 49, 17, 57, 25,
                                     15, 47, 7,  39, 13, 45, 5,  37,
                                     63, 31, 55, 23, 61, 29, 53, 21]},

                palette:{type:"v3v", value:[new THREE.Vector3( 0.0, 0.0, 0.0 ),
                                            new THREE.Vector3( .14, .14, .14 ),
                                            new THREE.Vector3( .28, .28, .28 ),
                                            new THREE.Vector3( .43, .43, .43 ),
                                            new THREE.Vector3( .57, .57, .57 ),
                                            new THREE.Vector3( .71, .71, .71 ),
                                            new THREE.Vector3( .85, .85, .85 ),
                                            new THREE.Vector3( .9, .9, .9)]},
                paletteSize:{type:"i", value:8},
               texture: { type: "t", value: dataTexture },
               lightpos: {type: 'v3', value: new THREE.Vector3(0,30,20) },
                  noTexture:{type:"i", value:0}
        };

         PlanetMaterial = new THREE.ShaderMaterial({
             uniforms: uniforms,
            vertexShader: $("#vertexshader").text(),
            fragmentShader: $("#fragmentshader").text()
        });

        // instantiate a loader
        var loader = new THREE.TextureLoader();

        loader.crossOrigin = '';

        var geometry = new THREE.SphereGeometry(planetSize, 32, 32 );
        planet = new THREE.Mesh( geometry, PlanetMaterial );

        planet.castShadow = true; //default is false
        planet.receiveShadow = true; //default

        scene.add(planet);
        
        var roll = randomRange(0,10);
            
        planetText = createTextLabel();
        if(roll > 5)
        planetText.setHTML(word(randomRange(5, 10)));
        else
        planetText.setHTML(word(randomRange(4, 12))+ "-" + Math.round(randomRange(0,1000)));

        planetText.setParent(planet);
        container.appendChild(planetText.element);

       for(var i = 0; i < moonList.length; i++)
           {

            orbit(moonList[i], moonList[i].moonObject, planet, randomRange(0,10000), 1000,  randomRange(0,10000));
            moonList[i].moonOrbit = DrawOrbit(moonList[i], moon, planet, clock.getElapsedTime(), 1000);
            scene.add(moonList[i].moonObject);

            if(moonList[i].moonOrbit != 0)
            scene.add(moonList[i].moonOrbit);

            var roll = randomRange(0,10);
            
            moonList[i].text = createTextLabel();
            if(roll > 5)
            moonList[i].text.setHTML(word(randomRange(4, 12))+ "-" + Math.round(randomRange(0,1000)));
            else
            moonList[i].text.setHTML(word(randomRange(4, 12))); 

            moonList[i].text.setParent(moonList[i].moonObject);
            container.appendChild(  moonList[i].text.element);

           }   
    }

    function createMoon(moonSize, mat)
    {         
        var moon = new THREE.Mesh( new THREE.SphereGeometry(moonSize, 12, Math.PI * 2 ), mat );
        
        moon.castShadow = true; //default is false
        moon.receiveShadow = true; //default
        return moon;
    }

    function anim()
    {
       
       //// a texture with 10 frames arranged horizontally, display each for 75 millisec
       //anim = new TextureAnimator( gene , 21, 1, 21, 65); 
       //gene.magFilter = THREE.NearestFilter;
       //gene.minFilter = THREE.NearestFilter;
       //var spriteMaterial = new THREE.SpriteMaterial( { map: gene} );	
       //var Genesprite = new THREE.Sprite( spriteMaterial );

       //Genesprite.scale.set(10, 10, 10);
       //
       //scene.add( Genesprite );	
       //Genesprite.lookAt(scene.position);
    }

    function DrawOrbit(planet, object, centre, currTimeD, auScale)
    {
        var segmentCount = 36;
        var radius = planetSize;
        var lines = new THREE.Geometry();

        for (var i = 0; i < segmentCount; i++) 
        {              
        // Calculate the planet orbital elements from the current time in days
        var N =  (planet["N1"] + planet["N2"] * i) * Math.PI / 180;
        var iPlanet = (planet["i1"] + planet["i2"] * i) * Math.PI / 180;
        var w =  (planet["w1"] + planet["w2"] * i) * Math.PI / 180;
        var a = planet["a1"] + planet["a2"] * i;
        var e = planet["e1"] + planet["e2"] * i;
        var M = (planet["M1"] + planet["M2"] * i) * Math.PI / 180;
        var E = M + e * Math.sin(M) * (1.0 + e * Math.cos(M));

        var xv = a * (Math.cos(E) - e);
        var yv = a * (Math.sqrt(1.0 - e * e) * Math.sin(E));
        var v = Math.atan2(yv, xv);

        // Calculate the distance (radius)
        var r = Math.sqrt(xv * xv + yv * yv);

        // From http://www.davidcolarusso.com/astro/
        // Modified to compensate for the right handed coordinate system of OpenGL
        var xh = r * (Math.cos(N) * Math.cos(v + w)
                      - Math.sin(N) * Math.sin(v + w) * Math.cos(iPlanet));
        var zh = -r * (Math.sin(N) * Math.cos(v + w)
                       + Math.cos(N) * Math.sin(v + w) * Math.cos(iPlanet));
        var yh = r * (Math.sin(w + v) * Math.sin(iPlanet));

        // Apply the position offset from the center of orbit to the bodies
        var centerOfOrbit = centre;//objects[planet["centerOfOrbit"]];

            lines.vertices.push(
            new THREE.Vector3(
            centerOfOrbit.position.x + xh * auScale,
            centerOfOrbit.position.y + yh * auScale,
            centerOfOrbit.position.z + zh * auScale));            
        }


        lines.computeLineDistances();
        moonorbit = new THREE.Line(lines, new THREE.LineDashedMaterial({
	    color: 0xffffff,
	    dashSize: 100,
	    gapSize: 100,
	    linewidth: 1
      }));
      
      return moonorbit;
    }