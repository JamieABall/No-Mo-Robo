
/************************************
    Player Handler
************************************/
function PlayerHandler(stage) {

    /************************************
        Input Handler
    ************************************/
    function InputHandler() {

        var _downPos;
        var _upPos;
        var _upOffsetX;
        var _upOffsetY;
        //Boolean for when mouse is down. 
        
        function position() { return {x: gInput.mouse.x, y: gInput.mouse.y}; }
        
        this.mouseX = function() { return gInput.mouse.x; };
        this.mouseY = function() { return gInput.mouse.y; };
        
        this.onMouseUp = function() {
            _upPos = position();
            _upOffsetX = _upPos.x - _downPos.x;
            _upOffsetY = _upPos.y - _downPos.y;
        };
        
        this.onMouseDown = function() {
            _downPos = position();
            _downPos = stage.getTile(_downPos);
            _turretHandler.build(_downPos)	
        };
    }
    /***********************************/
    
    
    /************************************
        Turret Handler
    ************************************/
    function TurretHandler() {
        
        /************************************
            Turret
        ************************************/
        function Turret(id, pos) {
            var _id = id;
            var _sprite = initSprite();
            var _condition = TURRET_CONDITION;
            var _fireRate = TURRET_FIRE_RATE;
            var _damage = TURRET_DAMAGE;
            var _state;
            
            
            function initSprite(pos) {
                var ret = new Sprite();
                ret.image = Textures.load("http://i.imgur.com/rKsSu90.gif");
                ret.width = TURRET_SPRITE_WIDTH;
                ret.height = TURRET_SPRITE_HEIGHT;
                ret.x = pos.x;
                ret.y = pos.y;
                ret.index = 6;
                ret.offsetX = -ret.width / 2;
                ret.offsetY = -ret.height / 2;
                world.addChild(ret);
                return ret;
            }
            
            this.id = function() { return _id; }
            this.sprite = function() { return _sprite; }
            this.condition = function() { return _condition; };
            this.modifyCondition = function(delta) { _condition += delta; };
            this.damage = function() { return _damage; };
            
            //Turret update
            this.update = function(dt) {
            	
            };
            
            this.despawn = function() {
                world.removeChild(_sprite);
            };
        }
        /***********************************/
        
        
        /************************************
            Spawn Handler
        ************************************
        function SpawnHandler() {
    
            function id() {
                var next;
                if(this.next == undefined || this.next < 0) {
                    this.next = 0;
                }
                return this.next;
            }
                    
            this.spawn = function(position) {
                return new Turret(id(), position);
            }
        }
        /***********************************/
        
        var _turrets = new DList();
        
        
        function clearDead() {
            var dead = new DList();
        
            for(_turrets.moveTo(0); _turrets.getIndex() >= 0; _turrets.moveNext()) {
                var current = _turrets.getElement();
                
                if(current.health() <= 0) {
                    dead.append(_turrets.getIndex());
                }
            }
            
            for(dead.moveTo(0); dead.getIndex() >= 0; dead.moveNext()) {
                _turrets.moveTo(dead.getElement());
                _turrets.getElement().despawn();
                _turrets.remove();
            }
        }
        
        this.turrets = function { return _turrets.copy(); }
        
        this.build = function(position) {
            _turrets.append(new Turret(null, position));
        };
        
        //TurretHandler update
        this.update = function(dt) {
            clearDead();
            for(_turrets.moveTo(0); _turrets.getIndex >= 0; _turrets.moveNext()) {
                _turrets.getElement().update();
            }
        };
        
    }
    /***********************************/
    
    
    /************************************
        Projectile Handler
    ************************************/
    function ProjectileHandler() {
        
        /************************************
            Projectile (incomplete)
        ************************************/
        function Projectile(parent) {
            var _speed;
            var _direction;
            var _damage = parent.damage;
            var _sprite = initSprite();
            var _collision = false;
            function initSprite(pos)
            {
                var ret = new Sprite();
                
                ret.image = Textures.load(PROJECTILE_SPRITE_SRC);
                ret.width = PROJ_SPRITE_WIDTH;
                ret.height = PROJ_SPRITE_HEIGHT;
                ret.x = pos.x;
                ret.y = pos.y;
                ret.offsetX = -ret.width / 2;
                ret.offsetY = -ret.height / 2;
                world.addChild(ret);
                return ret;
            }
            
            /*
            this.getParentDamage()
            {
                this._damage = parent.damage();
            }
            */
            
            this.hasCollided = function()
            {
            	_collision = true;
                return _collision;
            }
            this.update = function(dt) {
                pos.x += (_speed * _direction.x) * dt;
                pos.y += (_speed * _direction.y) * dt;
            }
        }
        /***********************************/
        
        var _projectiles = new DList();
        
        
        this.update = function(dt) {
            for(_projectiles.moveTo(0); _projectiles.getIndex() >= 0; _projectiles.moveNext()) {
                _projectiles.getElement().update(dt);
                if (_projectiles.getElement()._collision == true;){
                	despawn();
                }
            }
        }
        this.despawn = function() {
            world.removeChild(_sprite);
        }   
    }
    /***********************************/
    
    
    /************************************
        House
    ************************************/
    function House() {
        var _condition = 5;
        var housePosition = {x: 0, y: 0};////////////////////////////////////////////////////////////
        var _sprite = initSprite(housePosition);
        //drawing the sprites
        function initSprite(pos) {
                var ret = new Sprite();
                ret.image = Textures.load("http://i.imgur.com/GjCuaSO.png");
                ret.width = 100;
                ret.height = canvas.height;
                ret.x = pos.x;
                ret.y = pos.y;
                ret.index = 4;
                ret.offsetX = -ret.width / 2;
                ret.offsetY = -ret.height / 2;
                world.addChild(ret);
                return ret;
            }
        //function is changing health
        this.modifyCondition = function(delta) { _condition += delta; };
        
        //House update
        this.update = function() {
            if(_condition <= 0){
                // game over
        };
    }
    /***********************************/
    
    
    //var _scrap = STARTING_SCRAP;
    var _inputHandler = new InputHandler();
    var _turretHandler = new TurretHandler();
    var _projectileHandler = new ProjectileHandler();
    var _house = new House();
    
    this.turrets = function() { return _turretHandler.turrets(); };
    
    //PlayerHandler update
    this.update = function(dt) {
        _turretHandler.update(dt);
    };
    
    gInput.addMouseDownListener(_inputHandler);
    gInput.addMouseUpListener(_inputHandler);

/***********************************/
