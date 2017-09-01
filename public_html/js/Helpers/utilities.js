   
    function distanceXY(x0, y0, x1, y1)
    {
        this.dx = x1 - x0;
        this.dy = y1 - y0;

        return Math.sqrt(dx * dx + dy * dy);
    }

    function circlePointCollision(x, y, vec, rad)
    {
        return distanceXY(x, y, vec.x, vec.y) < rad;
    }

    function randomRange(min, max)
    {
        return min + Math.random() * (max - min);
    };

    function frac(f) 
    {
    return f % 1;
    };

    function Normalize(min, max, value)
    {     
         return (value - min) / (max - min);
    };

    function Clamp (value, min, max) 
    {
    return Math.min(Math.max(value, min), max);
    };

    function pointInRect(x, y, p1, p2)
    {
        //x range check
        //y range check
        //if both are true the point is inside the range

        return inRange(x, p1.x, p2.x) &&
               inRange(y, p1.y, p2.y);
    };

    function inRange(value,  min, max)
    {

        //checks the ranges from x1 to x2 , returning true if the point is within range
        //Mathf.min and mathf.Max are used in the case of negetive values

        //Mathf.min is used when value is smallest value
        //instead of just checking value with min
        //and vice versa
        //if max is negetive it will be the smallest value istead
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    };

    function GetMagnitude(vector)
    {
        return Math.sqrt((vector.x * vector.x) + 
                         (vector.y * vector.y) + 
                         (vector.z * vector.z));
    }

    function GetVectorNormalize(vector)
    {
        var mag = GetMagnitude(vector);

        return new THREE.Vector3(vector.x/mag,vector.y/mag,vector.z/mag);
    }

    function DrawOrbit(planet, centre, currTimeD, auScale)
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
	    dashSize: 50,
	    gapSize: 100,
	    linewidth: 1
      }));
      
      return moonorbit;
    }

    function CreateRockyBelt(ringData, centre, currTimeD, auScale, numAstos, 
                                          ringObject, vertex_text, fragment_text, lightpos, list)
    {
        var segmentCount = numAstos;
        var radius = planetSize;

        var spriteMap01 = new THREE.TextureLoader().load( "img/astoriod_01.png" );
        var spriteMap02 = new THREE.TextureLoader().load( "img/astoriod_02.png" );
        var spriteMap03 = new THREE.TextureLoader().load( "img/astoriod_03.png" );
        var spriteMap04 = new THREE.TextureLoader().load( "img/astoriod_04.png" );
        var spriteMap05 = new THREE.TextureLoader().load( "img/astoriod_05.png" );
        var spriteList = [spriteMap01, spriteMap02, spriteMap03, spriteMap04, spriteMap05];

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
        
       var geometry = new THREE.PlaneGeometry( 1 , 1);

        for (var i = 0; i < segmentCount; i++) 
        {  
        var texture = spriteList[Math.round(randomRange(0, spriteList.length - 1))];

        var uniform =
        {
                texture: { type: "t", value: null },
                color: { type: "vf3", value: BlushingSunriseColor[Math.round(randomRange(0, BlushingSunriseColor.length - 1))].RGB },
                lightpos: {type: 'v3', value: lightpos},
        };

       // console.log(THREE.UniformsLib['lights']);

        astoMaterial = new THREE.ShaderMaterial
        ({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'], uniform ]),
        vertexShader: vertex_text,
        fragmentShader: fragment_text,
        lights: true
        });
    
        astoMaterial.uniforms.texture.value = texture;

        var vector = returnOrbitionPosition(ringData, i, false, centre, true);

        var x = vector.x + randomRange(-10, 10);
        var y = vector.y + randomRange(-10, 10);
        var z = vector.z + randomRange(-10, 10);
         
        var asto = new THREE.Mesh( geometry, astoMaterial );
        asto.castShadow = true;
        size = randomRange(4, 12);
        asto.scale.set(size, size, 1);

        var gyro = new THREE.Gyroscope();
        gyro.add(asto);
        gyro.position.set(x,y,z);

        ringObject.add(gyro);
        list.push(asto);
        }
    }

    function orbit(planet, object, centre, currTimeD, auScale , deltaTimeD)
    {
        var vector = returnOrbitionPosition(planet, currTimeD, false, centre);

        object.position.set(vector.x, vector.y, vector.z);

        // Calculate and apply the appropriate axis tilt to the bodies
        // and rotate them around the axis
        var radians = planet["tilt"] * Math.PI / 180; // tilt in radians
        object.rotation.order = 'ZXY';
        object.rotation.x = 0;
        object.rotation.y += (deltaTimeD / planet["period"]) * 2 * Math.PI;
        object.rotation.z = radians;
    }
    
    function RingOrbit(ringData, ringObject, centre, currTimeD, auScale, numAstos, deltaTimeD)
    {
            // Calculate and apply the appropriate axis tilt to the bodies
        // and rotate them around the axis
        var radians = ringData["tilt"] * Math.PI / 180; // tilt in radians
        ringObject.rotation.order = 'ZXY';
        ringObject.rotation.x = radians;
        ringObject.rotation.y += (deltaTimeD / ringData["period"]) * 2 * Math.PI;
        ringObject.rotation.z = radians;
    }

    function getOrbit(ringData)
    {
            // Calculate and apply the appropriate axis tilt to the bodies
        // and rotate them around the axis
        var radians = ringData["tilt"] * Math.PI / 180; // tilt in radians
        var euler = new THREE.Euler(radians,(36 / ringData["period"]) * 2 * Math.PI, radians, 'ZXY');
        return euler;
    }

    function PlanetRotation(Planet, period, tilt, deltaTimeD)
    {
        // Calculate and apply the appropriate axis tilt to the bodies
        // and rotate them around the axis
        var radians = tilt * Math.PI / 180; // tilt in radians
        Planet.rotation.order = 'ZXY';
        Planet.rotation.x = radians;
        Planet.rotation.y += (deltaTimeD / period) * 2 * Math.PI;
        Planet.rotation.z = radians;
    }

    THREE.Object3D.prototype.worldToLocal = function ( vector ) {
        if ( !this.__inverseMatrixWorld ) this.__inverseMatrixWorld = new THREE.Matrix4();
        return  vector.applyMatrix4( this.__inverseMatrixWorld.getInverse( this.matrixWorld ));
    };


    THREE.Object3D.prototype.lookAtWorld = function( vector ) {
    vector = vector.clone();
    this.parent.worldToLocal( vector );
    this.lookAt( vector );
    };


    function RingGeoCreate (ringData, centre, auScale)
    {
        geo = new THREE.Geometry();
        
        var gridY = 27;//numSegs || 10;

        var twopi = 2 * Math.PI;
        var iVer = Math.max(2, gridY);

        var origin = new THREE.Vector3(0,0,0);

        var first, second;

        for(var i = 0; i < (iVer); i++)
        {
            var v1 = returnOrbitionPosition(ringData, i, true, centre, false);
            var v2 = returnOrbitionPosition(ringData, i, false, centre, false);
            var v3 = returnOrbitionPosition(ringData, i + 1, true, centre, false);
            var v4 = returnOrbitionPosition(ringData, i + 1, false, centre, false);
            
            geo.vertices.push(v1);
            geo.vertices.push(v2);
            geo.vertices.push(v4);
            geo.vertices.push(v3);
        }

        for(var i = 0; i < iVer; i++)
        {
            geo.faces.push(new THREE.Face3(i * 4, i * 4 + 1, i * 4 + 2));
            geo.faces.push(new THREE.Face3(i * 4, i * 4 + 2, i * 4 + 3));

            geo.faceVertexUvs[0].push
            (
                [
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 1),
                    new THREE.Vector2(1, 0),
                ]
            );

            geo.faceVertexUvs[0].push
            (
                [
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(0, 0),
                ]
            )
        }

        geo.computeFaceNormals();
        return geo;
    }
 
    //Credit to https://doc.qt.io/qt-5/qtcanvas3d-threejs-planets-planets-js.html
    //very smexy!

    function returnOrbitionPosition(ringData, i, inner, centre, replaceW)
    {
            var a;
            var w2;

            w2 = (replaceW == true) ? ringData.NumAstros/1000 : ringData["w2"];

            if(inner)
            {
                a = (ringData["a3"] + ringData["a4"] * i);
            }
            else
                a = ringData["a1"] + ringData["a2"] * i;
            

             // Calculate the planet orbital elements from the current time in days
            var N =  (ringData["N1"] + ringData["N2"] * i) * Math.PI / 180;
            var iPlanet = (ringData["i1"] + ringData["i2"] * i) * Math.PI / 180;
            var w =  (ringData["w1"] + w2 * i) * Math.PI / 180;
            var e = ringData["e1"] + ringData["e2"] * i;
            var M = (ringData["M1"] + ringData["M2"] * i) * Math.PI / 180;
            var E = M + e * Math.sin(M) * (1.0 + e * Math.cos(M));

            var xv = a * (Math.cos(E) - e);
            var yv = a * (Math.sqrt(1.0 - e * e) * Math.sin(E));
            var v = Math.atan2(yv, xv);

            // Calculate the distance (radius)
            var r = Math.sqrt(xv * xv + yv * yv);

            // From http://www.davidcolarusso.com/astro/
            // Modified to compensate for the right handed coordinate system of OpenGL
            var xh = r * (Math.cos(N) * Math.cos(v + w) - Math.sin(N) * Math.sin(v + w) * Math.cos(iPlanet));
            var zh = -r * (Math.sin(N) * Math.cos(v + w) + Math.cos(N) * Math.sin(v + w) * Math.cos(iPlanet));
            var yh = r * (Math.sin(w + v) * Math.sin(iPlanet));

            // Apply the position offset from the center of orbit to the bodies
            var centerOfOrbit = centre;//objects[planet["centerOfOrbit"]];

            
            var x = centerOfOrbit.position.x + xh * 1000;
            var y = centerOfOrbit.position.y + yh * 1000;
            var z = centerOfOrbit.position.z + zh * 1000;

            return new THREE.Vector3(x,y,z);
    }

