/*Robot.js
  @author Jamison Ball
  @date 3/3/15
  @last update 3/3/15
  @last editor
  
*/
function Robot(id, pos) 
{
    var _id= id;
    var _sprite = initSprite(x, y);
    var _condition = ENEMY_CONDITION;
    var _speed = ROBOT_SPEED;
    var _damage = ROBOT_DAMAGE;
    var _state; 
    Robot.inherits(Ememy);

  


function initSprite(pos)
{
    var ret = new Sprite();
    
    ret.image = Textures.load(ROBOT_SPRITE_SRC);
    ret.width = ROBOT_SPRITE_WIDTH;
    ret.height = ROBOT_SPRITE_HEIGHT;
    ret.x = pos.x;
    ret.y = pos.y;
    ret.offsetX = -ret.width / 2;
    ret.offsetY = -ret.height / 2;
    world.addChild(ret);
    
    return ret;
};

 this.id = function() 
 { 
     return _id; 
 }
} 

