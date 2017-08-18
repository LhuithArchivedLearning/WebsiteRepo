   
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