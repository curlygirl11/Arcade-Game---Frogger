
/*function drawBox(x, y, width, height, color) {  //function used to draw boxes for collision detection
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
}; */
/******************************** Enemy section *********************************/
var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 75; //  used for collision detection
    this.height = 65; //  used for collision detection
    this.sprite = 'images/enemy-bug.png';
    this.speed = Math.floor(Math.random() * 101) + 50; //sets random speeds for the bugs
};
// Update the enemy's position, required method for game
Enemy.prototype.update = function(dt) { // sets bugs speed and resets them back to left side of screen
    this.x = this.x + (this.speed * dt);
    if (this.x > 500) {
        this.speed = Math.floor(Math.random() * 200) + 50;
        this.x = 0;
    }
};

Enemy.prototype.render = function() { // Draws enemy on the screen
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/************************ PLAYER SECTION **************************/
var Player = function(x, y) {
    this.sprite = "images/char-princess-girl.png";
    this.width = 50; //setting the players width - used for collision detection
    this.height = 50; //setting the players height - used for collision detection
    this.x = 200; // this.x and .y  sets players initial location on the gameboard
    this.y = 380;
    this.lives = 3; //this sets the player's initial number of "lives".
    this.score = 0; // starts score at 0
    this.lifeArray = ["images/Star.png", "images/Star.png", "images/Star.png"]; // lives symbol
    this.youWin = false; // set to false until score = 300
};

Player.prototype.handleInput = function(direction) {
    // move the player & giving the controls constraints so that player can't move out of game area.
    if (direction === 'up') {
        this.y -= 85;
    } else if (this.y < -50) { // if in water add 100 points to score and move player to start
        this.score += 100;
        this.y = 380;
    } else if (this.score >= 300) { // if score >= 300 trigger "You Win" message
        this.youWin = true;
        //console.log("score");
    }

    if (direction === 'down' && this.y < 380) {
        this.y += 85;
    }
    if (direction === 'right' && this.x < 301) {
        this.x += 100;
    }
    if (direction === 'left' && this.x > 90) {
        this.x -= 100;
    }
};

Player.prototype.update = function() {
    this.handleInput();
    if (this.x > 501) {
        this.x = 200;
    }
    this.checkCollisionsBugs(); // invoking collision detection
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); // draws player on screen
    ctx.fillStyle = "yellow";
    ctx.font = 'bold 33px serif';
    ctx.fillText("Score: " + this.score, 350, 80); // puts score in top right corner
    ctx.fillText("Lives: ", 40, 80); // puts lives in top right corner
};

Player.prototype.checkCollisionsBugs = function() { // MDN 2d collision check
    for (var i = 0; i < allEnemies.length; i++) { //loops thru all the bugs looking for collisions
        var enemy = allEnemies[i];
        if (this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x &&
            this.y < enemy.y + enemy.height &&
            this.height + this.y > enemy.y) {
            console.log("OUCH !!!");
            this.resetPosition(); //resetting the position of the player after collision
            ctx.clearRect(0, 0, 120, 60); // clears canvas
            totalLives.splice(totalLives.length - 1, 1); //reduce # of lives by 1 after collision
        }
    }
};
Player.prototype.resetPosition = function() { //return player to starting position
    this.x = 200;
    this.y = 380;
};

// Place the player object in a variable called player
var player = new Player(200, 380); // creates player and starting location

// creates enemies and starting location
var enemy1 = new Enemy(-101, 60);
var enemy2 = new Enemy(-101, 145);
var enemy3 = new Enemy(-101, 225);
var enemy4 = new Enemy(-101, 55);

var allEnemies = [enemy1, enemy2, enemy3, enemy4]; // an array of allEnemies


var Life = { // adds images of the lives rendered to the game board
    x: 0,
    y: 25,
    sprite: "images/Star.png",
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 40, 70); // draws stars on screen
    }
};
var life1 = Object.create(Life);
life1.x = 125;

var life2 = Object.create(Life);
life2.x = 155;

var life3 = Object.create(Life);
life3.x = 185;

var totalLives = [life1, life2, life3]; //array of all the lives



var YouLose = { // displays game over screen
    // x: 0,
    //  y: 0,
    render: function() {
        if (totalLives.length === 0) {
            ctx.font = "bold 80px Impact";
            ctx.fillStyle = "red"; //font color
            ctx.textAlign = "center";
            ctx.fillText("Game Over !!!", 505 / 2, 606 / 2); // centers text
            ctx.font = "bold 28px serif";
            ctx.fillText("Hit browser refresh to restart the Game", 505 / 2, 350);

        }
    }
};

var youLose = Object.create(YouLose);

var YouWin = { // displays you win screen
    // x: 0,
    // y: 0,
    render: function() {
        if (player.youWin) {
            ctx.font = "bold 80px Impact";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("YOU WIN !!!", 505 / 2, 606 / 2);
            ctx.font = "bold 28px Comic Sans MS";
            ctx.fillText("Hit browser refresh to play again", 505 / 2, 350);
        }
    }
};

var youWin = Object.create(YouWin);




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});