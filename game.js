class Game
{
    setup()
    {
        this.isDebug = false;
        this.field = {
            width: 800,
            height: 600
        };
        this.app = new PIXI.Application(this.field.width, this.field.height, { antialias: true });
        document.getElementById('scene').appendChild(this.app.view);

        this.graphics = new PIXI.Graphics();

        this.app.stage.addChild(this.graphics);

        this.player1 = new Player1(this.graphics, this.field);
        this.playerControllSetup(this.player1);

        this.player2 = new Player2(this.graphics, this.field);
        this.playerControllSetup(this.player2);

        this.ball = new Ball(this.graphics, this.field);
    }

    start()
    {
        this.ball.go();
        if (this.isDebug) {
            console.log(this.ball.x + ' ' + this.ball.y);
            this.tick++;
        }
        this.graphics.clear();
        this.player1.draw();
        this.player2.draw();
        this.ball.draw();
    }

    playerControllSetup(player)
    {
        player.upEvent = keyboard(player.keyUpCode);
        player.downEvent = keyboard(player.keyDownCode);

        player.upEvent.press  = function () {
            player.up();
        };

        player.downEvent.press  = function () {
            player.down();
        };
    }
}

class Ball
{
    constructor(graphics, field) {
        this.xDirect = 2;
        this.yDirect = +2;
        this.x = field.width/2;
        this.y = field.height/2;
        this.radius = 10;
        this.graphics = graphics;
    }

    draw() {
        this.graphics.lineStyle(2, 0x000000, 1);
        this.graphics.beginFill(0xFFFFFF, 1);
        this.graphics.drawCircle(this.x, this.y, this.radius);
    }

    attach() {

    }

    detach() {

    }

    go() {
        this.x += this.xDirect;
        // if (this.x <= 0 || this.x >= 600) {
        //     this.xDirect *= -1;
        // }

        if (this.y + this.radius <= 0 || this.y >= 600 - this.radius) {
            this.yDirect *= -1;
        }
        this.y += this.yDirect;
    }
}

class Player
{
    constructor(graphics, field) {
        this.field = field;
        this.graphics = graphics;
        this.width = 10;
        this.height = 120;
        this.playerSpeed = 15;
        this.y = (this.field.height - this.height)/2;
    }

    draw() {
        this.graphics.lineStyle(2, 0x000000, 1);
        this.graphics.beginFill(0xFFFFFF, 1);
        this.graphics.drawRect(this.x, this.y, this.width, this.height);
    }

    up() {
        this.y -= this.playerSpeed;
    }

    down() {
        this.y += this.playerSpeed;
    }
}

class Player1 extends Player
{
    constructor(graphics, field) {
        super(graphics, field);
        this.x = 0;
        this.keyUpCode = 87;
        this.keyDownCode = 83;
    }
}

class Player2 extends Player
{
    constructor(graphics, field) {
        super(graphics, field);
        this.x = this.field.width - this.width;
        this.keyUpCode = 38;
        this.keyDownCode = 40;
    }
}

game = new Game();
game.setup();

game.app.ticker.add(
    function() {
        game.start()
    }
);