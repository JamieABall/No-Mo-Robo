function Type(s, i, w, h, c, d, sp) {
    this.spriteSource = s;
    this.spriteIndex = i;
    this.spriteWidth = w;
    this.spriteHeight = h;
    
    this.condition = c;
    this.damage = d;
    this.speed = sp;
}
/***********************************/





/************************************
    Global Constants
************************************/

// Canvas
{
    var CANVAS = document.getElementById("canvas");
    var CANVAS_WIDTH = CANVAS.width;
    var CANVAS_HEIGHT = CANVAS.height;
}

// Screen Positions
{
    function ORIGIN() { return {x: 0, y: 0}; }
    function CENTER() { return {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2}; }
}

// Stage Constants
{
    var NUM_ROWS = 5;
    var NUM_COLS = 10;
    var NUM_PLACEABLE_COLS = 7;
    
    var TILE_HEIGHT = 60;
    var TILE_WIDTH = 74;
    var TILE_OFFSET_PER_ROW = 15;
    var TILE_SLOPE = 4;
    
    function HOUSE_BOTTOM_CORNER() { return 145; }
}

// Sprite Indices
{
var BACKGROUND_INDEX = 100;
var BUTTON_INDEX = 50;
}

// Button Constants
{
    var BUTTON_BORDER = 10;
    var BUTTON_WIDTH = 200;
    var BUTTON_HEIGHT = 100;
    function BUTTON_POS() {
        var ret = CENTER();
        ret.x -= BUTTON_WIDTH / 2;
        ret.y -= BUTTON_HEIGHT / 2;
        return ret;
    }
    function SECOND_BUTTON_POS() {
        var ret = BUTTON_POS();
        ret.y += BUTTON_HEIGHT - BUTTON_BORDER;
        return ret;
    }
    function BUTTON_SPRITE() { // can only select inside of buttons
        var ret = new Sprite();
        var pos = BUTTON_POS();
        ret.x = pos.x + BUTTON_BORDER;
        ret.y = pos.y + BUTTON_BORDER;
        ret.width = BUTTON_WIDTH - 2 * BUTTON_BORDER;
        ret.height = BUTTON_HEIGHT - 2 * BUTTON_BORDER;
        return ret;
    }
    function SECOND_BUTTON_SPRITE() {
        var ret = BUTTON_SPRITE();
        ret.y += BUTTON_HEIGHT - BUTTON_BORDER;
        return ret;
    }
}

// Menu Types
{
    var TITLE_SCREEN = new Type("Assets/title_screen.png", BACKGROUND_INDEX, CANVAS_WIDTH, CANVAS_HEIGHT);
    var NEW_GAME_BUTTON = new Type("Assets/title_new_game_btn.png", BUTTON_INDEX, BUTTON_WIDTH, BUTTON_HEIGHT);
    var GAME_SCREEN = new Type("Assets/game_screen.png", BACKGROUND_INDEX, CANVAS_WIDTH, CANVAS_HEIGHT);
    var PAUSE_SCREEN = new Type("Assets/pause_screen.png", BACKGROUND_INDEX, CANVAS_WIDTH, CANVAS_HEIGHT);
    var MAIN_MENU_BUTTON = new Type("Assets/pause_menu_btn.png", BUTTON_INDEX, BUTTON_WIDTH, BUTTON_HEIGHT);
    var RESUME_GAME_BUTTON = new Type("Assets/resume_game_btn.png", BUTTON_INDEX, BUTTON_WIDTH, BUTTON_HEIGHT);
}


// Turret Constants
{
    TURRET_INDEX = 10;
    
    KNIFESTER_WIDTH = TILE_WIDTH;
    KNIFESTER_HEIGHT = TILE_HEIGHT;
    KNIFESTER_CONDITION = 25;
    KNIFESTER_DAMAGE = 5;
    KNIFESTER_SPEED = 10;
}


// Projectile Constants
{
    PROJECTILE_INDEX = 5;
}


// Enemy Constants
{
    ENEMY_SPAWN_INTERVAL = 1000;
    
    ENEMY_INDEX = 8;
    
    NORMBOT_WIDTH = TILE_WIDTH;
    NORMBOT_HEIGHT = TILE_HEIGHT;
    NORMBOT_CONDITION = 20;
    NORMBOT_DAMAGE = 10;
    NORMBOT_SPEED = 50;
    
    FASTBOT_WIDTH = TILE_WIDTH;
    FASTBOT_HEIGHT = TILE_HEIGHT;
    FASTBOT_CONDITION = 15;
    FASTBOT_DAMAGE = 8;
    FASTBOT_SPEED = 80;
    
    TANKBOT_WIDTH = TILE_WIDTH;
    TANKBOT_HEIGHT = TILE_HEIGHT;
    TANKBOT_CONDITION = 50;
    TANKBOT_DAMAGE = 13;
    TANKBOT_SPEED = 20;
}


