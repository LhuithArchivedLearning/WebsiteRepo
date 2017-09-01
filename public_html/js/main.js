   
	var container, stats, resolution, map, controls, lineUI, gui;
    var camera, MainScene, BackgroundScene, renderer, clock, composer;
    var lightpos, dirLight, angle;

    // Custom global variables
    var mouse = {x: 0, y: 0};
    var resolution = 3;
    var octaves; 
    var persistance; 
    var lacunarity; 
    var seed = 1;
    var noiseScale; 
    var offset = {x:0, y:0};
    var textureSize = 256;
    var mouseDown = false;
    var boxsize = 25;
    var planetSize, planetData, inPlanet, planet, planetText, atmoMaterial, planetTilt, hasRings, 
    PlanetMaterial, moonList, ringsList, outline, atmo, clouds, planetGeo, planetRotationPeriod;
    var ShaderDataInfo = {vs:'', fs : ''};
    var skyboxuniforms;

    var startTime = Date.now();
    
    init();
    animate();

    //Yummy Yum Yum
    function textParse(glsl, shadow_text, dither_text) 
    { 
        var text = glsl.replace("AddShadow", shadow_text);
        text = text.replace("AddDither", dither_text);

        return text;
    }

    function init()
    {    
        MainScene = new THREE.Scene();
        BackgroundScene = new THREE.Scene();

        camera = new THREE.OrthographicCamera(  window.innerWidth / - 2,  window.innerWidth / 2, 
                                                window.innerHeight /  2,  window.innerHeight / - 2, - 500, 1000 );
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 300;
     
        container = document.getElementById( 'webGL-container' );
        document.body.appendChild( container );

        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( window.innerWidth / resolution, window.innerHeight / resolution );
        renderer.setClearColor( 0x000000, 1);
        renderer.domElement.id = "Poo Poo";
        container.appendChild( renderer.domElement );               
        renderer.autoClear = false;
        renderer.domElement.style.width = renderer.domElement.width * resolution + 'px';
        renderer.domElement.style.height = renderer.domElement.height * resolution + 'px';
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = false;
        renderer.shadowMapSize = 32;
        renderer.shadowMap.renderReverseSided = false;
        renderer.shadowMap.renderSingleSided = false;

        clock = new THREE.Clock();
    

        //Load Shaders and Setup Planet
        ShaderLoader('js/Shaders/DitherLight/DitherLightShader.vs.glsl', 
        'js/Shaders/DitherLight/DitherLightShader.fs.glsl', setUpPlanet, true); 
        
        //Load Shaders and Setup SkyBox
        ShaderLoader('js/Shaders/Skybox/SkyBox.vs.glsl', 
                     'js/Shaders/Skybox/SkyBox.fs.glsl', setUpSky, true); 


        lineUI = CreateUI(new THREE.Vector3(250,-200,0));

        MainScene.add(lineUI);

        //Add Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        //controls.minZoom = 0.5;
       // controls.maxZoom = 1.5;

        
        dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        var vector = new THREE.Vector3(1000,1000,750);
        dirLight.position.set(vector);

        dirLight.shadow.camera.near	= 0.01;		
        dirLight.castShadow = true;

        var d = 550;

        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;

        dirLight.shadow.mapSize.width = 512;
        dirLight.shadow.mapSize.height = 512;

        dirLight.shadow.camera.far = 1500;
        dirLight.shadow.bias = -0.01;
  
        var shadowCam = new THREE.CameraHelper( dirLight.shadow.camera );
        //MainScene.add(shadowCam);
        MainScene.add(dirLight);

        //Composer
        composer = new THREE.EffectComposer(renderer);
        //Passes

        var StarsRenderPass = new THREE.RenderPass(BackgroundScene, camera);
        composer.addPass(StarsRenderPass);    

        var bloomPass = new THREE.BloomPass(3, 25, 5, 128);
        composer.addPass(bloomPass)

        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        composer.addPass(effectCopy);
        effectCopy.renderToScreen = true;

        var MainRenderPass = new THREE.RenderPass(MainScene, camera);
        MainRenderPass.clear = false;
        MainRenderPass.clearDepth = true;
        composer.addPass(MainRenderPass);

        MainRenderPass.renderToScreen = true;

        //controls.addEventListener("change", render);
        var gridHelper = new THREE.GridHelper( 1000, 20 );
        //MainScene.add( gridHelper );
        
        var axisHelper = new THREE.AxisHelper( 5 );
        //MainScene.add( axisHelper )

        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mousedown', MouseDown, true);
        document.addEventListener('mouseup', function (e) { onMouseUp(e); }, false);
        window.addEventListener("resize", onWindowResize, false);
     
        //var geometry = new THREE.PlaneGeometry( 1225, 1120, 32 );
        //var material = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        //var plane = new THREE.Mesh( geometry, material );
        //MainScene.add( plane );
        //plane.receiveShadow = true;
        //plane.castShadow = true;

        controls = new function() 
        {
        this.xPos = vector.x;
        this.yPos = vector.y;
        this.zPos = vector.z;
        }

        gui = new dat.GUI();
        gui.add(controls, 'xPos', -1000, 1000);
        gui.add(controls, 'yPos', -1000, 1000);
        gui.add(controls, 'zPos', -1000, 1000);

        var col = new THREE.Vector3(255,255,255);
        col = shadeRGBColor(col, -.5);

        var hexCol = "#ffffff";
        hexCol = shadeHEXColor(hexCol.toString(), -0.5);
        console.log(hexCol)
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
        composer.setSize(window.innerWidth / resolution, window.innerHeight / resolution);
        renderer.domElement.style.width = renderer.domElement.width * resolution + 'px';
        renderer.domElement.style.height = renderer.domElement.height * resolution + 'px';
    }
			
    function animate()
    {
        var delta = clock.getDelta(); 

        angle += 0.01;
        dirLight.position.set(controls.xPos, controls.yPos, controls.zPos);

        if(planet !== undefined)
        {
            var elapsedMilliseconds = Date.now() - startTime;
            var elapsedSeconds = elapsedMilliseconds / 1000.;

            if( skyboxuniforms !== undefined)
            skyboxuniforms.time.value = 60. * elapsedSeconds;
            
            PlanetRotation(planet, planetRotationPeriod, planetTilt, delta);
            planetText.updatePosition(planetSize, true);
            MoonsUpdate(clock.getDelta());
            
                if(clouds !== undefined)
            PlanetRotation(clouds, planetRotationPeriod*4, planetTilt, delta);;
        }
        requestAnimationFrame(animate);

        //ShowHideOutline();
        HandleCursor();
        input();
        render();
    }


    function HandleCursor()
    {
        if (inPlanet) 
        {
        $('html,body').css('cursor', 'pointer');
        }
        else
        {
        $('html,body').css('cursor', 'default');
        }
    }

    function MoonsUpdate(delta)
    {  
        
        //Gana need to Optomize this because thats alot of shit to iterate
        if(hasRings)
            {
                if (ringsList !== undefined)
                {
                    for(var i = 0; i < ringsList.length; i++)
                    {
                        RingOrbit(ringsList[i], ringsList[i].Ring, planet, 
                        clock.getElapsedTime(), 1000, 24, delta * 42); 
                    
                    }
                }
            }
        
        if(moonList.length != 0)
        {
            for(var i = 0; i < moonList.length; i++)
            { 
                if (moonList[i] !== undefined)
                {                       
                    moonList[i].text.updatePosition(moonList[i].moonSize);
                    orbit(moonList[i], moonList[i].moonObject, 
                    planet, clock.getElapsedTime() * moonList[i].orbitSpeedMult, 
                    1000, delta/12);
                    moonList[i].material.uniforms.lightpos.value.copy (dirLight.position);
                    ShowHideOrbitPath(moonList[i], moonList[i].moonOrbit);                      
                }       
            }
        }
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

            orbit.traverse ( function (child) 
            {
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

        if(moonList !== undefined)
        {
            for(var i = 0; i < moonList.length; i++)
            {
                MouseInMoon(moonList[i].moonObject, moonList[i].moonSize + 5, moonList[i]);
            }
        }
    }

    function render()
    {
         composer.render();
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
                ShaderLoader('js/Shaders/DitherLight/DitherLightShader.vs.glsl', 
                'js/Shaders/DitherLight/DitherLightShader.fs.glsl', setUpPlanet, false); 
                break;
            case 1: // middle
                break;
            case 2: // right
                break;
            }
        }
  
        mouseDown = true;

    };

    function CalculateParametres(vertex_text, fragment_text)
    {
        persistance = randomRange(0.65, 0.85);
        lacunarity = randomRange(1.9, 2.2);
        octaves = Math.round(randomRange(4,6));
        noiseScale = randomRange(10, 200);
        planetSize = randomRange(40, 125);
        moonList = new Array(Math.round(randomRange(1, 4)));
        planetTilt = randomRange(-55, 55);
        planetRotationPeriod = Math.round(randomRange(65, 100));
     
        InitializeMoonData(moonList, vertex_text, fragment_text);
    }

    function setUpRings(colors, vertex_text, fragment_text)
    {
        ringsList = new Array(Math.round(randomRange(1,5)));

        InitializeRingsData(ringsList); 
        
        if (ringsList !== undefined)
        {
            for(var i = 0; i < ringsList.length; i++)
            {
                    if(!ringsList[i].isFlat)
                    {
                        CreateRockyBelt(ringsList[i], planet,clock.getElapsedTime(), 
                                                    1000, ringsList[i].NumAstros, ringsList[i].Ring, 
                                                    vertex_text, fragment_text, dirLight.position, 
                                                    ringsList[i].astoList, colors);   
                    }
                    else
                    {
                        ShaderLoader('js/Shaders/Ring/Ring.vs.glsl', 
                        'js/Shaders/Ring/Ring.fs.glsl', SetUpFlatBelt, {data: ringsList[i], scene : MainScene}); 
                    }

                    MainScene.add(ringsList[i].Ring);      
            }
        }
        
    }


    function CreateFlatBelt(ringData, vertex_text, fragment_text)
    {
      
        var ringGeo = new RingGeoCreate(ringData,  ringData.Ring, 1000);
    
            var uniform =
            {
                    color: { type: "vf3", value: new THREE.Vector3(1,1,1)},
                    side: THREE.DoubleSide,
                    indexMatrix16x16:{ type: "fv1" , value: DitherPattern},
                    palette:{type:"v3v", value: GrayScalePallete},
                    paletteSize:{type:"i", value:8},
            };
    
           // console.log(THREE.UniformsLib['lights']);
    
            ringMaterial = new THREE.ShaderMaterial
            ({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'], uniform ]),
            vertexShader: textParse(vertex_text),
            fragmentShader: textParse(fragment_text),
            lights: true,
            transparent : true
            });
            ringMaterial.side = THREE.DoubleSide;

        var newRing = new THREE.Mesh( ringGeo, ringMaterial );

        ringData.Ring.add(newRing);
    }

    function InitializeRingsData(ringsList)
    {
        for(var i = 0; i < ringsList.length; i++)
        {
            var orbitrangeOutter;
            var orbitrangeInner;
            var orbitspeed;
            var flat;
            var per;

            var roll = Math.round(randomRange(0, 10));
            
            if(roll >= 4)
            flat = false;
            else
            flat = true;



            if(i == 0)
            {
                        orbitrangeInner = randomRange((planetSize/1000) * 1.1, (planetSize/1000) * 1.2);
                        orbitrangeOutter = randomRange(orbitrangeInner * 1.1, orbitrangeInner * 1.2);
            }
            else if(i > 1)
            {
                    orbitrangeInner = randomRange((ringsList[i - 1].a1), (ringsList[i - 1].a1) * 1.15);
                    orbitrangeOutter = randomRange(orbitrangeInner * 1.1, orbitrangeInner * 1.11);
            }

            NumAstros =  randomRange(36, 42);
            orbitspeed = randomRange(-100, 100);
            orbitspeed = (orbitspeed == 0) ? 1 : orbitspeed;

            per = randomRange(randomRange(-10, -5), randomRange(5, 10));
            per = (per == 0) ? 1 : orbitspeed;

            var mat;

            ringsList[i] =
            {
            radius: 1.5424, tilt: planetTilt, N1: 125.1228, N2: 0,
            i1: 0, i2: 0, w1: 360, w2: 0.27,
            a1: orbitrangeOutter, a2: 0, a3: orbitrangeInner, a4: 0, e1: 0, e2: 0, isFlat : flat,
            M1: 115.3654, M2: 13.0649929509, period: per, NumAstros :  NumAstros,
            Ring: new THREE.Object3D(), orbitSpeedMult : orbitspeed, astoList : []
            }
        }

    }

    function InitializeMoonData(moonList, vertex_text, fragment_text)
    {
        for(var i = 0; i < moonList.length; i++)
        {

        var roll = randomRange(0,10);
        
        var mat;
        size =  randomRange(1, Math.round(planetSize/4));
        orbitspeed = randomRange(-2, 2);
        orbitspeed = (orbitspeed == 0) ? 1 : orbitspeed;

        if(roll > 2.2)
            {
                
            moonData = createPlantiodData(octaves, persistance, lacunarity, 
            seed, 128, offset, 24);
            
            var uniform = createUniforms(moonData.map);

            moonMaterial =  new THREE.ShaderMaterial ({
            uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'], 
            uniform]),
            vertexShader: vertex_text,
            fragmentShader: fragment_text,
            lights : true  
            });

            moonMaterial.uniforms.texture.value = moonData.map;
            mat = moonMaterial;

            }
            else
            { 

            var uniform = createUniforms(null);

            moonMaterial = new THREE.ShaderMaterial ({
            uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'], 
            uniform]),
            vertexShader: vertex_text,
            fragmentShader: fragment_text,
            lights : true  
            });

                moonMaterial.uniforms.texture.value = null;
                moonMaterial.uniforms.texture.value = null;
                mat = moonMaterial;
            }

            moonList[i] = 
            {

            //Again Much Credit To The Folks At Qt:
            //https://doc.qt.io/qt-5/qt3d-planets-qml-planets-js.html 
            //Smexcity !!!

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
            //i1: 115.1454

            radius: 1.5424, tilt: 0, N1: 125.1228, N2: 0,
            i1: randomRange(-60,60), i2: 0, w1: 318.0634, w2: 0.1643573223,
            a1: randomRange(planetSize/1000 + .02, 0.32), a2: 0, e1: 0, e2: 0,
            M1: 115.3654, M2: 13.0649929509, period: 1, moonSize :  size,
            moonObject : createMoon(size, mat), material: mat,
            moonOrbit : 0, orbitSpeedMult : orbitspeed, inMoon : false, text : false 
            }
        }

    } 

    function CreateUI(position)
    {
        var square = new THREE.Geometry();
        square.vertices.push(new THREE.Vector3(0, 0, 0));
        square.vertices.push(new THREE.Vector3(0, boxsize, 0));
        square.vertices.push(new THREE.Vector3(boxsize, boxsize, 0));
        square.vertices.push(new THREE.Vector3(boxsize, 0, 0));

        square.vertices.push(new THREE.Vector3(0, 0, 0));

        square.faces.push(new THREE.Face3(0, 1, 2));
        square.faces.push(new THREE.Face3(0, 3, 2));

        var UI = new THREE.Line(square, new THREE.LineDashedMaterial({
	    color: 0xfff000,
	    dashSize: 2,
	    gapSize: 5,
	    linewidth: 1
      }));
        
        UI.position.set(position.x, position.y, position.z);

        return UI;
    }
    function setUpSky(start, vertex_text, fragment_text)
    {
        skyboxuniforms =
        {
            resolution: { type: "v2", value: new THREE.Vector2() },
            randomColsMults: { type: "v3", 
            value: new THREE.Vector3(randomRange(0,10), 
                                     randomRange(0,10),
                                     randomRange(0,10)) },
            time:{type: "f", value:1.0}            
        }

        var skyMaterial = new THREE.ShaderMaterial(
        {
            vertexShader : vertex_text,
            fragmentShader : fragment_text,
            uniforms : skyboxuniforms,
            side: THREE.BackSide, 
            fog : false
        });

        var skyBox = new THREE.Mesh(new THREE.SphereGeometry(550,
        60, 40), skyMaterial);

        BackgroundScene.add(skyBox);
        skyBox.castShadow = false;
        skyBox.receiveShadow = false;

        skyboxuniforms.resolution.value.x = window.innerWidth;
        skyboxuniforms.resolution.value.y = window.innerHeight;
      
    }

    function createAtmos(atmoInfo,vertex_text, fragment_text)
    {
         var loader = new THREE.TextureLoader();
         var img = loader.load( "img/gradient-value-equalised2.png");

         //Max AtmoThickness before wierd shit starts is 1.2 or close to that 
        var myuniforms = 
        { 
            Gradient: { type: 't', value: null},
            fresnelExp :{ type: "f", value: 5.3},
            transitionWidth:{ type: "f", value: 0.1},
            atmoThickness:{ type: "f", value: 1.0},    
            indexMatrix16x16:{ type: "fv1" , value: DitherPattern},
            palette:{type:"v3v", value: GrayScalePallete},
            paletteSize:{type:"i", value: 8},
        }

        atmoMaterial = new THREE.ShaderMaterial 
        ({
            uniforms: THREE.UniformsUtils.merge
            ([
            THREE.UniformsLib['lights'], 
            myuniforms 
            ]),
                vertexShader: vertex_text,
                fragmentShader: fragment_text,
                transparent: true,
                lights : true
            }   
        );

        atmoMaterial.uniforms.Gradient.value = img;
        
        atmo = new THREE.Mesh(planetGeo, atmoMaterial);
        atmo.position.set(0, 0, 0);//= planet.position;
        atmo.scale.multiplyScalar(1.05);

        atmo.castShadow = false;
        atmo.receiveShadow = false;
        
        MainScene.add( atmo );
    }

    function createPlanet(start, vertex_text, fragment_text)
    {
        if(planet !== undefined)
        {
            MainScene.remove(planet);
            MainScene.remove(outline);
            MainScene.remove(atmo);
            MainScene.remove(clouds);
            planetText.element.remove();
           
            for(var i = 0; i < moonList.length; i++)
            {   
                moonList[i].text.element.remove();
                MainScene.remove(moonList[i].moonObject);
                MainScene.remove(moonList[i].moonOrbit);
            }
            
            if(hasRings)
                {
                    if (ringsList !== undefined)
                    {
                        for(var i = 0; i < ringsList.length; i++)
                        {   
                            MainScene.remove(ringsList[i].orbitObject);
                            MainScene.remove(ringsList[i].Ring);
                        }
                    }
                }
        }

        CalculateParametres(vertex_text, fragment_text);

        planetData = createPlantiodData(octaves, persistance, lacunarity, 
            seed, noiseScale, offset, textureSize);

        var vertex = vertex_text;
        var fragment = fragment_text;

        var uniform = createUniforms(planetData.map);

         PlanetMaterial = new THREE.ShaderMaterial ({
            uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'], 
            uniform ]),
            vertexShader: textParse(vertex),
            fragmentShader: textParse(fragment),
            lights : true           
        });

        PlanetMaterial.uniforms.texture.value = planetData.map;

        // instantiate a loader
        var loader = new THREE.TextureLoader();

        loader.crossOrigin = '';

        planetGeo = new THREE.SphereGeometry(planetSize, 32, 32 );
        planet = new THREE.Mesh( planetGeo, PlanetMaterial );
        planet.castShadow = true; //default is false
        planet.receiveShadow = true; //default

        MainScene.add(planet);
        
        planetText = generateName(planet);

        ShaderLoader('js/Shaders/Atmo/AtmoShader.vs.glsl', 
        'js/Shaders/Atmo/AtmoShader.fs.glsl', setUpAtmosphere, true); 

       for(var i = 0; i < moonList.length; i++)
        {
        moonList[i].moonOrbit = DrawOrbit(moonList[i], planet, clock.getElapsedTime(), 1000);
        MainScene.add(moonList[i].moonObject);

        if(moonList[i].moonOrbit != 0)
        MainScene.add(moonList[i].moonOrbit);

        moonList[i].text = generateName(moonList[i].moonObject);
        }  
        
        var roll = randomRange(0, 10);

        if(roll >= 6)
        {
            hasRings = true;
        ShaderLoader('js/Shaders/Asto/Asto.vs.glsl', 
        'js/Shaders/Asto/Asto.fs.glsl', setUpRings, planetData.colors); 
        }
        else
        {
            hasRings = false;
        }

        ShaderLoader('js/Shaders/Cloud/Cloud.vs.glsl', 
        'js/Shaders/Cloud/Cloud.fs.glsl', setUpClouds, 1.1); 


    }

    function createClouds(cloudsizeMult, vertex_text, fragment_text)
    {

       var cloudOctaves = 2;
       var cloudpersistance = .02;
       var cloudlacunarity = 1;
       var cloudnoiseScale = randomRange(10,10);

        cloudsData = createCloudData(cloudOctaves, cloudpersistance, cloudlacunarity, 
            1, cloudnoiseScale, new THREE.Vector2(0,0), textureSize);

        var vertex = vertex_text;
        var fragment = fragment_text;

        var uniform = 
        {
                texture: { type: "t", value: null },
                color: { type: "vf3", value: new THREE.Vector3(255, 255, 255)},
        };

         CloudsMaterial = new THREE.ShaderMaterial ({
            uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'], 
            uniform ]),
            vertexShader: textParse(vertex),
            fragmentShader: textParse(fragment),
            lights : true,
        
        });

        CloudsMaterial.uniforms.texture.value = cloudsData.map;

        cloudsGeo = new THREE.SphereGeometry(planetSize, 32, 32 );
        clouds = new THREE.Mesh( cloudsGeo, CloudsMaterial );
        clouds.scale.multiplyScalar(1.1);
        //clouds.castShadow = true; //default is false
        clouds.receiveShadow = true; //default

        //MainScene.add(clouds);  
    }

    function createMoon(moonSize, mat)
    {         
        var moon = new THREE.Mesh( new THREE.SphereGeometry(moonSize, 12,  Math.PI * 2 ), mat );
        
        moon.castShadow = true; //default is false
        moon.receiveShadow = true; //default+
        return moon;
    }

    function createUniforms(texture)
    {
        return uniform =
        {
                indexMatrix16x16:{ type: "fv1" , value: DitherPattern},
                palette:{type:"v3v", value: GrayScalePallete},
                paletteSize:{type:"i", value:8},
                texture: { type: "t", value: null },
                lightpos: {type: 'v3', value: new THREE.Vector3(0,30,20) },
                noTexture:{type:"i", value:(texture == null) ? 1 : 0}
        };
    }

    function createPlantiodData(octaves, persistance, lacunarity, seed, noiseScale, offset, size)
    {
          var planetInfo = new MapGenerator(octaves, persistance, lacunarity, 
          seed, noiseScale, offset, size, false);
        
          const dataTexture = new THREE.DataTexture
          (
          Uint8Array.from(planetInfo.map),
          size,
          size,
          THREE.RGBFormat,
          THREE.UnsignedByteType,
          );
      
          dataTexture.needsUpdate = true;
          
          return new PlanetInformation(dataTexture, planetInfo.hasAtmo, planetInfo.hasLiquad, planetInfo.colors);
    }

    function createCloudData(octaves, persistance, lacunarity, seed, noiseScale, offset, size)
    {
          var cloudInfo = new MapGenerator(octaves, persistance, lacunarity, 
          seed, noiseScale, offset, size, true);
        
          const dataTexture = new THREE.DataTexture
          (
          Uint8Array.from(cloudInfo.map),
          size,
          size,
          THREE.RGBFormat,
          THREE.UnsignedByteType,
          );
      
          dataTexture.needsUpdate = true;
          
          return new PlanetInformation(dataTexture, cloudInfo.hasAtmo, cloudInfo.hasLiquad);
    }

    function generateName(parent)
    {
        var roll = randomRange(0,10);

        var newText = createTextLabel();
        if(roll > 5)
        newText.setHTML(word(randomRange(4, 12))+ "-" + Math.round(randomRange(0,1000)));
        else
        newText.setHTML(word(randomRange(4, 12))); 

        newText.setParent(parent);
        container.appendChild(newText.element);

        return newText;
    }

    // Credit to THeK3nger - https://gist.github.com/THeK3nger/300b6a62b923c913223fbd29c8b5ac73
    //Sorry to any soul that bare's witness to this Abomination....May the gods have mercy on me
    function ShaderLoader (vertex_url, fragment_url, onLoad, Custom, onProgress, onError)   
    {
        var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        vertex_loader.setResponseType('text');
        vertex_loader.load(vertex_url, function (vertex_text) {
            var fragment_loader = new  THREE.FileLoader(THREE.DefaultLoadingManager);
            fragment_loader.setResponseType('text');
                fragment_loader.load(fragment_url, function (fragment_text) {
                    var shadow_loader = new  THREE.FileLoader(THREE.DefaultLoadingManager);
                     shadow_loader.setResponseType('text');
                        shadow_loader.load("js/Shaders/Shadow.glsl", function (shadow_text)  {
                                var dither_loader = new  THREE.FileLoader(THREE.DefaultLoadingManager);
                                dither_loader.setResponseType('text');
                                dither_loader.load("js/Shaders/Dither.glsl", function (dither_text)  
                                    {
                                         onLoad(Custom, textParse(vertex_text, shadow_text, dither_text), textParse(fragment_text, shadow_text, dither_text));
                                    }
                        
                        )});
        })}, onProgress, onError);
    }
    
    //Dummy Methods To Pass Pararemtres threw the Async Loader func
    function setUpPlanet(init, vertex_text, fragment_text)
    {   
        createPlanet(init, vertex_text, fragment_text);
    }
    function setUpClouds(cloudsizeMult, vertex_text, fragment_text)
    {   
        createClouds(cloudsizeMult, vertex_text, fragment_text);
    }
    function setUpAtmosphere(atmoInfo, vertex_text, fragment_text)
    {   
        createAtmos(atmoInfo, vertex_text, fragment_text);
    }
  
    function SetUpFlatBelt(ringData, vertex_text, fragment_text)
    {
        CreateFlatBelt(ringData.data, vertex_text, fragment_text);
    }
