import { LEVEL_SIZE, HERO } from "../core/constants.js";

export class Level1 extends Phaser.Scene
{
    constructor()
    {
        super({key:'Level1'});
    }
    
    preload()
    { //Carga assets en memoria
        this.cameras.main.setBackgroundColor('#F00');
        
        this.load.setPath('assets/sprites/backgrounds');
        this.load.image('bg','bg_green_tile.png');

        this.load.setPath('assets/sprites/spritesheets');
        this.load.spritesheet('entry','entry.png',
        {frameWidth:32,frameHeight:40});
        this.load.spritesheet('hero','hero.png',
        {frameWidth:32,frameHeight:32});

        this.load.setPath('assets/tiled/tilesets');
        this.load.image('tileset_walls','tileset_walls.png'); //mantener nombre del TILED
        this.load.image('tileset_moss','tileset_moss.png');   //mantener nombre del TILED


        this.load.setPath('assets/tiled/maps');
        this.load.tilemapTiledJSON('level1','level1.json');


    }
    create()
    { //Pinta assets en pantalla
        //Pintamos el fondo
        this.add.tileSprite(0,0,LEVEL_SIZE.LEVEL1_WIDTH, LEVEL_SIZE.LEVEL1_HEIGHT,'bg').setOrigin(0); 
        //Pintamos el nivel
        //Paso 1: Cargo el JSON
        this.map = this.make.tilemap({key:'level1'});
        //Paso 2: Cargo los tilesets
        // IMPORTANTE: el primer argumento debe coincidir con el "Nombre del tileset" en Tiled.
        // El segundo argumento es la 'key' del asset cargado con this.load.image(...), que cambiamos
        // por el tileset_object del paso previo
        // Si coinciden, puedo dejar sólo 1
        const ts_walls = this.map.addTilesetImage('tileset_walls');
        const ts_moss = this.map.addTilesetImage('tileset_moss');
        //Paso 3:Pinto las CAPAS/LAYERS
        this.walls = this.map.createLayer('level1_layer_walls',ts_walls);
        this.map.createLayer('level1_layer_moss_up',ts_moss);
        this.map.createLayer('level1_layer_moss_left',ts_moss);
        this.map.createLayer('level1_layer_moss_right',ts_moss);
        this.map.createLayer('level1_layer_moss_down',ts_moss);

        //Defino con qué se colisiona en la layer_walls
        //this.map.setCollisionBetween(1,11,true,true,'layer_walls');
        //Ponemos -1, ya que phaser lo interpreta como un 0 en el json
        //this.map.setCollisionBetween(1,11,true,true,'level1_layer_walls'); //Funciona pero no siempre será facil un intervalo
        this.walls.setCollisionByExclusion([-1]);



        //this.entry = this.physics.add.sprite(65,268,'entry');
        //this.entry.body.setAllowGravity(false); //No le afecta la gravedad 
        //this.entry.body.setImmovable(true);     //No le afectan fuerzas externas
        this.entry = this.add.sprite(65,268,'entry');
        
        this.hero = this.physics.add.sprite(65,100,'hero'); 

        //this.physics.add.collider(this.hero,this.entry);
        this.physics.add.collider(this.hero,this.walls);

        //Mapeamos los cursores 
        this.cursors = this.input.keyboard.createCursorKeys();

        //Hacemos que la cámara siga al personaje
        //this.cameras.main.startFollow(this.hero);
        //this.cameras.main.setBounds(0,0,LEVEL_SIZE.LEVEL1_WIDTH,LEVEL_SIZE.LEVEL1_HEIGHT);
        this.cameras.main.startFollow(this.hero).setBounds(0,0,
            LEVEL_SIZE.LEVEL1_WIDTH,LEVEL_SIZE.LEVEL1_HEIGHT);

    }
    update()
    { //Actualiza assets en pantalla
        if(this.cursors.left.isDown)
        { //ME MUEVO A LA IZQUIERDA
            this.hero.body.setVelocityX(-HERO.SPEED); // ← negativo a la izquierda    
            this.hero.setFlipX(true);   
        }else
        if(this.cursors.right.isDown)
        { //ME MUEVO A LA DERECHA
            this.hero.body.setVelocityX(HERO.SPEED); 
            this.hero.setFlipX(false); 
        }else
        {
            this.hero.body.setVelocityX(0);    
        }

        if(this.cursors.space.isDown
           //&& this.hero.body.blocked.down)
           && this.hero.body.onFloor()
           && Phaser.Input.Keyboard.DownDuration(this.cursors.space,250))
        {
            this.hero.body.setVelocityY(HERO.JUMP_FORCE);    
        }
    }
}