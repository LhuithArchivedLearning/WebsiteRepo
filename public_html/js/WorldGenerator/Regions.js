function regionRoll ()
{
    var roll = (randomRange(0, 22));
    var NewRegion;

    if(roll >= 0)
    {
        NewRegion = water;
    }
    if(roll >= 2)
    {
        NewRegion = sand;
    }
    if(roll >= 3)
    {
        NewRegion = rock;
    }
     if(roll >= 4)
    {
        NewRegion = blackberry;
    }
     if(roll >= 5)
    {
        NewRegion = ice;
    }
     if(roll >= 6)
    {
        NewRegion = primordial;
    }
     if(roll >= 7)
    {
        NewRegion = frozen;
    }
     if(roll >= 8)
    {
        NewRegion = punch;
    }
     if(roll >= 9)
    {
        NewRegion = liqiud_mathane;
    }
     if(roll >= 10)
    {
        NewRegion = toxic;
    }
     if(roll >= 11)
    {
        NewRegion = mint;
    }
     if(roll >= 12)
    {
        NewRegion = peach;
    }
     if(roll >= 13)
    {
        NewRegion = soft;
    }
     if(roll >= 14)
    {
        NewRegion = azure;
    }
     if(roll >= 15)
    {
        NewRegion = moonlight;
    }
     if(roll >= 16)
    {
        NewRegion = darkness;
    }
     if(roll >= 17)
    {
        NewRegion = deadrock;
    }
     if(roll >= 18)
    {
        NewRegion = plush;
    }
     if(roll >= 19)
    {
        NewRegion = royal;
    }
     if(roll >= 20)
    {
        NewRegion = rusted;
    }
     if(roll >= 21)
    {
        NewRegion = deepink;
    } 

    return NewRegion;
}



var water = 
[
 new TerrainType("water deep", 0, new THREE.Color(0, 140, 255)),
 new TerrainType("water shallow", 0.51, new THREE.Color(102, 179, 255)),
 new TerrainType("sand", .56, new THREE.Color( 255, 204, 102 )),
 new TerrainType("grass", .6, new THREE.Color( 177,223,142)),
 new TerrainType("rocky", .75, new THREE.Color( 201, 158, 29)),
 new TerrainType("snowy", .83, new THREE.Color( 242, 242, 242))
]
;

var sand = 
[
 new TerrainType("sand deep", 0, new THREE.Color(214,206,204)),
 new TerrainType("water shallow", 0.21, new THREE.Color(204,185,180)),
 new TerrainType("sand", .4, new THREE.Color(221,189,176 )),
 new TerrainType("grass", .6, new THREE.Color( 186,135,120)),
 new TerrainType("rocky", .75, new THREE.Color(69,69,73)),
]
;

var rock = 
[
 new TerrainType("water deep", 0, new THREE.Color(229,101,32)),
 new TerrainType("water deep", 0.1, new THREE.Color(234,92,15)),
 new TerrainType("water deep", 0.2, new THREE.Color(242,242,23)),
 new TerrainType("water shallow", 0.3, new THREE.Color(101,83,83)),
 new TerrainType("sand", .56, new THREE.Color( 92,73,73)),
 new TerrainType("grass", .6, new THREE.Color(73,60,60)),
 new TerrainType("rocky", .75, new THREE.Color( 58,50,50)),
 new TerrainType("snowy", .83, new THREE.Color( 45,44,44))
]
;

var blackberry = 
[
 new TerrainType("sand deep", 0, new THREE.Color(223,233,240)),
 new TerrainType("water shallow", 0.05, new THREE.Color(214,221,240)),
 new TerrainType("sand", .4, new THREE.Color(207,198,221)),
 new TerrainType("grass", .6, new THREE.Color( 195,178,204)),
 new TerrainType("rocky", .75, new THREE.Color(177,160,178)),
]
;

var ice = 
[
 new TerrainType("sand deep", 0, new THREE.Color(171,193,231)),
 new TerrainType("water shallow", 0.1, new THREE.Color(151,181,234)),
 new TerrainType("sand", .7, new THREE.Color(135,156,191)),
 new TerrainType("grass", .8, new THREE.Color( 113,134,169)),
 new TerrainType("rocky", .9, new THREE.Color(77,107,159)),
]
;

