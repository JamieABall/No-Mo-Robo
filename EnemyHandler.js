/************************************
    Enemy Handler
************************************/
function EnemyHandler() {
    
    /************************************
        Enemy
    ************************************/
    function Enemy(id, pos) {
        var _id = id;
        var _pos = pos;
        // makeByType(?);
        var _sprite = initSprite(pos);
        var _condition = ENEMY_CONDITION;
        var _speed = ENEMY_SPEED;
        var _damage = ENEMY_DAMAGE;
        var _state;

        function initSprite(pos) {
            var ret = new Sprite();
            ret.image = Textures.load(ENEMY_SPRITE_SRC);
            ret.index = 5;
            ret.width = ENEMY_SPRITE_WIDTH;
            ret.height = ENEMY_SPRITE_HEIGHT;
            ret.x = pos.x;
            ret.y = pos.y;
            ret.offsetX = -ret.width / 2;
            ret.offsetY = -ret.height / 2;
            world.addChild(ret);
            return ret;
        }
        
        this.id = function() { return _id; }
        this.sprite = function() { return _sprite; }
        this.condition = function() { return _condition; }
        this.modifyCondition = function(delta) { _condition += delta; }
        this.damage = function() { return _damage; }
        
        function makeByType(type)
        {
            switch(type)
            {
                case 1:
                    _sprite.image = Textures.load(ROBOT_SPRITE_SRC);
                    break;
                case 2:
                    _sprite.image = Textures.load(HEAVYBOT_SPRITE_SRC);
                    _speed = ENEMY_SPEED * 0.5;
                    _condition = ENEMY_CONDITON + 30;
                    _damage = ENEMY_DAMAGE * 2;
                    break;
                case 3:
                    _sprite.image = Textures.load(SPEEDBOT_SPRITE_SRC);
                    _speed = ENEMY_SPEED + 0.5;
                    _damage = ENEMY_DAMAGE * 0.5;
                    break;
               default:
                   return;
            }
        }
        
        this.update = function(dt) {
            if(_sprite.x > 115) {
                _sprite.x -= _speed * dt;
            }
        }
        
        this.despawn = function() {
            world.removeChild(_sprite);
        }
        
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
            var spawnPos = { x: 0, y: 0 };
            var lane = Math.ceil(Math.random() * 5);
            
            spawnPos.x = CANVAS_WIDTH;
            spawnPos.y = CANVAS_HEIGHT / 2 + lane * LANE_HEIGHT - 5;
            
            return spawnPos;
        }
        
        this.spawn = function() {
            return new Enemy(id(), position());
        }
    }
    /***********************************/
    
    
    /************************************
        Controller
    ************************************/
    function Controller() {
    
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
            _enemies.moveTo(dead.getElement())
            _enemies.getElement().despawn();
            _enemies.remove();
        }
    }
    
    this.enemies = function() { return _enemies.copy(); }
    
    this.update = function(dt) {
        clearDead();
        for(_enemies.moveTo(0); _enemies.getIndex() >= 0; _enemies.moveNext()) {
            _enemies.getElement().update(dt);
        }
        if(_enemies.size() < MAX_ENEMY_COUNT) {
            _enemies.append(_spawnHandler.spawn());
        }
        
    }
}
/***********************************/
