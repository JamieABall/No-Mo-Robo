/************************************
    Enemy Handler
************************************/
function EnemyHandler() {
	var MAX_ENEMY_COUNT = 10; ///////////////////////////////////////////////////

    
    /************************************
        Enemy
    ************************************/
    function Enemy(id, pos) {
        var _id= id;
        var _sprite = initSprite(pos);
        var _condition = ENEMY_CONDITION;
        var _speed = ENEMY_SPEED;
        var _damage = ENEMY_DAMAGE;
        var _state;

        function initSprite(pos) {
            var ret = new Sprite();
            ret.image = Textures.load("http://i.imgur.com/M3HSmOw.gif");
            ret.width = ENEMY_SPRITE_WIDTH;
            ret.height = ENEMY_SPRITE_HEIGHT;
            ret.x = pos.x;
            ret.y = pos.y;
            ret.index = 5;
            ret.offsetX = -ret.width / 2;
            ret.offsetY = -ret.height / 2;
            world.addChild(ret);
            return ret;
        }
        
        this.id = function() { return _id; };
        this.sprite = function() { return _sprite; };
        this.condition = function() { return _condition; };
        this.modifyCondition = function(delta) { _condition += delta; };
        this.damage = function() { return _damage; };
        
        this.update = function(dt) {
            _sprite.x -= _speed;
        };
        
        this.despawn = function() {
            world.removeChild(_sprite);
        };
        
    }
    /***********************************/

    
    /************************************
        SpawnHandler
    ************************************/
    function SpawnHandler() {
        
        function id() {
            var next;
            if(this.next == undefined || this.next < 0) {
                this.next = 0;
            }
            return this.next++;
        }
        
        function position() {
        	var _spawnPosition = {x:0 ,y:0};//////////////////////////////////////////////////////////
        	var _lane = Math.ceil(Math.rand()*5);
        	
        	_spawnPosition.x = canvas.width;
        	_spawnPosition.y = (canvas.height/2) + (_lane * (canvas.height/10)) + 10; 
        	
            return _spawnPosition;
        }
                
        this.spawn = function() {
            return new Enemy(id(), position());
        };
    }
    /***********************************/
    
    var _enemies = new DList();
    var _spawnHandler = new SpawnHandler();
    
    function clearDead() {
        var dead = new DList();
        
        for(_enemies.moveTo(0); _enemies.getIndex() >= 0; _enemies.moveNext()) {
            var current = _enemies.getElement();
            
            if(current.condition() <= 0) {
                dead.append(_enemies.getIndex());
            }
        }
        
        for(dead.moveTo(0); dead.getIndex() >= 0; dead.moveNext()) {
            _enemies.moveTo(dead.getElement());
            _enemies.getElement().despawn();
            _enemies.remove();
        }
    }
    
    this.enemies = function() { return _enemies.copy(); };
    
    this.update = function(dt) {
        clearDead();
        for(_enemies.moveTo(0); _enemies.getIndex() >= 0; _enemies.moveNext()) {
            _enemies.getElement().update(dt);
        }
        if(_enemies.size() < MAX_ENEMY_COUNT) {
            _enemies.append(_spawnHandler.spawn());
        }
        
    };
}
/***********************************/
