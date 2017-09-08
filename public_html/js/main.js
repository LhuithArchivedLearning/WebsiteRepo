   
	var container, stats, resolution, controls, lineUI, gui;
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
    var skyboxuniforms;
    var planetSize, planetData, inPlanet, planet, 
    planetText, planetTextInfo, atmoMaterial, planetTilt, hasRings, 
    PlanetMaterial, moonList, ringsList, outline, 
    atmo, clouds, planetRotationPeriod;

    var selectionBox;
    
    var astroidSprites = [], AstoColorPalleteGrab;
    var moonGeom, sphereGeom;
    var timer = 0;
    var timeLimit = .25;
    var startTime = Date.now();
    
    var atmoThicknessInfo;

var atmouniforms = 
   { 
       fresnelExp :{ type: "f", value: 0},
       transitionWidth:{ type: "f", value: 0.1},
       atmoThickness:{ type: "f", value: 0},    
       indexMatrix16x16:{ type: "fv1" , value: DitherPattern},
       palette:{type:"v3v", value: GrayScalePallete},
       paletteSize:{type:"i", value: 8},
       colorlight:{type: "v3", value: 0},
   }

    var skyboxuniforms =
    {
        resolution: { type: "v2", value: new THREE.Vector2() },
        randomColsMults: { type: "v3", 
        value: new THREE.Vector3(
            randomRange(0,10), 
            randomRange(0,10),
            randomRange(0,10)) },
        time:{type: "f", value:1.0}            
    }

    var planetUniform =
    {
            indexMatrix16x16:{ type: "fv1" , value: DitherPattern2},
            palette:{type:"v3v", value: GrayScalePallete},
            paletteSize:{type:"i", value:8},
            texture: { type: "t", value: null },
            lightpos: {type: 'v3', value: new THREE.Vector3(0,30,20) },
            noTexture:{type:"i", value: 0}
    };

    var ringUniform =
    { 
            color: { type: "vf3", value: new THREE.Vector3(1,1,1)},
            side: THREE.DoubleSide,
            indexMatrix16x16:{ type: "fv1" , value: DitherPattern},
            palette:{type:"v3v", value: GrayScalePallete},
            paletteSize:{type:"i", value:8},
            colors : {type:"v3v", value:  0},
            ringLimits : {type:"fv1", value: 0},
            transparency : {type:"fv1", value: 0}
    };

    var ShaderLoadList = 
    {
        planet : new Shader
        (
        ),

        atmo : new Shader
        (
        ),

        asto : new Shader
        (
        ),

        ring : new Shader
        (
        ),

        cloud : new Shader
        (
        ),
    }

    init();
    animate();

    function Shader(vertex, fragment)
    {
        this.vertex = vertex;
        this.fragment = fragment;
    }

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

        lineUI = CreateUI(new THREE.Vector3(250,-200,0));
        MainScene.add(lineUI);

        
        //Add Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        //controls.minZoom = 0.5;
       // controls.maxZoom = 1.5;

        
        dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        var vector = new THREE.Vector3(750,500,1000);
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

        dirLight.shadow.camera.far = 2500;
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
        dat.GUI.toggleHide();

        LoadAssets();
        //Load Shaders and Setup Planet
        ShaderLoader('js/Shaders/Planet/Planet.vs.glsl', 
        'js/Shaders/Planet/Planet.fs.glsl', setUpPlanet, true); 
        
        //Load Shaders and Setup SkyBox
        ShaderLoader('js/Shaders/Skybox/SkyBox.vs.glsl', 
                        'js/Shaders/Skybox/SkyBox.fs.glsl', setUpSky, true); 
        
    }


    function LoadAssets()
    {      
        var texterLoader =  new THREE.TextureLoader();
        
        var spriteMap01 = texterLoader.load( "img/astoriod_01.png" );
        var spriteMap02 = texterLoader.load( "img/astoriod_02.png" );
        var spriteMap03 = texterLoader.load( "img/astoriod_03.png" );
        var spriteMap04 = texterLoader.load( "img/astoriod_04.png" );
        var spriteMap05 = texterLoader.load( "img/astoriod_05.png" );
    
        astroidSprites = [spriteMap01, spriteMap02, spriteMap03, spriteMap04, spriteMap05];
    
        spriteMap01.magFilter = THREE.NearestFilter;
        spriteMap01.minFilter = THREE.NearestFilter;  
        spriteMap02.magFilter = THREE.NearestFilter;
        spriteMap02.minFilter = THREE.NearestFilter;
        spriteMap03.magFilter = THREE.NearestFilter;
        spriteMap03.minFilter = THREE.NearestFilter; 
        spriteMap04.magFilter = THREE.NearestFilter;
        spriteMap04.minFilter = THREE.NearestFilter;  
        spriteMap05.magFilter = THREE.NearestFilter;
        spriteMap05.minFilter = THREE.NearestFilter;

        //AstPalleteColorGrab = AstoColorPalleteGrab[randomRangeRound(0, AstoColorPalleteGrab.length - 1)].RGB;
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
        
        timer = timer + delta;

        if(timer >= timeLimit)
        {
           // if(ShaderLoadList.planet.vertex == undefined)
           // {
           //     ShaderLoader('js/Shaders/Planet/Planet.vs.glsl', 
           //     'js/Shaders/Planet/Planet.fs.glsl', setUpPlanet, false); 
           // }
           // else
           // {
           //     createPlanet(false, ShaderLoadList.planet.vertex, ShaderLoadList.planet.fragment);
           // }

            timer = 0;
        }

        angle += 0.1;
        dirLight.position.set(controls.xPos, controls.yPos, controls.zPos);

        if(planet !== undefined)
        {
     
            var elapsedMilliseconds = Date.now() - startTime;
            var elapsedSeconds = elapsedMilliseconds / 1000.;

            if( skyboxuniforms !== undefined)
            skyboxuniforms.time.value = 60. * elapsedSeconds;
            PlanetRotation(planet, planetRotationPeriod, planetTilt, delta);

            planetText.updatePosition(planetSize, - planetText.element.clientWidth/2, 75);
           
            if(clouds !== undefined)
            PlanetRotation(clouds, planetRotationPeriod*4, planetTilt, delta);;
        }

        MoonsUpdate(clock.getDelta());
        requestAnimationFrame(animate);

        //ShowHideOutline();
        HandleCursor();
        input();
        render();
    }

    function HandleCursor()
    {
       // if (inPlanet) 
       // {
       // $('html,body').css('cursor', 'pointer');
       // }
       // else
       // {
       // $('html,body').css('cursor', 'default');
       // }
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
                        RingOrbit(ringsList[i], ringsList[i].Ring, new THREE.Vector3(0,0,0), 
                        clock.getElapsedTime(), 1000, 24, delta * 42); 
                    
                    }
                }
            }
        
        if(moonList !== undefined)
        {
            for(var i = 0; i < moonList.length; i++)
            {                      
                    moonList[i].text.updatePosition(moonList[i].moonSize, 
                         - planetText.element.clientWidth/2, 55);
                    
                    orbit(moonList[i], moonList[i].moonObject, 
                    new THREE.Vector3(0,0,0), clock.getElapsedTime() * moonList[i].orbitSpeedMult, 
                    1000, delta/12);
                    moonList[i].material.uniforms.lightpos.value.copy (dirLight.position);
                    ShowHideOrbitPath(moonList[i], moonList[i].moonOrbit);                      
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

                if(ShaderLoadList.planet.vertex == undefined)
                {
                    ShaderLoader('js/Shaders/Planet/Planet.vs.glsl', 
                    'js/Shaders/Planet/Planet.fs.glsl', setUpPlanet, false); 
                }
                else
                {
                    createPlanet(false, ShaderLoadList.planet.vertex, ShaderLoadList.planet.fragment);
                }

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
        moonList = new Array(Math.round(randomRange(1, 4)));
        planetTilt = randomRange(-55, 55);
        planetSize = randomRange(40, 125);
        planetRotationPeriod = Math.round(randomRange(65, 100));
        InitializeMoonData(moonList, vertex_text, fragment_text);
    }

    function setUpRings(colors, vertex_text, fragment_text)
    {

        ShaderLoadList.asto.vertex = vertex_text;
        ShaderLoadList.asto.fragment = fragment_text;

        ringsList = new Array(Math.round(randomRange(1,4)));

        var index = randomRangeRound(1, ColorPalletes.length - 1);
        AstoColorPalleteGrab =  ColorPalletes[index];

        InitializeRingsData(ringsList); 
                
        if (ringsList !== undefined)
        {
            for(var i = 0; i < ringsList.length; i++)
            {

                    if(!ringsList[i].isFlat)
                    {
                        CreateRockyBelt(ringsList[i], new THREE.Vector3(0,0,0) ,clock.getElapsedTime(), 
                                                    1000, ringsList[i].NumAstros, ringsList[i].Ring, 
                                                    vertex_text, fragment_text, dirLight.position, 
                                                    ringsList[i].astoList, AstoColorPalleteGrab);   
                    }
                    else
                    {
                        if(ShaderLoadList.ring.vertex == undefined)
                        {
                        ShaderLoader('js/Shaders/Ring/Ring.vs.glsl', 
                        'js/Shaders/Ring/Ring.fs.glsl', SetUpFlatBelt, {data: ringsList[i], Ringcolors : AstoColorPalleteGrab});
                        }
                        else
                        {
                            CreateFlatBelt({data: ringsList[i], Ringcolors : AstoColorPalleteGrab}, 
                                ShaderLoadList.ring.vertex, ShaderLoadList.ring.fragment);
                        }
                    }

                    MainScene.add(ringsList[i].Ring);      
            }
        }
        
    }

    function CreateFlatBelt(ringData, vertex_text, fragment_text)
    {
        var ringGeo = new RingGeoCreate(ringData.data, ringData.data.Ring, 1000);
        var ringLimits = new Array(5);
        var transparency = new Array(5);
        
        ringLimits[0] = randomRange(0.01, 0.5);
        ringLimits[1] = randomRange(ringLimits[0], 0.6);
        ringLimits[2] = randomRange(ringLimits[1], 0.9);

        var colorsRGB = [];
        
        for(var j = 0; j < ringData.Ringcolors.length; j++)
        {
            var R = ringData.Ringcolors[j].RGB.r;
            var G = ringData.Ringcolors[j].RGB.g;
            var B = ringData.Ringcolors[j].RGB.b;

            var normalColors = new THREE.Vector3(R, G, B);
            colorsRGB.push(normalColors);
        }

        for(var i = 0; i < 5; i++)
        {
            transparency[i] = randomRange(0.1, 1.0);
        }

            ringUniform.colors.value = colorsRGB;
            ringUniform.ringLimits.value = ringLimits;
            ringUniform.transparency.value = transparency;

            ringMaterial = new THREE.ShaderMaterial
            ({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                 ringUniform ]),
            vertexShader: (vertex_text),
            fragmentShader: (fragment_text),
            lights: true,
            transparent : true
            });
            ringMaterial.side = THREE.DoubleSide;

        var newRing = new THREE.Mesh( ringGeo, ringMaterial );
        newRing.castShadow = true;
        newRing.receiveShadow = true;

        ringData.data.Ring.add(newRing);
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
                orbitrangeOutter = randomRange(orbitrangeInner * 1.05, orbitrangeInner * 1.15);
            }
            else if(i >= 1)
            {
                orbitrangeInner = randomRange((ringsList[i - 1].a1), (ringsList[i - 1].a1) * 1.15);
                orbitrangeOutter = randomRange(orbitrangeInner * 1.05, orbitrangeInner * 1.15);
            }


            var roll = Math.round(randomRange(0, 1));
            NumAstros =  randomRange(36, 52);

            per = randomRange(1, 25);
            if(roll <= 0)
            {
                orbitspeed = randomRange(5, 20);
                per = (per == 0) ? 1 : orbitspeed;
            }
            else
            {
                orbitspeed = randomRange(-5, -20);
                per = (per == 0) ? 1 : orbitspeed;
            }
            
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


            moonData = createPlantiodData(octaves, persistance, lacunarity, 
            seed, 128, offset, 24);
            
            moonMaterial =  new THREE.ShaderMaterial ({
            uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'], 
            planetUniform]),
            vertexShader: vertex_text,
            fragmentShader: fragment_text,
            lights : true  
            });


            if(roll > 2.2)
            {

            moonMaterial.uniforms.texture.value = moonData.map;
            mat = moonMaterial;

            }
            else
            { 
                moonMaterial.uniforms.noTexture.value = 1;
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

        var spriteMap = new THREE.TextureLoader().load("img/Icons/Refresh.png");
        var spriteMat = new THREE.SpriteMaterial({map : spriteMap, color: 0xffffff});

        spriteMap.magFilter = THREE.NearestFilter;
        spriteMap.minFilter = THREE.NearestFilter; 

        var sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(35,35,35);
        MainScene.add(sprite);


        var square = new THREE.Geometry();
        square.vertices.push(new THREE.Vector3(0, 0, 0));
        square.vertices.push(new THREE.Vector3(0, boxsize, 0));
        square.vertices.push(new THREE.Vector3(boxsize, boxsize, 0));
        square.vertices.push(new THREE.Vector3(boxsize, 0, 0));

        square.vertices.push(new THREE.Vector3(0, 0, 0));

        square.faces.push(new THREE.Face3(0, 1, 2));
        square.faces.push(new THREE.Face3(0, 3, 2));

        var UI = new THREE.Line(square, new THREE.LineDashedMaterial({
	    color: 0x000000,
	    dashSize: 2,
	    gapSize: 5,
	    linewidth: 1
      }));
        
        UI.position.set(position.x, position.y, position.z);
        sprite.position.set(position.x + boxsize/2, position.y + boxsize/2, 0);
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

    function createAtmos(colors, vertex_text, fragment_text)
    {
        var colorsRGBLight = [];

        for(var j = 0; j < colors.length; j++)
        {
            var R = colors[j].RGB.r;
            var G = colors[j].RGB.g;
            var B = colors[j].RGB.b;

            var normalColors = new THREE.Vector3(R, G, B);
            colorsRGBLight.push(shadeRGBColor(normalColors, randomRange(0, 1.0)));
        }

         atmouniforms.fresnelExp.value =  randomRange(0.8, 40.0);
         atmouniforms.atmoThickness.value = randomRange(0.6, 1.5);
         atmouniforms.colorlight.value =  colorsRGBLight[randomRangeRound(0, colorsRGBLight.length - 1)];

        atmoMaterial = new THREE.ShaderMaterial 
        ({
            uniforms: THREE.UniformsUtils.merge
            ([
            THREE.UniformsLib['lights'], 
            atmouniforms 
            ]),
                vertexShader: vertex_text,
                fragmentShader: fragment_text,
                transparent: true,
                lights : true
            }   
        );
     
        atmo = new THREE.Mesh(new THREE.IcosahedronGeometry(
            planetSize * randomRange(1.07, 1.15), 4), atmoMaterial);
        atmo.position.set(0, 0, 0);//= planet.position;
        atmo.castShadow = false;
        atmo.receiveShadow = false;
        
        MainScene.add( atmo );
    }

    function RemoveOldShizz()
    {
        if(planet !== undefined)
        {
            doDispose(planet);
            MainScene.remove(planet);
        }
         if(outline !== undefined)
        {
        MainScene.remove(outline);
        }
        if(atmo !== undefined)
        {
        MainScene.remove(atmo);
        doDispose(atmo);
        }
         if(clouds !== undefined)
        {
        MainScene.remove(clouds);
        }
        //doDispose(clouds);
        planetText.element.remove();
        planetTextInfo.element.remove();

        for(var i = 0; i < moonList.length; i++)
        {   
            moonList[i].text.element.remove();
            MainScene.remove(moonList[i].moonObject);
            MainScene.remove(moonList[i].moonOrbit);
            doDispose(moonList[i].moonObject);
            doDispose(moonList[i].moonOrbit);
        }
        
        if(hasRings)
        {
            for(var i = 0; i < ringsList.length; i++)
            {   
                MainScene.remove(ringsList[i].orbitObject);
                MainScene.remove(ringsList[i].Ring);
                doDispose(ringsList[i].Ring);
            }
        }
    }

    function createPlanet(start, vertex_text, fragment_text)
    {
        if(planet !== undefined)
        {
            RemoveOldShizz();
        }
        else
        {
            var vertex = vertex_text;
            var fragment = fragment_text;
            var ico = new THREE.IcosahedronGeometry(planetSize, 4);
            
            PlanetMaterial = new THREE.ShaderMaterial ({
                uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'], 
                planetUniform ]),
                vertexShader: (vertex),
                fragmentShader: (fragment),
                lights : true           
            });
        }

        CalculateParametres(vertex_text, fragment_text);

        planetData = createPlantiodData(octaves, persistance, lacunarity, 
            seed, noiseScale, offset, textureSize);


        //Custom image mapping addtion
        //maybe find a smarter way to do this :s
        //regions, url, size, planet, vertex_text, fragment_text
        var cube = new THREE.CubeGeometry( 200, 200, 200 );
        var ico = new THREE.IcosahedronGeometry(planetSize, 4);

        planet = new THREE.Mesh(cube, 
        PlanetMaterial );
        planet.castShadow = true; //default is false
        planet.receiveShadow = true; //default


        if(planetData.url == '')
        {
            planet = new THREE.Mesh(ico, 
            PlanetMaterial );
            planet.castShadow = true; //default is false
            planet.receiveShadow = true; //default
            MainScene.add(planet);
            
            PlanetMaterial.uniforms.texture.value = planetData.map;            
        }
        else
        {
        var customData = {region: planetData.regionsInfo, size : textureSize, mat : PlanetMaterial,
        vert : vertex_text, frag : fragment_text};
        CustomTextureLoader(planetData.url, customData, SetupTextureFunction);
        }

        //planetData.regionsInfo, planetData.url, 
        //textureSize, planet, vertex_text, fragment_text

        planetText = generateName(planet, "35px", -1000, false);

    
        if(ShaderLoadList.atmo.vertex == undefined)
        {
        ShaderLoader('js/Shaders/Atmo/AtmoShader.vs.glsl', 
        'js/Shaders/Atmo/AtmoShader.fs.glsl', setUpAtmosphere, planetData.colors); 
        }
        else
        {
            createAtmos(planetData.colors, ShaderLoadList.atmo.vertex , ShaderLoadList.atmo.fragment );
        }
        
        for(var i = 0; i < moonList.length; i++)
            {
                moonList[i].moonOrbit = DrawOrbit(moonList[i], new THREE.Vector3(0,0,0), clock.getElapsedTime(), 1000);
                MainScene.add(moonList[i].moonObject);

                if(moonList[i].moonOrbit != 0)
                MainScene.add(moonList[i].moonOrbit);

                moonList[i].text = generateName(moonList[i].moonObject, "35px", -1000, false);// generateName(planet, "35px", -1000);
            }  
            
            var roll = randomRange(0, 10);

            if(roll >= 5)
            {
                    hasRings = true;

                    if(ShaderLoadList.asto.vertex == undefined)
                    {
                    ShaderLoader('js/Shaders/Asto/Asto.vs.glsl', 
                    'js/Shaders/Asto/Asto.fs.glsl', setUpRings, planetData.colors); 
                    }
                    else
                    {
                        setUpRings(planetData.colors, ShaderLoadList.asto.vertex, ShaderLoadList.asto.fragment);
                    }
            }
            else
            {
                    hasRings = false;
            }

            
        planetTextInfo = generateName(planet, "30px", -1000, true);
        planetTextInfo.setWidthbyPercent(70);
        planetTextInfo.setHeight(planetSize);

       //ShaderLoader('js/Shaders/Cloud/Cloud.vs.glsl', 
       //'js/Shaders/Cloud/Cloud.fs.glsl', setUpClouds, 1.1); 
    }

    function doDispose (obj)
    {
        if (obj !== null)
        {
            for (var i = 0; i < obj.children.length; i++)
            {
                doDispose(obj.children[i]);
            }
            if (obj.geometry)
            {
                obj.geometry.dispose();
                obj.geometry = undefined;
            }
            if (obj.material)
            {
                if (obj.material.map)
                {
                    obj.material.map.dispose();
                    obj.material.map = undefined;
                }
                obj.material.dispose();
                obj.material = undefined;
            }
        }
        obj = undefined;
    };

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
            vertexShader: (vertex),
            fragmentShader: (fragment),
            lights : true,
        
        });

        CloudsMaterial.uniforms.texture.value = cloudsData.map;

        cloudsGeo = new THREE.SphereGeometry(planetSize, 32, 32 );
        clouds = new THREE.Mesh( cloudsGeo, CloudsMaterial );
        clouds.scale.multiplyScalar(1.0);
        //clouds.castShadow = true; //default is false
        clouds.receiveShadow = true; //default

        //MainScene.add(clouds);  
    }

    function createMoon(moonSize, mat)
    {         
        var moon = new THREE.Mesh(new THREE.IcosahedronGeometry(moonSize, 2), mat );
        moon.castShadow = true; //default is false
        moon.receiveShadow = true; //default+
        return moon;
    }

    function createDataMap(map, size)
    {
        var dataTexture;
        
        dataTexture = new THREE.DataTexture
        (
        Uint8Array.from(map),
        size,
        size,
        THREE.RGBFormat,
        THREE.UnsignedByteType,
        );

        dataTexture.needsUpdate = true;
        
        return dataTexture;
    }

    function createPlantiodData(octaves, persistance, lacunarity, seed, noiseScale, offset, size)
    {
          var planetInfo = new MapGenerator(octaves, persistance, lacunarity, 
          seed, noiseScale, offset, size, false);
        
          var dataTexture;

          dataTexture = new THREE.DataTexture
          (
          Uint8Array.from(planetInfo.map),
          size,
          size,
          THREE.RGBFormat,
          THREE.UnsignedByteType,
          );
  
          dataTexture.needsUpdate = true;
          
          return new PlanetInformation(dataTexture, planetInfo.hasAtmo, 
            planetInfo.hasLiquad, planetInfo.colors, planetInfo.url,
            planetInfo.regionsInfo);
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

    function generateName(parent, fontsize, left, isInfo)
    {

        var roll = randomRange(0,10);

        var newText = createTextLabel(fontsize, left);
        var wordtxt = word(randomRange(3, 25));

        if(roll > 5 && !isInfo)
        {
        newText.setHTML(wordtxt + "-" + Math.round(randomRange(0,1000)));
        }
        else if(!isInfo)
        {
        newText.setHTML(wordtxt);
        }
        else
        {
        newText.setHTML(
        "Moons: " + moonList.length
        + "<br>" +
        "Size: " + Math.round(planetSize) * 100 + " km"
        + "<br>" +
        "Atmo: " + Math.round(((planetSize * 1.07) - planetSize) * 100) + " km"
          + "<br>" +
         "Hazards: " + hazards[randomRangeRound(0, hazards.length - 1)]
         + "<br>" +
         ""
         + "<br>" +
         "This is a totaly Awsome Little Planet Generator"
         
        );
        }

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
    
    //Methods to Setup and Save the Loaded Texts
    //Aswell as pass in extra paramaratres if needed
    function setUpPlanet(init, vertex_text, fragment_text)
    {   
        ShaderLoadList.planet.vertex = vertex_text;
        ShaderLoadList.planet.fragment = fragment_text;
        createPlanet(init, vertex_text, fragment_text);
    }
    function setUpClouds(cloudsizeMult, vertex_text, fragment_text)
    {   

        ShaderLoadList.cloud.vertex = vertex_text;
        ShaderLoadList.cloud.fragment = fragment_text;

        createClouds(cloudsizeMult, vertex_text, fragment_text);
    }
    function setUpAtmosphere(atmoInfo, vertex_text, fragment_text)
    {   

        ShaderLoadList.atmo.vertex = vertex_text;
        ShaderLoadList.atmo.fragment = fragment_text;

        createAtmos(atmoInfo, vertex_text, fragment_text);
    }
  
    function SetUpFlatBelt(ringData, vertex_text, fragment_text)
    {                  
        ShaderLoadList.ring.vertex = vertex_text;
        ShaderLoadList.ring.fragment = fragment_text;

        CreateFlatBelt(ringData, vertex_text, fragment_text);
    }
