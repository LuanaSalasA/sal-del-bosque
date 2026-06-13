let gameScene = new Phaser.Scene('Game');

let player;
let goal;
let shrub;
let hide = false;
let screens = "start";
let wolf;

// Variables para controlar el movimiento y la aparición del lobo
let wolfSpeed = 15; // Velocidad del lobo
let isWolfMoving = false; // Estado para controlar si el lobo está en movimiento
let wolfVisible = false; // Estado para controlar si el lobo es visible


gameScene.init = function(){
    this.playerSpeed=5;
}
gameScene.preload=function(){

    //image
    this.load.image('player','./img/1.png');
    this.load.image('background','./img/bg.png');
    this.load.image('house','./img/casa.png');
    this.load.image('shrub','./img/shrub.png');
    this.load.image('hide','./img/2.png');
    this.load.image('start','./img/screen-start.png');
    this.load.image('lose','./img/screen-lose.png');
    this.load.image('win','./img/screen-win.png');
    this.load.image('wolf','./img/wolf.png');

    //keys
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
}

gameScene.create=function(){
    let gameW = this.sys.game.canvas.width;
    let gameH = this.sys.game.canvas.height;


    overScreen = this.add.sprite(0,0,'start');
    overScreen.setOrigin(0,0);
    overScreen.setScale(1);

    let bg = this.add.sprite(0,0,'background');
    bg.setOrigin(0,0);
    bg.setScale(1);

    
    player = this.add.sprite(0, 0, 'player');
    player.setOrigin(0, 0);
    player.depth = 5;
    player.y = gameH - 367;

    wolf=this.add.sprite(1930,gameH-338,'wolf');
    wolf.setOrigin(0,0);
    wolf.depth=6;
    wolf.visible=false;
    

    goal=this.add.sprite(0,0,'house');
    goal.setOrigin(0,0);
    goal.depth=4;
    goal.x=gameW/2+100;
    goal.y=gameH-1024;


    shrub=this.add.sprite(0,0,'shrub');
    shrub.setOrigin(0,0);
    shrub.depth=3;
    shrub.x=gameW/2-400;
    shrub.y=gameH-261;

   

    this.time.addEvent({
        delay: 10000, // 10 segundos
        callback: this.spawnWolf,
        callbackScope: this,
        loop: true // Se repite en bucle
    }); 

}

gameScene.spawnWolf = function () {
    if (screens === "without") { // Solo aparece si estamos jugando
        wolf.x = this.sys.game.canvas.width; // Reinicia la posición del lobo
        wolf.visible = true; // Muestra al lobo
        wolfVisible = true; // Cambia el estado a visible
        isWolfMoving = true; // Cambia el estado a en movimiento
    }
};

gameScene.update=function(){

    let playerRect = player.getBounds();
    let goalRect = goal.getBounds();
    let shrubRect = shrub.getBounds();
    let wolfRect = wolf.getBounds();

    if (isWolfMoving && screens === "without") {
        wolf.x -= wolfSpeed; // Mueve el lobo a la izquierda

        // Verifica si el lobo ha salido de la pantalla
        if (wolf.x < -wolf.width) {
            wolf.visible = false; // Oculta al lobo
            isWolfMoving = false; // Cambia el estado a no en movimiento
        }
    }

    // Condición para esconderse en el arbusto
    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, shrubRect) && this.spaceKey.isDown){
        hide=true;
    } else if(this.input.activePointer.isDown){
        hide=false;
        player.x += this.playerSpeed;
    }

    if (hide) {
        player.setTexture('hide'); 
        player.depth = 2; 
    } else {
        player.setTexture('player');
        player.depth = 5; 
    }

    if (screens==="lose") {
        overScreen.setTexture('lose'); 
        overScreen.depth = 10; 
        // Detener al lobo
        isWolfMoving = false;
        wolf.visible = false;
        if(this.enterKey.isDown){
            screens="start";
            this.scene.restart();
        }
    } else if (screens==="win") {
        overScreen.setTexture('win'); 
        overScreen.depth = 10; 
        // Detener al lobo
        isWolfMoving = false;
        wolf.visible = false;
        if(this.enterKey.isDown){
            screens="start";
            this.scene.restart();
        }
    } else if (screens==="start") {
        overScreen.setTexture('start'); 
        overScreen.depth = 10;
        if(this.enterKey.isDown){
            screens="without";
        }
    } else if (screens==="without") {
        overScreen.setTexture(''); 
        overScreen.depth = 1; 
    }
    
   

    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)){
        screens="win";
        
    }


    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, wolfRect)){
        if(hide===false){
            screens="lose";
        }
    }



}


//set game's config
let config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: gameScene
};
  
//create game and pass config object
  
let game = new Phaser.Game(config)