// Gameplay Constants
var STARTING_HOUSE_CONDITION = 100;


/***********************************/




/************************************
    Global Functions
************************************/
function rand(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}


function contains(point, sprite) {
    return !(point.x < sprite.x || point.x > sprite.x + sprite.width) &&
           !(point.y < sprite.y || point.y > sprite.y + sprite.height);
}


function clearEntities(list) {
    var dead = new DList();
    
    for(list.moveTo(0); list.getIndex() >= 0; list.moveNext()) {
        var current = list.getElement();
        
        if(current.condition() <= 0) {
            dead.append(list.getIndex());
        }
    }
    
    for(dead.moveTo(dead.size() - 1); dead.getIndex() >= 0; dead.movePrev()) {
        list.moveTo(dead.getElement())
        list.getElement().despawn();
        list.remove();
    }
}


function updateEntities(list, dt) {
    clearEntities(list);
    for(list.moveTo(0); list.getIndex() >= 0; list.moveNext()) {
        list.getElement().update(dt);
    }
}


// pos: position vector, type: type object, stage: parent sprite for new sprite
function initSprite(pos, type, stage) {
        var ret = new Sprite();
        ret.image = Textures.load(type.spriteSource);
        ret.index = type.spriteIndex;
        ret.width = type.spriteWidth;
        ret.height = type.spriteHeight;
        ret.x = pos.x;
        ret.y = pos.y;
        ret.offsetX = -ret.width / 2;
        ret.offsetY = -ret.height / 2;
        stage.addChild(ret);
        return ret;
    }
/***********************************/




/************************************
    Initialization Functions
************************************/
function initGameStateManager() {
    if(!gameStateManager) { // doesn't exist, create
        gameStateManager = new GameStateManager();
    } else {
        //gameStateManager.cleanUp(); // deallocates resources
        gamestateManager = null;
        initGameStateManager();
    }
}


function initInput() {
    if(!gameStateManager) {
        console.log("initInput(): dependency [gamestateManager] not initialized");
        return;
    }
    if(!inputHandler) {
        inputHandler = new InputHandler();
        gInput.addMouseDownListener(inputHandler);
        gInput.addMouseUpListener(inputHandler);
        gInput.addKeyboardListener(inputHandler);
    } else {
        gInput.removeMouseDownListener(inputHandler);
        gInput.removeMouseUpListener(inputHandler);
        gInput.removeMouseMoveListener(inputHandler); // least aptly named function in all of brinedom (removes keyListens)
        inputHandler = null;
        initInput();
    }
}


function initStage() {
    if(!stage) {
        stage = new Stage();
    } else {
        //stage.cleanUp();
        stage = null;
        initStage();
    }
}

/* Doesn't work...
function initEntities(list) {
    if(!list) {
        list = new DList();
    } else {
        for(list.moveTo(0); list.getIndex() >= 0; list.moveNext()) {
            list.getElement().despawn();
        }
        list.clear();
        list = new DList();
    }
}
*/

function initTurrets() {
    if(!turrets) {
        turrets = new DList();
    } else {
        for(turrets.moveTo(0); turrets.getIndex() >= 0; turrets.moveNext()) {
            turrets.getElement().despawn();
        }
        turrets.clear();
        turrets = new DList();
    }
}

function initProjectiles() {
    if(!projectiles) {
        projectiles = new DList();
    } else {
        for(projectiles.moveTo(0); projectiles.getIndex() >= 0; projectiles.moveNext()) {
            projectiles.getElement().despawn();
        }
        projectiles.clear();
        projectiles = new DList();
    }
}

function initEnemies() {
    if(!enemies) {
        enemies = new DList();
    } else {
        for(enemies.moveTo(0); enemies.getIndex() >= 0; enemies.moveNext()) {
            enemies.getElement().despawn();
        }
        enemies.clear();
        enemies = new DList();
    }
}

function initCollision() {
    if(!turrets || !projectiles || !enemies) {
        console.log("initCollision(): dependency [turrets/projectiles/enemies] not initialized");
    }
    if(!collisionHandler) {
        collisionHandler = new CollisionHandler();
    }
}
/***********************************/
