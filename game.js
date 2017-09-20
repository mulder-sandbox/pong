class Game
{
    setup()
    {
        this.isDebug = false;
        this.field = new Field();
        this.app = new PIXI.Application(this.field.width, this.field.height, { antialias: true });
        document.getElementById('scene').appendChild(this.app.view);

        this.graphics = new PIXI.Graphics();

        this.app.stage.addChild(this.graphics);

        this.player1 = new Player1(this.graphics, this.field);
        this.playerControllSetup(this.player1);

        this.player2 = new Player2(this.graphics, this.field);
        this.playerControllSetup(this.player2);

        this.ball = new Ball(this.graphics, this.field);

        this.setupEvents()
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

    setupEvents()
    {
        ObserverManager.instance.subscribe('ball_go', new PlayerObserver(this.player1));
        ObserverManager.instance.subscribe('ball_go', new PlayerObserver(this.player2));
        ObserverManager.instance.subscribe('ball_go', new FieldObserver(this.field));
    }
}

class FieldObserver
{
    constructor(field)
    {
        this.field = field;
    }

    execute(ball)
    {
        if (ball.y + ball.radius <= 0 || ball.y >= this.field.height - ball.radius) {
            ball.yDirect *= -1;
        }
    }
}

class PlayerObserver
{
    constructor(player)
    {
        this.player = player;
    }

    execute(ball)
    {
        console.log('x: ' + ball.x + ', ' + 'y: ' + ball.y)
    }
}

class Field
{
    constructor()
    {
        this._width = 800;
        this._height = 600;
    }

    get width()
    {
        return this._width;
    }

    get height()
    {
        return this._height;
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
        this.y += this.yDirect;
        ObserverManager.instance.dispatch('ball_go', this);
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