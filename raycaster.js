var game = new ALGame(1000, 600);
game.addGameState(updateScreen);
game.addGameState(updateScreenGameOver);
game.start(30);


// the type of each block in the world
var map_types =   [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 1],
                   [1, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 1],
                   [1, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 1],
                   [1, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 1],
                   [1, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 1],
                   [1, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 1],
                   [1, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 1],
                   [1, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 1],
                   [1, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 1],
                   [1, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 1],
                   [1, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 1],
                   [1, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 1],
                   [1, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

// the height of every block in the world
var map_heights = [[ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 2, 4, 6, 8, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
                   [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]];


// map of block types to colors and other properties
const block_types = {
    0: {color:[180,180,180]},
    1: {color:[0,0,190]},
    2: {color:[40,150,0]},
    3: {color:[100,0,190]},
    4: {color:[40,40,100]},
    5: {color:[90,30,30]},
    6: {color:[255,150,0], bounce:3.0},
    7: {color:[255,0, 0], poision:true}
};

// how high the camera is positioned above the block it's standing on
const PLAYER_HEIGHT = 3.5;

const FIELD_OF_VIEW = 80;

// vertical scale of the world. double to double the height of all walls
const SCALE = 80;

const WALK_SPEED = 0.01;


// the largest step up our character can take (vertical walls higher than this will be collisions)
const MAX_STEP_SIZE = 2.0;

// stereograph params
const DEPTH_OF_FIELD = 0.3;
const EYE_SEPARATION = 200;


for (var i = 255; i > 0; i--) {
    console.log("" + i + " ," + stereoSeperation(i / 255.0));
}

// track camera location and state
var cam_x = 5.0;
var cam_y = 5.0;
var cam_height = 0;
var cam_angle = 0.1;

// velocities
var cam_vel_x = 0.0;
var cam_vel_y = 0.0;
var cam_vel_a = 0.0;
var cam_vel_vert = 0;


// more efficient way to represent camera orientation.
var cam_dir_x, cam_dir_y, screen_dir_x, screen_dir_y;

// x, y coords of block under erit
var edit_x = -1;
var edit_y = -1;


// are re rendering colors, a depth map, or a stereograph
var render_mode = 0;


game.setLineWidth(1);
game.setBackgroundColor('gray');
game.draw_fps = true;

if (map_types.length != map_heights.length || map_types[0].length != map_heights[0].length) {
    console.error("Color map and height map need to be the same size");
}

// this function is called once per game frame,
function updateScreen() {
    game.clearScreen();

    // either edit blocks, or move the player, based on what keys are pressed
    if (game.isKeyPressed('e')) {
        makeEdits();
    } else {
        edit_x = edit_y = -1;
        handleControls();
    }

    checkRenderMode();

    // make the player move and bounce!
    applyPlayerPhysics();

    // pre-calculate vectors that will be useful when rendering
    var radian_angle = degreesToRadians(cam_angle);
    cam_dir_x = Math.cos(radian_angle);
    cam_dir_y = Math.sin(radian_angle);

    // get the x and y components of the vector on which we are projecting the image. This is perpendicular to the camera vector, and with a length to give our correct FOV
    var screen_angle = radian_angle + Math.PI / 2;
    var s = Math.sin(degreesToRadians(FIELD_OF_VIEW/2))*2;
    screen_dir_x = Math.cos(screen_angle) * s;
    screen_dir_y = Math.sin(screen_angle) * s;

    // for each column of pixels on the screen, cast a ray and render!
    for (var column = 0; column < game.width; column++) {
        castRay(column);
    }
    if (render_mode == 2 || render_mode == 3) {
        convertToStereogram();
    }
}

function checkRenderMode() {
    if (game.isKeyPressed('1')) {
        render_mode = 0;
        game.setBackgroundColor('gray');
    }
    if (game.isKeyPressed('2')) {
        render_mode = 1;
        game.setBackgroundColor('black');
    }
    if (game.isKeyPressed('3')) {
        render_mode = 2;
        game.setBackgroundColor('black');
    }
    if (game.isKeyPressed('4')) {
        render_mode = 3;
        game.setBackgroundColor('black');
    }
}

// check for key presses and update the player velocity
function handleControls() {
    if (game.isKeyPressed(ARROW_LEFT)) {
        cam_vel_a -= 1;
    }

    if (game.isKeyPressed(ARROW_RIGHT)) {
        cam_vel_a += 1;
    }

    if (game.isKeyPressed(ARROW_UP)) {
        cam_vel_x += Math.cos(degreesToRadians(cam_angle)) * WALK_SPEED;
        cam_vel_y += Math.sin(degreesToRadians(cam_angle)) * WALK_SPEED;
    }

    if (game.isKeyPressed(ARROW_DOWN)) {
        cam_vel_x -= Math.cos(degreesToRadians(cam_angle)) * WALK_SPEED;
        cam_vel_y -= Math.sin(degreesToRadians(cam_angle)) * WALK_SPEED;
    }
    var h = cam_height - map_heights[Math.floor(cam_y)][Math.floor(cam_x)];
    if (h < 0.1 && game.isKeyPressed(' ', 250)) {
        cam_vel_vert += 1.5;
    }
}

// check for key pressed in block edit mode, and edit the selected block
function makeEdits() {
    edit_x = Math.floor(cam_x + Math.cos(degreesToRadians(cam_angle)) * 1.5);
    edit_y = Math.floor(cam_y + Math.sin(degreesToRadians(cam_angle)) * 1.5);
    if (isInBounds(edit_x, edit_y)) {
        if (game.isKeyPressed(ARROW_UP, 100)) {
            map_heights[edit_y][edit_x] += 0.5;
        }
        if (game.isKeyPressed(ARROW_DOWN, 100)) {
            map_heights[edit_y][edit_x] -= 0.5;
        }
        if (game.isKeyPressed(ARROW_LEFT, 300)) {
            map_types[edit_y][edit_x] += 1;
            if (map_types[edit_y][edit_x] >= Object.keys(block_types).length) {
                map_types[edit_y][edit_x] = 0;
            }
        }
        if (game.isKeyPressed(ARROW_RIGHT, 300)) {
            map_types[edit_y][edit_x] -= 1;
            if (map_types[edit_y][edit_x] < 0) {
                map_types[edit_y][edit_x] = Object.keys(block_types).length - 1;
            }
        }
        if (game.isKeyPressed(' ', 300)) {
            map_heights[edit_y][edit_x] = map_heights[Math.floor(cam_y)][Math.floor(cam_x)];
        }
    }
}

// cast a ray and draw a single column of pixels
function castRay(column) {

    var screen_x = (2 * column) / game.width - 1;

    var ray_pos_x = cam_x;
    var ray_pos_y = cam_y;

    var ray_dir_x = cam_dir_x + screen_dir_x * screen_x;
    var ray_dir_y = cam_dir_y + screen_dir_y * screen_x;

    var map_x = Math.floor(ray_pos_x);
    var map_y = Math.floor(ray_pos_y);



    // ray is cast using the DDA algorithm, as described at http://lodev.org/cgtutor/raycasting.html

    //x, y distance from current position to next block boundary
    var side_dist_x;
    var side_dist_y;

    //x, y distance from one block boundary to the next
    var delta_dist_x = Math.sqrt(1 + (ray_dir_y * ray_dir_y) / (ray_dir_x * ray_dir_x));
    var delta_dist_y = Math.sqrt(1 + (ray_dir_x * ray_dir_x) / (ray_dir_y * ray_dir_y));

    //track whether we're moving in a positive or negative direction on x and y axes
    var step_x;
    var step_y;

    // track if we hit a vertical or horizontal boundary
    var side;

    //calculate step and side distances
    if (ray_dir_x < 0) {
        step_x = -1;
        side_dist_x = (ray_pos_x - map_x) * delta_dist_x;
    } else {
        step_x = 1;
        side_dist_x = (map_x + 1.0 - ray_pos_x) * delta_dist_x;
    }

    if (ray_dir_y < 0) {
        step_y = -1;
        side_dist_y = (ray_pos_y - map_y) * delta_dist_y;
    } else {
        step_y = 1;
        side_dist_y = (map_y + 1.0 - ray_pos_y) * delta_dist_y;
    }

    var distance = 0.01;
    var height   = map_heights[map_y][map_x];
    var color    = (render_mode === 0 ? map_types[map_y][map_x] : [255, 255, 255]);

    var min_y = game.height;

    var is_edit = false;

    // loop until we're out of range. to simplify floor drawing, we check mid loop
    while(true) {

        // get the distance for the next block boundary in the map
        var next_distance;
        if (side == 0) {
            next_distance = (map_x - ray_pos_x + (1 - step_x) / 2) / ray_dir_x;
        } else {
            next_distance = (map_y - ray_pos_y + (1 - step_y) / 2) / ray_dir_y;
        }
        if (next_distance < 0.01) next_distance = 0.01;

        // draw the floor!
        min_y = drawFloor(column, height - (cam_height + PLAYER_HEIGHT),  distance, next_distance, block_types[color], is_edit, min_y);

        distance = next_distance;

        // break out of the loop if we've gone out of bounds
        if (!isInBounds(map_x, map_y)) {
            break;
        }

        // are we drawing the block currently selected for editing?
        is_edit = (edit_x == map_x && map_y == edit_y);

        // draw the wall!
        var next_color = (render_mode === 0 ? map_types[map_y][map_x] : [255, 255, 255]);
        next_height = map_heights[map_y][map_x];
        if (next_height > height) {
            min_y = drawWall(column, height - (cam_height + PLAYER_HEIGHT), next_height - (cam_height + PLAYER_HEIGHT), distance, block_types[next_color], is_edit, side, min_y);
        }
        height = next_height;
        color  = next_color;

        // and advance the ray in the map!
        if (side_dist_x < side_dist_y) {
            side_dist_x += delta_dist_x;
            map_x += step_x;
            side = 0;
        } else {
            side_dist_y += delta_dist_y;
            map_y += step_y;
            side = 1;
        }
    }


}

// function colorWithShade(color_components, shade) {
//     var v = (255*3) * shade;
//     c = [0, 0, 0];
//     if (v > 255) {
//         c[0] = 255;
//         v -= 255;
//     }
//     if (v > 255) {
//         c[1] = 255;
//         v -= 255;
//     }
//     c[2] = Math.floor(v);
//     return game.color(c[0], c[1], c[2]);
// }

function colorWithShade(color_components, shade) {
    return game.color(color_components[0]*shade, color_components[1]*shade, color_components[2]*shade);
}


const MIN_LIGHT = 0.0;
const MAX_LIGHT = 1.0;
const MIN_LIGHT_DISTANCE = 20.0;

function shadeForDistance(distance) {
    if (distance > MIN_LIGHT_DISTANCE) return MIN_LIGHT;
    return MAX_LIGHT + (MIN_LIGHT - MAX_LIGHT) * (distance / MIN_LIGHT_DISTANCE);
}


function shadeWall(distance, is_edit, side) {
    var shade = side === 1 ? 1.0 : 0.75;
    if (!is_edit) shade *= shadeForDistance(distance);
    return shade;
}

function shadeWall(distance, is_edit, side) {
    var shade = side === 1 ? 1.0 : 0.75;
    if (!is_edit) shade *= shadeForDistance(distance);
    return shade;
}


function drawWall(column, height1, height2, distance, color, is_edit, side, min_y) {
    if (render_mode === 0) {
        var shade = shadeWall(distance, is_edit, side);
        var c = colorWithShade(color.color, shade);
    } else {
        var shade = shadeForDistance(distance);
        var c = colorWithShade([255, 255, 255], shade)
    }

    var y1  =  game.height / 2 - SCALE * height1 / distance;
    var y2  =  game.height / 2 - SCALE * height2 / distance;

    y1 = Math.min(y1, min_y);
    min_y = Math.min(min_y, y2);

    if (y1 > y2)
        game.drawRect(column, y1, 1, y2 - y1, c);

    return min_y;
}

function drawFloor(column, height, distance1, distance2, color, is_edit, min_y) {
    if (render_mode === 0) {
        var shade = 0.85;
        if(!is_edit) shade *= shadeForDistance(distance1);
        var c = colorWithShade(color.color, shade);
    } else {
        var shade = shadeForDistance((distance1 + distance2) / 2);
        var c = colorWithShade([255, 255, 255], shade);
    }

    var y1  = game.height / 2 - SCALE * height / distance1;
    var y2  = game.height / 2 - SCALE * height / distance2;

    y1 = Math.min(y1, min_y);
    min_y = Math.min(min_y, y2);

    if (y1 > y2)
        game.drawRect(column, y1, 1, y2 - y1, c);

    return min_y;
}

// convert degrees to radians
function degreesToRadians(d) {
    return (d * Math.PI) / 180.0;
}

function isInBounds(x, y) {
    if (x < 0 || y < 0 || x >= map_types[0].length || y >= map_types.length) {
        return false;
    }
    return true;
}

function isCollision(x, y) {
    if (!isInBounds(x, y)) return true;
    return map_heights[Math.floor(y)][Math.floor(x)] > cam_height + MAX_STEP_SIZE + 0.1;
}

function applyPlayerPhysics() {

    var new_x = cam_x + cam_vel_x * 2;
    var new_y = cam_y + cam_vel_y * 2;

    if (isCollision(new_x, new_y)) {
        cam_vel_x *= -0.5;
        cam_vel_y *= -0.5;
    } else if (isCollision(cam_x, new_y)) {
        cam_vel_y *= -0.5;
    } else if (isCollision(new_x, cam_y)) {
        cam_vel_x *= -0.5;
    }

    // update position
    cam_x += cam_vel_x;
    cam_y += cam_vel_y;



    // apply air pressure so we slow down if we let up on the keys
    cam_vel_x *= 0.9
    cam_vel_y *= 0.9;

    // dame for rotation, apply and slow down
    cam_angle += cam_vel_a;
    cam_vel_a *= 0.7;

    // if we're in the air or jumping apply the vertical velocity.
    var h = cam_height - map_heights[Math.floor(cam_y)][Math.floor(cam_x)];

    if (cam_vel_vert > 0 || h > 0.01) {
        cam_height += cam_vel_vert;
        cam_vel_vert -= 0.2;
    } else {
        if (h < 0.1) {
            cam_vel_vert = -h / 2;
        } else {
            cam_vel_vert = 0;
        }
    }

    color = block_types[map_types[Math.floor(cam_y)][Math.floor(cam_x)]];
    if (h < 0.01) {
        if (color.poision) {
            game.advanceState();
        }
        if (color.bounce > 0) {
            cam_vel_vert = color.bounce;
        }
    }
}

// render doom-style game over screen!
var update_game_over_calls = 0;
function updateScreenGameOver() {
    update_game_over_calls += 1;

    game.draw_fps = false;

    if (update_game_over_calls < 30*2) {
        game.drawRect(0, 0, game.width, 30, "red");

        for (var i = 0; i < 100; i++) {
            var x = game.randInt(-100, game.width - 100);
            var y = game.randInt(0, game.height - 20);

            var imgData=game.ctx.getImageData(x, y, 200, 40);
            game.ctx.putImageData(imgData, x, y + 15);
        }
    } else {
        game.drawText("Game Over!", {size:80, color:"white", x:game.width/2, y: game.height / 2 + 50, align:'center'});
        game.drawText("Game Over!", {size:80, color:"black",   x:game.width/2 + 1, y: game.height / 2 + 50 + 2, align:'center'});
    }
}


// convert a depth-map on the scree into a stereogram
function convertToStereogram() {
    var constraints = Array(game.width);
    var imageData = game.ctx.getImageData(0, 0, game.width, game.height);
    for (var y = 0; y < game.height; y++) {
        for (var x = 0; x < game.width; x++) {
            constraints[x] = x;
        }

        for (var x = 0; x < game.width; x++) {
            // index in the image data
            var i = (y * game.width + x) * 4;

            // z coordinate at point x
            var z = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / (255*3);

            // stereographic separation at point x
            var s = stereoSeperation(z);

            // add constraints
            var p2 = x + Math.floor(s/2);

            var p1 = p2 - s;

            if (p1 >= 0 && p2 < game.width) {
                constraints[p2] = p1;
            }
        }

        for (var x = 0; x < game.width; x++) {
            // index in the image data
            var write_index = (y * game.width + x) * 4;
            if (constraints[x] == x) {
                var c = Math.random() > 0.5 ? 255 : 0;
                imageData.data[write_index] = imageData.data[write_index+1] = imageData.data[write_index+2] = c;
            } else {
                if (render_mode == 2) {
                    // deal with floating point constraint by taking nearest neighbor
                    var source_index = (y * game.width + Math.floor(constraints[x])) * 4;
                    imageData.data[write_index] = imageData.data[write_index+1] = imageData.data[write_index+2] = imageData.data[source_index];

                } else {
                    // deal with floating point constraint by blending

                    var source_index1 = (y * game.width + Math.floor(constraints[x])) * 4;
                    var source_index2 = (y * game.width + Math.ceil(constraints[x])) * 4;

                    // our position between the two pixels
                    var f = constraints[x] - Math.floor(constraints[x]);
                    var c = imageData.data[source_index1] * (1.0 - f) + imageData.data[source_index2] * f;
                    imageData.data[write_index] = imageData.data[write_index+1] = imageData.data[write_index+2] = c;
                }
            }
        }
    }

    game.ctx.putImageData(imageData, 0, 0);
}

function stereoSeperation(z) {
    return ((1 - DEPTH_OF_FIELD*z) / (2 - DEPTH_OF_FIELD*z)) * EYE_SEPARATION;
}

