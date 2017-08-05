   
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