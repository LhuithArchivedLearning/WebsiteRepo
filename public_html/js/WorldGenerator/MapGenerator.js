 
   function MapGenerator (octaves, persistance, lacunarity, seed, noiseScale, offset, size, isclouds)
    {
        var noiseMap2D = GenerateNoise2DMap(size, size, seed, noiseScale, octaves, persistance, lacunarity, offset);
        var noiseMap1D = GenerateNoise1DMap(size, size, seed, noiseScale, octaves, persistance, lacunarity, offset);
        
        var falloffMap = GenerateFalloffMap(size);
        var colorMap = new Array();
        var clampedMap = new Array();
        var regions;
        var colors;

        
                regions = regionRoll(isclouds);
        colors = regions.ColorPallette;
        
        for(var x = 0; x < size; x++)
         {
              clampedMap[x] = new Array();

            for(var y = 0; y < size; y++)
            {
                clampedMap[x][y] = 0;
            }
        }

        for(var y = 0; y < size; y++)
        {
            for(var x = 0; x < size; x++)
            {
                if(regions.isGassy)
                {
                    clampedMap[x][y] = Clamp(noiseMap1D[x][y] - falloffMap[x][y], 0, 1);
                }
                else
                {
                    clampedMap[x][y] = Clamp(noiseMap2D[x][y] - falloffMap[x][y], 0, 1);
                }
                //clampedMap[x, y] = (noiseMap[x][y]);
            }
        }

        for(var y = 0; y < size; y++)
        {          
            for(var x = 0; x < size; x++)
            {
                var currentHeight = clampedMap[x][y];
          
                for(var i = 0; i < regions.Data.length; i++)
                {
                   
                    if(currentHeight >= regions.Data[i].height)
                    {
                        colorMap[y * size + x] = regions.ColorPallette[i].RGB;     
                    }
                    else
                    {   
                        break;
                    }
                }
            }
        }
        
        var finalmap = new Array(colorMap.length * 3);
 
        for(var i = 0; i < finalmap.length; i+=3)
            {

                finalmap[i] =      colorMap[i / 3].r;
                finalmap[i + 1] =  colorMap[i / 3].g;
                finalmap[i + 2] =  colorMap[i / 3].b;

            } 
       return new PlanetInformation(finalmap, false, false, colors);
    };

function PlanetInformation(map, hasAtmo, hasLiquad, colors)
{
    this.map = map;
    this.hasAtmo = hasAtmo;
    this.hasLiquad = hasLiquad;
    this.colors = colors;
}

function TerrainType(name, height)
{
	 this.name = name;
	 this.height = height;
};


function Clamp (value, min, max) 
{
  return Math.min(Math.max(value, min), max);
};
