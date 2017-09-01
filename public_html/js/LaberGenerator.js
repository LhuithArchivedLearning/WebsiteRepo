//Credit to : https://codepen.io/brandonisgreen/pen/Khibx
    function createTextLabel() 
    {

    var div = document.createElement('div');
    div.className = 'text-label';
    div.style.position = 'absolute';
    div.style.width = 100;
    div.style.color = "#ffffff";
    div.style.height = 100;
    div.innerHTML = "hi there!";
    div.style.top = -1000;
    div.style.left = -1000;
    div.style.fontSize = "50px";
    var _this = this;
    
    return {
      element: div,
      parent: false,
      position: new THREE.Vector3(0,0,0),
      setHTML: function(html)
       {
        this.element.innerHTML = html;
      },
      setParent: function(threejsobj) {
        this.parent = threejsobj;
      },
      updatePosition: function(size, isPlanet) {
        if(parent) 
        {
            if(isPlanet)
                {
           this.position.x = this.parent.position.x - this.element.clientWidth/2;
           this.position.y = this.parent.position.y + size + 55;
                }
        else
            {
            this.position.x = this.parent.position.x;
           this.position.y = this.parent.position.y + size + 25;  
            }
        
          //this.position.copy(this.parent.position);
        }       
        var coords2d = this.get2DCoords(this.position, _this.camera);
        this.element.style.left = coords2d.x + 'px';
        this.element.style.top = coords2d.y + 'px';
      },
      get2DCoords: function(position, camera) {
        var vector = position.project(camera);
        vector.x = (vector.x + 1)/2 * window.innerWidth;
        vector.y = -(vector.y - 1)/2 * window.innerHeight;
        return vector;
      }
    };
  }
