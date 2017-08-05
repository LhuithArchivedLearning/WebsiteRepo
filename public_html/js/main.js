   
	var container, stats, resolution, map;
	var camera, scene, renderer, clock, planet, moon, moonAxis;
    var inPlanet, gui, moonData;
    var planetSize, moonSize, outline, testpoint;

    var x,y,z, controls;

    // Custom global variables
    var mouse = {x: 0, y: 0};

    var octaves = 5; 
    var persistance; 
    var lacunarity = 2.05; 
    var seed = 1;
    var noiseScale = 100; 
    var offset = {x:0, y:0};
    var textureSize = 256;

	init();
	animate();
	
        function init()
        {    
            CalculateParametres();
            
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

     moonData = 
     {
        radius: 100.5424, tilt: 28.32, N1: 125.1228, N2: -0.0529538083,
        i1: 15.1454, i2: 1, w1: 1.0634, w2: 0.1643573223,
        a1: 0.273, a2: 0, e1: 0.054900, e2: 0,
        M1: 115.3654, M2: 13.0649929509, period: 1.321582,
     };

        //Creates empty scene object and renderers
            resolution = 3;
            planetSize = 100;
            moonSize = 20;

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

        createPlanet(true);

        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( window.innerWidth / resolution, window.innerHeight / resolution );
        renderer.setClearColor( 0x000000, 1);
        renderer.domElement.id = "Poo Poo";

        container.appendChild( renderer.domElement );               
        
        renderer.domElement.style.width = renderer.domElement.width * resolution + 'px';
        renderer.domElement.style.height = renderer.domElement.height * resolution + 'px';

        //Add Controls
        //controls = new THREE.OrbitControls(camera, renderer.domElement);
        //controls.addEventListener("change", render);
        //

        var gridHelper = new THREE.GridHelper( 1000, 20 );
        //scene.add( gridHelper );
        
        testpointMat = new THREE.MeshBasicMaterial({
        transparent: false,
        color: 0x8c8c8c,
        });
        
        var axisHelper = new THREE.AxisHelper( 5 );
        //scene.add( axisHelper )

         moonAxis = new THREE.Vector3(0,1,0);//tilted a bit on x and y
    
        // When the mouse moves, call the given function
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mousedown', MouseDown, true);     
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
        }
        dat.GUI.toggleHide();

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
        requestAnimationFrame(animate);
        var delta = clock.getDelta(); 
        var curtime;
        curtime += delta;

        planet.rotation.y += 0.002;
        
        orbit(moonData, moon, planet, clock.getElapsedTime(), 1000, delta*25);
    
         if (inPlanet) 
        {
                     outline.traverse ( function (child) {
        if (child instanceof THREE.Line) {
            child.visible = true;
            }
        });
        }
        else
        {
              outline.traverse ( function (child) {
        if (child instanceof THREE.Line) {
            child.visible = false;
            }
        });
        }

        var axis = new THREE.Vector3(0.5,0.5,0);

	    input();
        render();
    }

    
    function input()
    {
        MouseInPlanet(planet.position, planetSize);
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
             console.log(persistance);
    }

    function MouseInPlanet(object, rad)
    {
        //Setting Object to screen position

        var vector = new THREE.Vector2();

       vector.x = object.x;
       vector.y = object.y;

        vector.x = Math.round(  vector.x + window.innerWidth  / 2 );
        vector.y = Math.round( - vector.y + window.innerHeight / 2 );

        if(circlePointCollision(mouse.x, mouse.y, new THREE.Vector2(vector.x, vector.y), rad))
        {
           inPlanet = true;
        }
        else
        {
           inPlanet = false;
        }
    }

    function Rotate(rotation, point)
    {
        var radX = rotation.x;
        var radY = rotation.y;
        var radZ = rotation.z;

        var sinX = Math.sin(radX);
        var cosX = Math.cos(radX);

        var sinY = Math.sin(radY);
        var cosY = Math.cos(radY);

        var sinZ = Math.sin(radZ);
        var cosZ = Math.cos(radZ);

        var xAxis = new THREE.Vector3
        (
                cosY * cosZ,
                cosX * sinZ + sinX * sinY * cosZ,
                sinX * sinZ - cosX * sinY * cosZ
        );

        var yAxis = new THREE.Vector3
        (
            -cosY * sinZ,
                cosX * cosZ - sinX * sinY * sinZ,
                sinX * cosZ + cosX * sinY * sinZ
        );

        var zAxis = new THREE.Vector3
        (
                sinY,
            -sinX * cosY,
                cosX * cosY
        );

        var newxAxis = new THREE.Vector3(xAxis.x * point.x, xAxis.y * point.x, xAxis.z * point.x);

        var newyAxis = new THREE.Vector3(yAxis.x * point.y, yAxis.y * point.y, yAxis.z * point.y);

        var newzAxis = new THREE.Vector3(zAxis.x * point.z, zAxis.y * point.z, zAxis.z * point.z);

        return  new THREE.Vector3( newxAxis.x + newyAxis.x + newzAxis.x, 
                                   newxAxis.y + newyAxis.y + newzAxis.y, 
                                   newxAxis.z + newyAxis.z + newzAxis.z);
    }
    
    function RotateVectorAroundAxisAngle(n, a, v)
    {
        //a is theta
        var vdotN = v.dot(n);
        var vaCos = n.addScalar(1-Math.cos(a));
        var nxv = n.cross(v);

        var vCos = v.addScalar(Math.cos(a));
        var vaCosVdotN = vaCos.addScalar(vdotN);
        var nxvsinCos = nxv.addScalar(Math.sin(a));

        var vCosAdd = vCos.add(vaCosVdotN);
        return vCosAdd.add(nxvsinCos);
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

    function MouseDown (event)
     {
        event.preventDefault();   
                  
        if (inPlanet) 
        {
            switch ( event.button ) 
            {
            case 0: // left
                //window.location.href= "index.html";
                createPlanet(false);
                break;
            case 1: // middle
                break;
            case 2: // right
                break;
            }
        }

    };

    function CalculateParametres()
    {
        persistance = randomRange(0.35, 1.55);
    }

    function createPlanet(init)
    {
        if(!init)
        {
            scene.remove(planet);
            scene.remove(moon);
            scene.remove(outline);
            CalculateParametres();
        }

            var segmentCount = 32,
            radius = 99,
            geometry = new THREE.Geometry(),
            material = new THREE.LineBasicMaterial({ color: 0xff3385 });
   

            for (var i = 0; i < segmentCount; i++) 
            {
                var theta = (i / segmentCount) * Math.PI * 2;
                geometry.vertices.push(
                new THREE.Vector3(
                Math.cos(theta) * radius,
                Math.sin(theta) * radius, 0));            
            }

            outline = new THREE.Line(geometry, material)
            outline.position.z = camera.position.z - 25;
            
            if(!scene.getObjectByName('outline')) scene.add(outline);

        
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
  
        // instantiate a loader
        var loader = new THREE.TextureLoader();

        loader.crossOrigin = '';

        var geometry = new THREE.SphereGeometry(planetSize, 32, 32 );
        planet = new THREE.Mesh( geometry, dataMaterial );
        scene.add(planet);
        

        var moonMat = new THREE.MeshBasicMaterial({
        transparent: false,
        color: 0x8c8c8c,
        });      
        moon = new THREE.Mesh( new THREE.SphereGeometry(moonSize, 12, Math.PI * 2 ), moonMat );
        scene.add(moon);
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