var primordial = 
[
 new TerrainType("sand deep", 0, new THREE.Color(76,164,171)),
 new TerrainType("water shallow", 0.35, new THREE.Color(141,216,203)),
 new TerrainType("sand", .45, new THREE.Color(177,255,198)),
 new TerrainType("grass", .48, new THREE.Color(125,212,136)),
 new TerrainType("rocky", .52, new THREE.Color(64,163,121)),
 new TerrainType("sand", .56, new THREE.Color( 92,73,73)),
 new TerrainType("grass", .6, new THREE.Color(73,60,60)),
 new TerrainType("rocky", .75, new THREE.Color( 58,50,50)),
 new TerrainType("snowy", .83, new THREE.Color( 45,44,44))
]
;

var frozen = 
[
 new TerrainType("water deep", 0, new THREE.Color(175,219,245)),
 new TerrainType("water shallow", 0.12, new THREE.Color(147,205,241)),
 new TerrainType("sand", .23, new THREE.Color(98,174,231)),
 new TerrainType("grass", .34, new THREE.Color(66,150,220)),
 new TerrainType("rocky", .56, new THREE.Color(46,132,206)),
  new TerrainType("water deep", 0.6, new THREE.Color(175,219,245)),
   new TerrainType("water shallow", 0.63, new THREE.Color(147,205,241)),
    new TerrainType("sand", .9, new THREE.Color(98,174,231))
]
;

var punch = 
[
 new TerrainType("water deep", 0, new THREE.Color(229,166,174)),
 new TerrainType("water shallow", 0.52, new THREE.Color(213,182,190)),
 new TerrainType("sand", .63, new THREE.Color(197,198,206)),
 new TerrainType("grass", .64, new THREE.Color(181,214,222)),
 new TerrainType("rocky", .66, new THREE.Color(165,230,238)),
]
;

var liqiud_mathane = 
[
 new TerrainType("ring", 0, new THREE.Color(175,219,245)),
 new TerrainType("ring2", 0.025, new THREE.Color(147,205,241)),
new TerrainType("ring2", 0.05, new THREE.Color(98,174,231)),
new TerrainType("ring2", 0.075, new THREE.Color(66,150,220)),

 new TerrainType("ring", 0.2, new THREE.Color(46,132,206)),

 new TerrainType("ring", 0.4, new THREE.Color(175,219,245)),
 new TerrainType("ring2", 0.425, new THREE.Color(147,205,241)),
new TerrainType("ring2", 0.45, new THREE.Color(98,174,231)),
new TerrainType("ring2", 0.475, new THREE.Color(66,150,220)),

 new TerrainType("ring", 0.5, new THREE.Color(46,132,206)),

 new TerrainType("ring", 0.6, new THREE.Color(175,219,245)),
 new TerrainType("ring2", 0.625, new THREE.Color(147,205,241)),
new TerrainType("ring2", 0.65, new THREE.Color(98,174,231)),
new TerrainType("ring2", 0.675, new THREE.Color(66,150,220)),

 new TerrainType("ring", 0.9, new THREE.Color(46,132,206)),
]
;

var toxic = 
[
 new TerrainType("water deep", 0, new THREE.Color(160,221,142)),
 new TerrainType("water shallow", 0.22, new THREE.Color(177,223,142)),
 new TerrainType("sand", .33, new THREE.Color(192,223,140)),
 new TerrainType("grass", .54, new THREE.Color(214,229,144)),
 new TerrainType("rocky", .66, new THREE.Color(234,232,142)),
]
;

var mint = 
[
 new TerrainType("water deep", 0, new THREE.Color(229, 252, 194)),
 new TerrainType("water shallow", 0.22, new THREE.Color(157, 224, 173)),
 new TerrainType("sand", .33, new THREE.Color(69, 173, 168)),
 new TerrainType("grass", .44, new THREE.Color(84, 121, 128)),
 new TerrainType("rocky", .76, new THREE.Color(89, 79, 79)),
]
;

var peach = 
[
 new TerrainType("water deep", 0, new THREE.Color(255, 160, 122)),
 new TerrainType("water shallow", 0.22, new THREE.Color(233, 150, 122)),
 new TerrainType("sand", .33, new THREE.Color(250, 128, 114)),
 new TerrainType("grass", .44, new THREE.Color(240, 128, 128)),
 new TerrainType("rocky", .76, new THREE.Color(205, 92, 92)),
]
;

