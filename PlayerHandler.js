/************************************
    Player Handler
************************************/
function PlayerHandler(stage) {

    /************************************
        Input Handler
    ************************************/
    function InputHandler(stage, th) {

        var _downPos;
        var _upPos;
        var _upOffsetX;
        var _upOffsetY;
        
        function position() { return {x: gInput.mouse.x, y: gInput.mouse.y}; }
        
        this.mouseX = function() { return gInput.mouse.x; }
        this.mouseY = function() { return gInput.mouse.y; }
        
        this.onMouseUp = function() {
            _upPos = position();
            _upOffsetX = _upPos.x - _downPos.x;
            _upOffsetY = _upPos.y - _downPos.y;
        }
        
        this.onMouseDown = function() {
            var tilePos;
            _downPos = position();
            tilePos = stage.getTile(_downPos);
            th.build(tilePos);
        }
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
            var _pos = pos;
            var _sprite = initSprite(_pos);
            var _condition = TURRET_CONDITION;
            var _fireRate = TURRET_FIRE_RATE;
            var _timeSinceLastShot = 0;
            var _damage = TURRET_DAMAGE;
            var _state;
            
            function initSprite(pos) {
                var ret = new Sprite();
                ret.image = Textures.load(TURRET_SPRITE_SRC);
                ret.index = 5;
                ret.width = TURRET_SPRITE_WIDTH;
                ret.height = TURRET_SPRITE_HEIGHT;
                ret.x = pos.x;
                ret.y = pos.y;
                ret.offsetX = -ret.width / 2;
                ret.offsetY = -ret.height / 2;
                world.addChild(ret);
                return ret;
            }
            
            //this.id = function() { return _id; }
            this.sprite = function() { return _sprite; }
            this.condition = function() { return _condition; }
            this.modifyCondition = function(delta) { _condition += delta; }
            this.damage = function() { return _damage; }
            
            this.update = function(dt) {
                _timeSinceLastShot += dt;
                if(_timeSinceLastShot > FIRE_RATE) {
                    _timeSinceLastShot = 0;
                    return true;
                }
                return false;
            }
            
            this.despawn = function() {
                world.removeChild(_sprite);
            }
        }
        /***********************************/
        
        var _turrets = new DList();
        
        
        function clearDead() {
            var dead = new DList();
        
            for(_turrets.moveTo(0); _turrets.getIndex() >= 0; _turrets.moveNext()) {
                var current = _turrets.getElement();
                
                if(current.condition() <= 0) {
                    dead.append(_turrets.getIndex());
                }
            }
            
            for(dead.moveTo(0); dead.getIndex() >= 0; dead.moveNext()) {
                _turrets.moveTo(dead.getElement())
                _turrets.getElement().despawn();
                _turrets.remove();
            }
        }
        
        this.turrets = function() { return _turrets.copy(); }
        
        this.build = function(position) {
            _turrets.append(new Turret(null, position));
        }
        
        this.update = function(dt) {
            var ret = new DList();
            var turret;
            clearDead();
            for(_turrets.moveTo(0); _turrets.getIndex >= 0; _turrets.moveNext()) {
                turret = _turrets.getElement();
                if(turret.update()) {
                    ret.append(turret);
                }
            }
            return ret;
        }
        
    }
    /***********************************/
    
    
    /************************************
        Projectile Handler
    ************************************/
    function ProjectileHandler() {
        
        /************************************
            Projectile (incomplete)
        ************************************/
        function Projectile(parent, dir) {
            var _speed = PROJECTILE_SPEED;
            var _direction = dir;
            var _damage = parent.damage();
            var _sprite = initSprite(parent.position());

            function initSprite(pos) {
                var ret = new Sprite();
                ret.image = Textures.load(PROJECTILE_SPRITE_SRC);
                ret.index = 3;
                ret.width = PROJECTILE_SPRITE_WIDTH;
                ret.height = PROJECTILE_SPRITE_HEIGHT;
                ret.x = pos.x;
                ret.y = pos.y;
                ret.offsetX = -ret.width / 2;
                ret.offsetY = -ret.height / 2;
                world.addChild(ret);
                return ret;
            }
            
            this.sprite = function() { return _sprite; }
            
            this.update = function(dt) {
                _sprite.x += _speed * _direction.x * dt;
                _sprite.y += _speed * _direction.y * dt;
            }
        }
        /***********************************/
        
        var _projectiles = new DList();
        
        function generateProjectile(turret) {
            _projectiles.append(new Projectile(turret, FIRE_DIRECTION))
        }
        
        this.projectiles = function() { return _projectiles; }
        
        this.update = function(dt, shooting) {
            for(_projectiles.moveTo(0); _projectiles.getIndex() >= 0; _projectiles.moveNext()) {
                _projectiles.getElement().update(dt);
            }
            for(shooting.moveTo(0); shooting.getIndex() >= 0; shooting.moveNext()) {
                generateProjectile(shooting.getElement());
            }
        }
        
    }
    /***********************************/
    
    
    /************************************
        House
    ************************************/
    function House() {
        var _condition = HOUSE_CONDITION;
        var _sprite = initSprite(HOUSE_POSITION);
        
        function initSprite(pos) {
                var ret = new Sprite();
                ret.image = Textures.load(HOUSE_SPRITE_SRC);
                ret.index = 6;
                ret.width = HOUSE_SPRITE_WIDTH;
                ret.height = HOUSE_SPRITE_HEIGHT;
                ret.x = pos.x;
                ret.y = pos.y;
                ret.offsetX = -ret.width / 2;
                ret.offsetY = -ret.height / 2;
                world.addChild(ret);
                return ret;
            }
        
        this.damage = function() { return 999; }
        this.sprite = function() { return _sprite; }
        
        this.modifyCondition = function(delta) { _condition += delta; }
        this.condition = function() { return _condition; }
        
        this.update = function() {
            if(_condition <= 0)
                gameOver = true;
        }
    }
    /***********************************/
    
    
    //var _scrap = STARTING_SCRAP;
    var _turretHandler = new TurretHandler();
    var _inputHandler = new InputHandler(stage, _turretHandler);
    var _inputHandler = new InputHandler(stage, _turretHandler);
    var _projectileHandler = new ProjectileHandler();
    var _house = new House();
    
    this.turrets = function() { return _turretHandler.turrets(); }
    this.projectiles = function() { return _projectileHandler.projectiles(); }
    this.house = function() { return _house; }
    
    this.update = function(dt) {
        var shooting = new DList();
        shooting = _turretHandler.update(dt);
        _projectileHandler.update(dt, shooting);
        _house.update();
    }
    
    gInput.addMouseDownListener(_inputHandler);
    gInput.addMouseUpListener(_inputHandler);
}
/***********************************/
