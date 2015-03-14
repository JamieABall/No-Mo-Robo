/************************************
    Enemy
************************************/
function Enemy(/*id, */pos, type) {
    //var _id = id;
    var _e = new Entity(pos, type);
    var _state; // to do

    
    //this.id = function() { return _id; }
    this.sprite = function() { return _e.sprite; }
    this.condition = function() { return _e.condition; }
    this.modifyCondition = function(delta) { _e.condition += delta; }
    this.damage = function() { return _e.damage; }
    
    this.update = function(dt) {
        _e.sprite.x -= _e.speed * dt;
        
        if(_e.sprite.x < 145)
        {
            _e.condition -= 999;
            houseCondition -= 5;
            console.log(houseCondition);
            //_e.removeSprite();
        }
        // if near house, explode
    }
    
    this.despawn = function() {
        _e.removeSprite();
    }
    
}
/***********************************/




/************************************
    Enemy Types
************************************/
var NORMBOT = new Type("http://i.imgur.com/6yZDAs1.png", ENEMY_INDEX, NORMBOT_WIDTH, NORMBOT_HEIGHT, NORMBOT_CONDITION, NORMBOT_DAMAGE, NORMBOT_SPEED);
var FASTBOT = new Type("http://i.imgur.com/ry3LdWs.png", ENEMY_INDEX, FASTBOT_WIDTH, FASTBOT_HEIGHT, FASTBOT_CONDITION, FASTBOT_DAMAGE, FASTBOT_SPEED);
var TANKBOT = new Type("http://i.imgur.com/ULe58Pm.png", ENEMY_INDEX, TANKBOT_WIDTH, TANKBOT_HEIGHT, TANKBOT_CONDITION, TANKBOT_DAMAGE, TANKBOT_SPEED);
/***********************************/




/************************************
    Controller
************************************/
function Controller() {
    // ai to do
}
/***********************************/



// temp for presentation (ugly spaghetti) 
var timeSinceLastEnemy = 0;

function generateEnemies(dt) {
    timeSinceLastEnemy += dt;
    var type;
    var r = rand(0, 5);
    switch(r) {
        case 0:
        case 1:
        case 2:
            type = NORMBOT;
            break;
        case 3:
        case 4:
            type = FASTBOT;
            break;
        case 5:
            type = TANKBOT;
            break;
    }
    //if(enemies.size() < 2 || timeSinceLastEnemy > ENEMY_SPAWN_INTERVAL) {
    if(enemies.size() < 2 || enemies.size() < score / 100) {
        r = rand(1, 5);
        enemies.append(new Enemy({x: CANVAS_WIDTH + TILE_WIDTH, y: CANVAS_HEIGHT - (r * TILE_HEIGHT)}, type));
    }
}
