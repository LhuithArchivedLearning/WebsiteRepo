function regionRoll (isclouds)
{
    if(!isclouds)
        {
            var diceroll = Math.round((randomRange(0, 100)));

            var NewRegion;
            NewRegion = lush;
        }
        else
           NewRegion = cloud; 
    
    CreateRegion();
    NewRegion.isGassy = SortGassyBools(NewRegion);

    return NewRegion;
}


function CreateRegion()
{
    var numRegions = randomRange(5,5); // Expand later
    var data = [];
    var colors = [];


    for(var i = 0; i < numRegions; i++)
    {
        data.push
        (
            new TerrainType("base", 0) //Water be here
        )
    }

    console.log(data);
    var newRegion = RegionInformation
    (
        colors , data ,
        0, 0, true, colors.toString(), 0
    );
}


function SortGassyBools(NewRegion)
{
    var bool;

    if(NewRegion.isGassy == 3)
        {
            var roll = randomRange(0, 10);

            if(roll >= 6)
            {
                bool = true;
            }
            else
            {
                bool = false;
            }
  
        }
        else if(NewRegion.isGassy == 0)
        {
            bool = false;
        }
        else if(NewRegion.isGassy == 1)
        {
            bool = true;
        }

        return bool;
}

function RegionInformation(ColorPallette, Data, atmoSize, atmoThickness, hasLiquad, name, isGassy)
{
    this.ColorPallette = ColorPallette;
    this.Data = Data;
    this.atmoSize = atmoSize;
    this.atmoThickness = atmoThickness;
    this.hasLiquad = hasLiquad;
    this.name = name;
    this.isGassy = isGassy;
}


//Customs Boimes
var cloud = new RegionInformation(
    cloudColors,
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", 0.5)
], 
0, 0, true, "cloud", 0
)
;


var lush = new RegionInformation(
    lushColors,
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", 0.51),
 new TerrainType("sand", .56),
 new TerrainType("grass", .6),
 new TerrainType("rocky", .75),
 new TerrainType("snowy", .83),
], 0, 0, true, "lush", 0
)
;

var rock = new RegionInformation(
    rockColors,
[
 new TerrainType("water deep", 0),
 new TerrainType("water deep", 0.1),
 new TerrainType("water deep", 0.2),
 new TerrainType("water shallow", 0.3),
 new TerrainType("sand", .56),
 new TerrainType("grass", .6),
 new TerrainType("rocky", .75),
 new TerrainType("snowy", .83)
], 0, 0, true, "rock", 0
)
;

var primordial = new RegionInformation(
    primordialColors,
[
 new TerrainType("sand deep", 0),
 new TerrainType("water shallow", 0.35),
 new TerrainType("sand", .45),
 new TerrainType("grass", .48),
 new TerrainType("rocky", .52),
 new TerrainType("sand", .56),
 new TerrainType("grass", .6),
 new TerrainType("rocky", .75),
 new TerrainType("snowy", .83),
], 0, 0, true,"primordial", 0
)
;

var frozen = new RegionInformation(
    frozenColors,
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", .12),
 new TerrainType("sand", .23),
 new TerrainType("grass", .34),
 new TerrainType("rocky", .56),
 new TerrainType("water deep", .64),
 new TerrainType("water shallow", .75),
 new TerrainType("sand", .9),
], 0, 0, true,"frozen", 3
)
;

var liqiud_mathane = new RegionInformation(
    liqiud_mathaneColors,
[
new TerrainType("ring", 0),
new TerrainType("ring2", 0.025),
new TerrainType("ring2", 0.05),
new TerrainType("ring2", 0.075),
new TerrainType("ring", 0.2),
new TerrainType("ring", 0.4),
new TerrainType("ring2", 0.425),
new TerrainType("ring2", 0.45),
new TerrainType("ring2", 0.475),
new TerrainType("ring", 0.5),
new TerrainType("ring", 0.6),
new TerrainType("ring2", 0.625),
new TerrainType("ring2", 0.65),
new TerrainType("ring2", 0.675),
new TerrainType("ring", 0.9),
], 0, 0, true,"liqiud_mathane", 1
)
;

var deadrock =  new RegionInformation(
    deadrockColors,
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", 0.1),
 new TerrainType("sand", .53),
 new TerrainType("water shallow"),
 new TerrainType("rocky", .75),
 new TerrainType("grass", .77),
 new TerrainType("rocky", .9),
],
0, 0, true,"deadrock", 0
)
;
