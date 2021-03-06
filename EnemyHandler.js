/*EnemyHandler.js
 * **********************************************************************************************************************************************************************************************
 * A factory class to handle the spawning of Enemies
 * **********************************************************************************************************************************************************************************************
 * @author Jamison Ball
 * @date 2/12/15
 * @last modified 2/22/15
 * @last editor 
 */
 
function EnemyHandler(world)
{
  var enemyList = new DList();
  var spwnHndlr = new SpawnHandler(world);
  
   this.addEnemy = function(type)
   {
    Enemy e = spwnHndlr.spawn(type)); //make Enemy to be added
    enemyList.append(e); //append it to the Enemy list
    world.addChild(e.getSprite());
   };
  
   this.update = function()
   {
     var deadList = new DList();
     
      for(enemyList.moveTo(0); enemyList.getIndex() >= 0; enemyList.moveNext())
      {
          var curEnemy = enemyList.getElement();
          
          if(!curEnemy.update())
          {
            deadList.append(enemyList.getIndex());
          }
      }
          
          for(deadList.moveTo(0); deadList.getIndex() >= 0; deadList.moveNext())
          {
            enemyList.moveTo(deadList.getElement());
            ememyList.remove();
          }
   };
   
   function SpawnHandler(world)
   {
    var enemyList = new DList();
  
    this.spawn = function(type)
    {
      var e = new Enemy(type, ID(), lane());
      return e;
    };
  
    function ID()
    {
       var next;
      
      if(this.next === undefined || this.next < 0)
      {
          this.next = 0;
      }
      return this.next++;
    };
    
    function lane()
    {
      return (rand(0, NUM_LANES) * LANE_HEIGHT) + BASE_HEIGHT;
    };
   }
}
