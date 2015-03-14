/************************************
    Collision Handler
************************************/
function CollisionHandler() {


var house = new Sprite();

/*house.x = 0;
house.width = 145;
house.height = 600;
gameStateManager.gameStage().addChild(house);*/

    function collision(left, right) {
        var a = left.sprite();
        var b = right.sprite();
  
        return !(a.x + a.width < b.x || a.x > b.x + b.width) &&
               !(a.y + a.height < b.y || a.y > b.y + b.height);
    }
    
    this.update = function() {
        var enemy;
        var current;
        for(enemies.moveTo(0); enemies.getIndex() >= 0; enemies.moveNext()) {
            enemy = enemies.getElement();
            for(projectiles.moveTo(0); projectiles.getIndex() >= 0; projectiles.moveNext()) {
                current = projectiles.getElement();
                if(collision(enemy, current)) {
                    enemy.modifyCondition(-current.damage());
                    current.despawn();
                    projectiles.remove();
                    projectiles.moveTo(0);
                }
            }
            for(turrets.moveTo(0); turrets.getIndex() >= 0; turrets.moveNext()) {
                current = turrets.getElement();
                if(collision(enemy, current)) {
                    // for presentation purposes only, until projectiles are added again
                    enemy.modifyCondition(-999);
                    current.modifyCondition(-999);
                    score += 100;
                  
                   // ENEMY_SPAWN_INTERVAL /= 1.25;
                    
                    if(ENEMY_SPAWN_INTERVAL > 50)
                    {
                        ENEMY_SPAWN_INTERVAL /= 1.25;
                    }
                    
                    else
                    {
                        ENEMY_SPAWN_INTERVAL = 200;
                    }
                    console.log(ENEMY_SPAWN_INTERVAL);
                    
                }
            }
           
            
        }
    }

}
/***********************************/
