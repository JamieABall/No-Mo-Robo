
function Stage() {
    
    var background = new Sprite();
    background.x = 0;
    background.y = 0;
    background.index = 10;
    background.width = CANVAS_WIDTH;
    background.height = CANVAS_HEIGHT; 
    background.image = Textures.load("http://i.imgur.com/HqFojBs.png");

    var fence = new Sprite();
    fence.x = 0;
    fence.y = CANVAS_HEIGHT/2 - 100;
    fence.index = 9;
    fence.width = CANVAS_WIDTH; 
    fence.image = Textures.load("http://i.imgur.com/pxjoAxj.png");

    /*
    var tempHouse = new Sprite();
    tempHouse.x = 0; 
    tempHouse.y = 10;
    tempHouse.index = 8;
    tempHouse.width = 200;
    tempHouse.height = CANVAS_HEIGHT;
    tempHouse.image = Textures.load("hhttp://i.imgur.com/GjCuaSO.png");
    */

    function Grid(rows, cols, tileSize, tileType) {
        //Inner class for the level which draws each tile individually.
        //i = row #, j = col #
        var Tile = function(i, j, tileSize, tileType) {
            var tileSprite = new Sprite();
            //X.Starting_Position = 1/5 of the canvas width - the offset for the tile Sprite
                    //Then add the length of each tile - that same offset. 
            //Y.Starting_Position = 1/2 of the canvas height + the height of each lane. 
            tileSprite.x = (CANVAS_WIDTH/5 - i*(tileSize*0.2)) + (i*tileSize - j*(tileSize*0.18));
            tileSprite.y = CANVAS_HEIGHT/2 + j*tileSize;
            tileSprite.index = 7;
            tileSprite.width = tileSize;
            tileSprite.height = tileSize;
            tileSprite.image = Textures.load(tileType);
            world.addChild(tileSprite);
           };
        //Number of rows, columns, and the size of each tile.
        this.rows = rows;
        this.cols = cols;
        this.tileSize = tileSize;
        this.tiles = [];
        //Nested for loop initiallized each tile.
        for (var i = 0; i < cols; i++) {
            this.tiles[i] = [];        
            for (var j = 0; j < rows; j++) {
                this.tiles[i][j] = new Tile(i, j, tileSize, tileType);
            }
        }
        
        function findTile(pos){
            var _newPosition = {x: 0, y: 0};
            _newPosition.x = Math.floor((pos.x-100) / ( (3 * CANVAS_HEIGHT) / 50 ));			//Returns a whole number that is the column of the tile. 
            _newPosition.y = Math.floor((pos.y - (CANVAS_HEIGHT / 2)) / CANVAS_HEIGHT/5);		//Returns a whole number that is the row of the tile. 
            
            //(Column Number * Tile Size) + (House offset + ((5 - Lane Number) * Tile Offset))
            _newPosition.x = (_newPosition.x * (CANVAS_HEIGHT / 10)) + (100 + ((5 - _newPosition.y) * CANVAS_HEIGHT / 50)); 
            
            //(Row number * Tile Size) + 1/2 Canvas height
            _newPosition.y = (_newPosition.y * (CANVAS_HEIGHT / 10)) + (CANVAS_HEIGHT/2); 
            return _newPosition;
        }
        
        this.getTile = function(pos){
            if (pos.x > 100 && pos.y >= CANVAS_HEIGHT/2){
                return findTile(pos);
            } else {
                return {x: 0, y: 0};
            }
        };
    };

    
    var _grid;
    
    this.getTile = function(pos) { 
        return _grid.getTile(pos);
    }
    
    function stageInit (){
        var tileType = "http://i.imgur.com/9IqHhrM.png";
        
        world.addChild(background);
        world.addChild(fence);
        //world.addChild(tempHouse);
        _grid = new Grid(5, 15, CANVAS_HEIGHT/10, tileType);
    }
    
    stageInit();
}