var soft = 
[
 new TerrainType("water deep", 0, new THREE.Color(191,234,199)),
 new TerrainType("water shallow", 0.22, new THREE.Color(211,236,203)),
 new TerrainType("sand", .33, new THREE.Color(237,249,175)),
 new TerrainType("grass", .44, new THREE.Color(255,242,186)),
 new TerrainType("rocky", .56, new THREE.Color(244,226,204)),
]
;

var azure = 
[
 new TerrainType("water deep", 0, new THREE.Color(219,116,121)),
 new TerrainType("water shallow", 0.22, new THREE.Color(219,168,215)),
 new TerrainType("sand", .33, new THREE.Color(178,166,219)),
 new TerrainType("grass", .44, new THREE.Color(166,187,244)),
 new TerrainType("rocky", .56, new THREE.Color(129,185,249)),
]
;

var moonlight = 
[
 new TerrainType("water deep", 0, new THREE.Color(163,139,244)),
 new TerrainType("water shallow", 0.22, new THREE.Color(153,121,216)),
 new TerrainType("sand", .33, new THREE.Color(151,119,178)),
 new TerrainType("grass", .44, new THREE.Color(131,112,148)),
 new TerrainType("rocky", .56, new THREE.Color(114,90,124)),
]
;

var darkness = 
[
 new TerrainType("water deep", 0, new THREE.Color(83,92,212)),
 new TerrainType("water shallow", 0.22, new THREE.Color(91,64,210)),
 new TerrainType("sand", .33, new THREE.Color(63,36,182)),
 new TerrainType("grass", .44, new THREE.Color(21,24,176)),
 new TerrainType("rocky", .56, new THREE.Color(0,2,96)),
]
;
var deadrock = 
[
 new TerrainType("water deep", 0, new THREE.Color(204,204,204)),
 new TerrainType("water shallow", 0.1, new THREE.Color(141,141,141)),
 new TerrainType("sand", .53, new THREE.Color(79,78,78)),
 new TerrainType("water shallow", 0.74, new THREE.Color(141,141,141)),
 new TerrainType("rocky", .75, new THREE.Color(36,35,35)),
 new TerrainType("grass", .77, new THREE.Color(47,46,46)),
 new TerrainType("rocky", .9, new THREE.Color(36,35,35)),
]
;

var plush = 
[
 new TerrainType("water deep", 0, new THREE.Color(199,226,242)),
 new TerrainType("water shallow", 0.1, new THREE.Color(199,210,242)),
 new TerrainType("sand", .53, new THREE.Color(199,194,242)),
 new TerrainType("water shallow", 0.74, new THREE.Color(199,178,242)),
 new TerrainType("rocky", .75, new THREE.Color(199,162,242)),
]
;

var royal = 
[
 new TerrainType("water deep", 0, new THREE.Color(238,173,14)),
 new TerrainType("water shallow", 0.1, new THREE.Color(205,149,12)),
 new TerrainType("sand", .53, new THREE.Color(184,134,11)),
 new TerrainType("water shallow", 0.74, new THREE.Color(139,101,8)),
 new TerrainType("rocky", .75, new THREE.Color(0,0,51)),
]
;

var rusted = 
[
 new TerrainType("water deep", 0, new THREE.Color(78,16,59)),
 new TerrainType("water shallow", 0.1, new THREE.Color(94,32,59)),
 new TerrainType("sand", .53, new THREE.Color(110,48,59)),
 new TerrainType("water shallow", 0.74, new THREE.Color(126,64,59)),
 new TerrainType("rocky", .75, new THREE.Color(142,80,59)),
]
;

var dry = 
[
 new TerrainType("water deep", 0, new THREE.Color(75,44,28)),
 new TerrainType("water shallow", 0.1, new THREE.Color(64,37,15)),
 new TerrainType("sand", .53, new THREE.Color(45,23,0)),
 new TerrainType("water shallow", 0.74, new THREE.Color(39,20,1)),
 new TerrainType("rocky", .75, new THREE.Color(30,15,0)),
]
;

var deepink = 
[
 new TerrainType("water deep", 0, new THREE.Color(253,22,138)),
 new TerrainType("water shallow", 0.1, new THREE.Color(251,0,126)),
 new TerrainType("sand", .53, new THREE.Color(212,0,107)),
 new TerrainType("water shallow", 0.74, new THREE.Color(180,26,104)),
 new TerrainType("rocky", .75, new THREE.Color(153,0,77)),
]
;