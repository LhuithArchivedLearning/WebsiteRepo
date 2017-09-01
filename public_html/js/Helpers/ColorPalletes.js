var ColorPalletes = [

cloudColors = 
[
    new ColorData (0x000000, new THREE.Color(0, 0, 0)),
    new ColorData (0xffffff, new THREE.Color(255, 255, 255)),
],

lushColors = 
[
    new ColorData (0x008CFF, new THREE.Color( 0, 140, 255   )),
    new ColorData (0x66B3FF, new THREE.Color( 102, 179, 255 )),
    new ColorData (0xFFCC66, new THREE.Color( 255, 204, 102 )),
    new ColorData (0xB1DF8E, new THREE.Color( 177,223,142  )  ),
    new ColorData (0xC99E1D, new THREE.Color( 201, 158, 29 )),
    new ColorData (0xF2F2F2, new THREE.Color( 242, 242, 242)),
],

sandColors =
[
 new ColorData (0xD6CECC, new THREE.Color(214,206,204)),
 new ColorData (0xCCB9B4, new THREE.Color(204,185,180)),
 new ColorData (0xDDBDB0, new THREE.Color(221,189,176 )),
 new ColorData (0xBA8778, new THREE.Color(186,135,120)),
 new ColorData (0x454549, new THREE.Color(69,69,73)),
],

rockColors =
[
 new ColorData (0xE56520, new THREE.Color(229,101,32)),
 new ColorData (0xEA5C0F, new THREE.Color(234,92,15)),
 new ColorData (0xF2F217, new THREE.Color(242,242,23)),
 new ColorData (0x655353, new THREE.Color(101,83,83)),
 new ColorData (0x5C4949, new THREE.Color( 92,73,73)),
 new ColorData (0x493C3C, new THREE.Color(73,60,60)),
 new ColorData (0x3A3232, new THREE.Color( 58,50,50)),
 new ColorData (0x2D2C2C, new THREE.Color( 45,44,44))
],

blackberryColors =
[
 new ColorData (0xDFE9F0, new THREE.Color(223,233,240)),
 new ColorData (0xD6DDF0, new THREE.Color(214,221,240)),
 new ColorData (0xCFC6DD, new THREE.Color(207,198,221)),
 new ColorData (0xC3B2CC, new THREE.Color( 195,178,204)),
 new ColorData (0xB1A0B2, new THREE.Color(177,160,178)),
],


iceColors = 
[
    new ColorData (0xABC1E7, new THREE.Color(171,193,231)),
    new ColorData (0x97B5EA, new THREE.Color(151,181,234)),
    new ColorData (0x879CBF, new THREE.Color(135,156,191)),
    new ColorData (0x7186A9, new THREE.Color( 113,134,169)),
    new ColorData (0x4D6B9F, new THREE.Color(77,107,159)),
],

primordialColors = 
[
 new ColorData (0x4CA4AB, new THREE.Color(76,164,171)),
 new ColorData (0x8DD8CB, new THREE.Color(141,216,203)),
 new ColorData (0xB1FFC6, new THREE.Color(177,255,198)),
 new ColorData (0x7DD488, new THREE.Color(125,212,136)),
 new ColorData (0x40A379, new THREE.Color(64,163,121)),
 new ColorData (0x5C4949, new THREE.Color( 92,73,73)),
 new ColorData (0x493C3C, new THREE.Color(73,60,60)),
 new ColorData (0x3A3232, new THREE.Color( 58,50,50)),
 new ColorData (0x2D2C2C, new THREE.Color( 45,44,44))
],

frozenColors =
[
 new ColorData (0xAFDBF5, new THREE.Color(175,219,245)),
 new ColorData (0x93CDF1, new THREE.Color(147,205,241)),
 new ColorData (0x62AEE7, new THREE.Color(98,174,231)),
 new ColorData (0x4296DC, new THREE.Color(66,150,220)),
 new ColorData (0x2E84CE, new THREE.Color(46,132,206)),
 new ColorData (0xAFDBF5, new THREE.Color(175,219,245)),
 new ColorData (0x93CDF1, new THREE.Color(147,205,241)),
 new ColorData (0x62AEE7, new THREE.Color(98,174,231))
],

punchColors =
[
 new ColorData (0xE5A6AE, new THREE.Color(229,166,174)),
 new ColorData (0xD5B6BE, new THREE.Color(213,182,190)),
 new ColorData (0xC5C6CE, new THREE.Color(197,198,206)),
 new ColorData (0xB5D6DE, new THREE.Color(181,214,222)),
 new ColorData (0xA5E6EE, new THREE.Color(165,230,238)),
],

liqiud_mathaneColors = 
[
 new ColorData (0xAFDBF5, new THREE.Color(175,219,245)),
 new ColorData (0x93CDF1, new THREE.Color(147,205,241)),
 new ColorData (0x62AEE7, new THREE.Color(98,174,231)),
 new ColorData (0x4296DC, new THREE.Color(66,150,220)),

 new ColorData (0x2E84CE, new THREE.Color(46,132,206)),

 new ColorData (0xAFDBF5, new THREE.Color(175,219,245)),
 new ColorData (0x93CDF1, new THREE.Color(147,205,241)),
 new ColorData (0x62AEE7, new THREE.Color(98,174,231)),
 new ColorData (0x4296DC, new THREE.Color(66,150,220)),

 new ColorData (0x2E84CE, new THREE.Color(46,132,206)),

 new ColorData (0xAFDBF5, new THREE.Color(175,219,245)),
 new ColorData (0x93CDF1, new THREE.Color(147,205,241)),
 new ColorData (0x62AEE7, new THREE.Color(98,174,231)),
 new ColorData (0x4296DC, new THREE.Color(66,150,220)),

 new ColorData (0x2E84CE, new THREE.Color(46,132,206)),
],

toxicColors =
[
 new ColorData (0xA0DD8E, new THREE.Color(160,221,142)),
 new ColorData (0xB1DF8E, new THREE.Color(177,223,142)),
 new ColorData (0xC0DF8C, new THREE.Color(192,223,140)),
 new ColorData (0xD6E590, new THREE.Color(214,229,144)),
 new ColorData (0xEAE88E, new THREE.Color(234,232,142)),
],

mintColors = 
[
 new ColorData (0xE5FCC2, new THREE.Color(229, 252, 194)),
 new ColorData (0x9DE0AD, new THREE.Color(157, 224, 173)),
 new ColorData (0x45ADA8, new THREE.Color(69, 173, 168)),
 new ColorData (0x547980, new THREE.Color(84, 121, 128)),
 new ColorData (0x594F4F, new THREE.Color(89, 79, 79)),
],

peachColors = 
[
 new ColorData (0xFFA07A, new THREE.Color(255, 160, 122)),
 new ColorData (0xE9967A, new THREE.Color(233, 150, 122)),
 new ColorData (0xFA8072, new THREE.Color(250, 128, 114)),
 new ColorData (0xF08080, new THREE.Color(240, 128, 128)),
 new ColorData (0xCD5C5C, new THREE.Color(205, 92, 92)),
],

softColors = 
[
 new ColorData (0xBFEAC7, new THREE.Color(191,234,199)),
 new ColorData (0xD3ECCB, new THREE.Color(211,236,203)),
 new ColorData (0xEDF9AF, new THREE.Color(237,249,175)),
 new ColorData (0xFFF2BA, new THREE.Color(255,242,186)),
 new ColorData (0xF4E2CC, new THREE.Color(244,226,204)),
],

azureColors =
[
 new ColorData (0xDB7479, new THREE.Color(219,116,121)),
 new ColorData (0xDBA8D7, new THREE.Color(219,168,215)),
 new ColorData (0xB2A6DB, new THREE.Color(178,166,219)),
 new ColorData (0xA6BBF4, new THREE.Color(166,187,244)),
 new ColorData (0x81B9F9, new THREE.Color(129,185,249)),
],

moonlightColors =
[
 new ColorData (0xA38BF4, new THREE.Color(163,139,244)),
 new ColorData (0x9979D8, new THREE.Color(153,121,216)),
 new ColorData (0x9777B2, new THREE.Color(151,119,178)),
 new ColorData (0x837094, new THREE.Color(131,112,148)),
 new ColorData (0x725A7C, new THREE.Color(114,90,124)),
],

darknessColors = 
[
 new ColorData (0x535CD4, new THREE.Color(83,92,212)),
 new ColorData (0x5B40D2, new THREE.Color(91,64,210)),
 new ColorData (0x3F24B6, new THREE.Color(63,36,182)),
 new ColorData (0x1518B0, new THREE.Color(21,24,176)),
 new ColorData (0x000260, new THREE.Color(0,2,96)),
],

deadrockColors = 
[
new ColorData (0xCCCCCC, new THREE.Color(204,204,204)),
new ColorData (0x8D8D8D, new THREE.Color(141,141,141)),
new ColorData (0x4F4E4E, new THREE.Color(79,78,78)),
new ColorData (0x8D8D8D, new THREE.Color(141,141,141)),
new ColorData (0x242323, new THREE.Color(36,35,35)),
new ColorData (0x2F2E2E, new THREE.Color(47,46,46)),
new ColorData (0x242323, new THREE.Color(36,35,35)),
],

plushColors =
[
    new ColorData (0xC7E2F2, new THREE.Color(199,226,242)),
    new ColorData (0xC7D2F2, new THREE.Color(199,210,242)),
    new ColorData (0xC7C2F2, new THREE.Color(199,194,242)),
    new ColorData (0xC7B2F2, new THREE.Color(199,178,242)),
    new ColorData (0xC7A2F2, new THREE.Color(199,162,242)),
],

royalColors = 
[
    new ColorData (0xEEAD0E, new THREE.Color(238,173,14)),
    new ColorData (0xCD950C, new THREE.Color(205,149,12)),
    new ColorData (0xB8860B, new THREE.Color(184,134,11)),
    new ColorData (0x8B6508, new THREE.Color(139,101,8)),
    new ColorData (0x000033, new THREE.Color(0,0,51)),
],

rustedColors =
[
    new ColorData (0x4E103B, new THREE.Color(78,16,59)),
    new ColorData (0x5E203B, new THREE.Color(94,32,59)),
    new ColorData (0x6E303B, new THREE.Color(110,48,59)),
    new ColorData (0x7E403B, new THREE.Color(126,64,59)),
    new ColorData (0x8E503B, new THREE.Color(142,80,59)),
],

dryColors =
[
    new ColorData (0x4B2C1C, new THREE.Color(75,44,28)),
    new ColorData (0x40250F, new THREE.Color(64,37,15)),
    new ColorData (0x2D1700, new THREE.Color(45,23,0)),
    new ColorData (0x271401, new THREE.Color(39,20,1)),
    new ColorData (0x1E0F00, new THREE.Color(30,15,0)),
],

deepinkColors =
[
new ColorData (0xFD168A, new THREE.Color(253,22,138)),
new ColorData (0xFB007E, new THREE.Color(251,0,126)),
new ColorData (0xD4006B, new THREE.Color(212,0,107)),
new ColorData (0xB41A68, new THREE.Color(180,26,104)),
new ColorData (0x99004D, new THREE.Color(153,0,77))
],

dirtColors = 
[
new ColorData (0x5a554c, new THREE.Color(90,85,76)),
new ColorData (0x767676, new THREE.Color	(118,118,118)),
new ColorData (0x93928c, new THREE.Color(147,146,140)),
new ColorData (0x362d01, new THREE.Color	(54,45,1)),
new ColorData (0x856335, new THREE.Color(133 ,99 ,53)),
],

goldColors = 
[
new ColorData (0xd0ba5f, new THREE.Color(208,186,95)),
new ColorData (0xc7ab52, new THREE.Color(199,171,82)),
new ColorData (0xbd9434, new THREE.Color(189,148,52)),
new ColorData (0xc5a047, new THREE.Color(197,160,71)),
new ColorData (0xd8b45d, new THREE.Color(216,180,93)),
],

//Leprecuan + fire
firecaunColors = 
[
new ColorData (0xbf4d00, new THREE.Color(191,77,0)),
new ColorData (0x922b2b, new THREE.Color(146,43,43)),
new ColorData (0xbf983b, new THREE.Color(191,152,59)),
new ColorData (0x5e7a47, new THREE.Color(94,122,71)),
new ColorData (0x18926a, new THREE.Color(24,146,106)),
],
    
lunaColors = 
[
new ColorData (0xa96fb4, new THREE.Color(169,111,180)),
new ColorData (0x65ccbf, new THREE.Color(101,204,191)),
new ColorData (0x3280c7, new THREE.Color(50,128,199)),
new ColorData (0xc2d4b9, new THREE.Color(194,212,185)),
new ColorData (0xc5a9b6, new THREE.Color(197,169,182)),
],

fearyColors = 
[
new ColorData (0x92e5cc, new THREE.Color(146,229,204)),
new ColorData (0x91d4cc, new THREE.Color(145,212,204)),
new ColorData (0x93c5cd, new THREE.Color(147,197,205)),
new ColorData (0x91b4cd, new THREE.Color(145,180,205)),
new ColorData (0x91a2cb, new THREE.Color(145,162,203)),
],

chocolatColors = 
[
new ColorData (0xe9aa50, new THREE.Color(233,170,80)),
new ColorData (0x2f2521, new THREE.Color(47,37,33)),
new ColorData (0xe9e9e9, new THREE.Color(233,233,233)),
new ColorData (0x090605, new THREE.Color(9,6,5)),
new ColorData (0x45392f, new THREE.Color(69,57,47)),
],

grosscreamColors = 
[
new ColorData (0x717f60, new THREE.Color(113,127,96)),
new ColorData (0xcecece, new THREE.Color(206,206,206)),
new ColorData (0x231e1a, new THREE.Color(35,30,26)),
new ColorData (0xfff3e5, new THREE.Color(255,243,229)),
new ColorData (0xffb5b5, new THREE.Color(255,181,181)),
],

madCloudColors = 
[
new ColorData (0xc4e6ff, new THREE.Color(196,230,255)),
new ColorData (0xe69598, new THREE.Color(230,149,152)),
new ColorData (0xcb2c31, new THREE.Color(203,44,49)),
new ColorData (0x85bdde, new THREE.Color(133,189,222)),
new ColorData (0xccebfb, new THREE.Color(204,235,251)),
],

pastelsColors = 
[
new ColorData (0x1b85b8, new THREE.Color(27,133,184)),
new ColorData (0x5a5255, new THREE.Color(90,82,85)),
new ColorData (0x559e83, new THREE.Color(85,158,131)),
new ColorData (0xae5a41, new THREE.Color(174,90,65)),
new ColorData (0xc3cb71, new THREE.Color(195,203,113)),
],

lightRetroColors = 
[
new ColorData (0xe5c3c6, new THREE.Color(229,195,198)),
new ColorData (0xe1e9b7, new THREE.Color(225,233,183)),
new ColorData (0xf96161, new THREE.Color(249,97,97)),
new ColorData (0xbcd2d0, new THREE.Color(188,210,208)),
new ColorData (0xd0b783, new THREE.Color(208,183,131)),
],

shartNebulaColors = 
[
new ColorData (0xFFCF77, new THREE.Color(255,207,119)),
new ColorData (0xE7EB90, new THREE.Color(231,235,144)),
new ColorData (0xFADF63, new THREE.Color(250,223,99)),
new ColorData (0xE6AF2E, new THREE.Color(230,175,46)),
new ColorData (0x241012, new THREE.Color(36,16,18)),
],

littleMouseColors = 
[
new ColorData (0x04BFBF, new THREE.Color(4,191,191)),
new ColorData (0xCAFCD8, new THREE.Color(202,252,216)),
new ColorData (0xF7E967, new THREE.Color(247,233,103)),
new ColorData (0xA9CF54, new THREE.Color(169,207,84)),
new ColorData (0x588F27, new THREE.Color(88,143,39)),
],

pudgyCamelColors = 
[
new ColorData (0xfdd9d2, new THREE.Color(253,217,210)),
new ColorData (0x9ad6e3, new THREE.Color(154,214,227)),
new ColorData (0x89e8e1, new THREE.Color(137,232,225)),
new ColorData (0xbfefff, new THREE.Color(191,239,255)),
new ColorData (0xf8e6e4, new THREE.Color(248,230,228)),
],

//Michael
ZaprothColor = 
[
new ColorData (0xbfefff, new THREE.Color(191,239,255)),
new ColorData (0xc39679, new THREE.Color(195,150,121)),
new ColorData (0xF6A3A3, new THREE.Color(246,163,163)),
new ColorData (0x6f1f19, new THREE.Color(111,31,25)),
new ColorData (0x4a708b, new THREE.Color(74,112,139)),
],

BlushingSunriseColor = 
[
new ColorData (0xe1f7d5, new THREE.Color(225,247,213)),
new ColorData (0xffbdbd, new THREE.Color(255,189,189)),
new ColorData (0xc9c9ff, new THREE.Color(201,201,255)),
new ColorData (0xffffff, new THREE.Color(255,255,255)),
new ColorData (0xf1cbff, new THREE.Color(241,203,255)),
]

];

//Credit to Pimp Trizkit : https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeRGBColor(color, percent) 
{
    var t= percent < 0 ? 0 : 255;
    var p= percent < 0 ?percent*-1:percent;

    var R = color.x;
    var G = color.y;
    var B = color.z;

    return new THREE.Color(
        (Math.round((t-R)*p)+R),
        (Math.round((t-G)*p)+G), 
        (Math.round((t-B)*p)+B));
}

function shadeHEXColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    
    return "0x"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function shade(color, percent)
{
    if (color.length > 7 ) return shadeRGBColor(color,percent);
    else return shadeColor2(color,percent);
}

function ColorData(hex, RGB)
{
    this.hex = hex;
    this.RGB = RGB;
};


