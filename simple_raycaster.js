// You can ignore this code for now.
var game = new ALGame(800, 600);
game.addGameState(updateScreen);
game.start(30);
game.setBackgroundColor('black');

var map = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
           [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
           [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
           [1,0,0,3,4,3,4,3,4,0,0,0,0,0,1],
           [1,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
           [1,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
           [1,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
           [1,0,0,0,0,0,0,2,0,0,0,0,0,0,1],
           [1,0,0,0,0,0,0,2,0,0,0,0,0,0,1],
           [1,0,0,0,0,0,0,2,0,0,0,0,0,0,1],
           [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
           [1,0,1,1,1,1,1,0,0,0,0,0,0,0,1],
           [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
           [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
           [1,1,1,1,1,1,1,5,5,5,1,1,1,1,1]];

var colors = {
    1: 'purple',
    2: 'green',
    3: 'yellow',
    4: 'orange',
    5: 'purple'
};

var cam_x = 2.0;
var cam_y = 2.0;
var cam_angle = 0;

var FIELD_OF_VIEW = 70;

var INCREMENT = 0.05;

var SCALE = 5000;

var WALK_SPEED = 0.1;

// convert degrees to radians
function degreesToRadians(d) {
    return (d * Math.PI) / 180.0;
}

function castRay(x, y, angle) {
    var x_inc = Math.cos(degreesToRadians(angle)) * INCREMENT;
    var y_inc = Math.sin(degreesToRadians(angle)) * INCREMENT;

    var distance = 0;
    while(map[Math.floor(y)][Math.floor(x)] == 0) {
        x += x_inc;
        y += y_inc;
        distance += 1;
    }

    var color = colors[map[Math.floor(y)][Math.floor(x)]];

    return {
        color: color,
        distance: distance
    }
}

function updateScreen() {
    game.clearScreen();

    if (game.isKeyPressed('j')) {
        cam_angle -= 2;
    }

    if (game.isKeyPressed('l')) {
        cam_angle += 2;
    }

    if (game.isKeyPressed('i')) {
        cam_x += Math.cos(degreesToRadians(cam_angle)) * WALK_SPEED;
        cam_y += Math.sin(degreesToRadians(cam_angle)) * WALK_SPEED;
    }

    if (game.isKeyPressed('k')) {
        cam_x -= Math.cos(degreesToRadians(cam_angle)) * WALK_SPEED;
        cam_y -= Math.sin(degreesToRadians(cam_angle)) * WALK_SPEED;
    }


    var ray_angle = cam_angle - FIELD_OF_VIEW / 2.0;
    var angle_inc = FIELD_OF_VIEW / game.width;

    for (var column = 0; column < game.width; column++) {
        ray_angle = ray_angle + angle_inc;
        var r = castRay(cam_x, cam_y, ray_angle);
        var h = Math.min(SCALE / r.distance, game.height / 2);
        game.drawLine(column, game.height / 2 - h, column, game.height / 2 + h, r.color);
    }
}

