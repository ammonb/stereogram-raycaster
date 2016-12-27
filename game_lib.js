/*
This is a simple library for learning to program games in JavaScript.
The goal is to hide as much complexity / housekeeping as possible,
and just expose a simple drawing functions. I wrote this for a class
that I taught at a public library. My goal was to simulate the
simplicity of the QBasic environment where I learned to program.
*/


class ALGame {
    constructor(width=600, height=600) {
        // Save the width and height of the display
        this.width  = width;
        this.height = height;

        // Create the canvas for our display, set width and height, and add to the body of the page
        this.canvas = document.createElement("canvas");
        this.canvas.id = "ALGameCanvas";
        this.canvas.width  = width;
        this.canvas.height = height;

        document.getElementsByTagName('body')[0].appendChild(this.canvas);

        this.hiddenCanvas = document.createElement("canvas");
        this.hiddenCanvas.width  = width;
        this.hiddenCanvas.height = height;
        this.backgroundColor = "red";

        this.ctx  =  this.hiddenCanvas.getContext("2d");

        this.game_states = []

        // Used to track how long the system takes to render a frame
        this.render_time = 0;

        // Track what keys are down
        this.pressed_keys = {};
        this.pressed_fetch_times = {};

        // Cache images by URL
        this.image_cache = {}

        this.last_text_y = 0;
        this.last_text_x = 0;

         // Cache audio objects by URL
        this.audio_cache = {}

        this.draw_fps = false;
    }

    addGameState(render_callback) {
        this.game_states.push(render_callback);
    }

    advanceState() {
        this.game_states.shift();
    }

    setBackgroundColor(color) {
        this.backgroundColor = color;
        this.canvas.style.backgroundColor = this.hiddenCanvas.style.backgroundColor = color;
    }

    start(framerate = 30) {
        // register key press handlers
        self = this;
        window.addEventListener('keydown', function(e) {
            self.pressed_keys[e.keyCode] = true;
        }, false);

        window.addEventListener('keyup', function(e) {
            self.pressed_keys[e.keyCode] = false;
        }, false);


        // call the frame update delegate
        function update() {
            var start = Date.now();

            if (self.game_states.length > 0) {

                self.last_text_y = 0;
                self.last_text_x = 0;

                self.game_states[0]();

                if (self.draw_fps) {
                    self.drawText("FPS: " + (Math.floor(1000 / self.render_time)), {x:20, y:70});
                }

                var ctx = self.canvas.getContext("2d");
                ctx.drawImage(self.hiddenCanvas, 0, 0);
            }

            // Keep a running average of how long it takes to render each frame
            self.render_time = self.render_time * 0.5 + (Date.now() - start) * 0.5;

            // And compute a delay to hit our target Framerate
            var delay = Math.max(0, (1000 - (framerate*self.render_time)) / framerate);

            window.setTimeout(update, delay);
        }

        window.setTimeout(update, 1000/framerate);
    }

    isKeyPressed(c, repeat_limit=0) {
        var code;
        if (typeof c === "string") {
            code = c.toUpperCase().charCodeAt(0);
        } else {
            code = c;
        }
        if (this.pressed_keys[code]) {
            if (!this.pressed_fetch_times[code] || Date.now() - this.pressed_fetch_times[code] > repeat_limit) {
                this.pressed_fetch_times[code] = Date.now();
                return true;
            }
            return false;
        }
        return false;
    }

    setLineWidth(width) {
        this.ctx.lineWidth=width;
    }

    color(r, g ,b) {
        return 'rgb(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')';
    }

    randInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    randColor() {
        return this.color(this.randInt(0, 256), this.randInt(0, 256), this.randInt(0, 256));
    }

    clearScreen() {
        self.drawRect(0, 0, self.width, self.height, this.backgroundColor);
        //self.ctx.clearRect(0, 0, self.width, self.height);
    }

    drawLine(x1, y1, x2, y2, color = "black") {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    drawRect(x, y, width, height, color = "black") {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawCircle(x, y, radius, color = "black") {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    drawImageUrl(url, x, y, width, height) {
        var img = this.image_cache[url];
        if (img === undefined) {
            img = new ALImage(url);
            this.image_cache[url] = img;
        }
        this.drawImage(img, x, y, width, height);
    }

    drawImage(image, x, y, width, height) {
        this.ctx.drawImage(image.img, x, y, width, height);
    }

    drawText(text, attributes={}) {
        var size = attributes.size || 30;
        var color = attributes.color || 'black';
        var x = attributes.x || Number.MIN_VALUE;
        var y = attributes.y || Number.MIN_VALUE;
        var font = attributes.font || 'Courier';
        var align = attributes.align || 'left';

        if (y === Number.MIN_VALUE) {
            y = this.last_text_y = this.last_text_y + size * 1.25;
        }

        if (x == Number.MIN_VALUE) {
            x = this.last_text_x;
        }

        this.ctx.font = '' + size + 'pt ' + font;
        this.ctx.textAlign = align;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    playSound(url, loop=false) {
        if (!this.audio_cache[url]) {
            this.audio_cache[url] = new Audio(url);
        }
        this.audio_cache[url].loop = loop;
        this.audio_cache[url].pause();
        this.audio_cache[url].currentTime = 0;
        this.audio_cache[url].play();
    }

    stopSound(url) {
        if (this.audio_cache[url]) {
            this.audio_cache[url].pause();
        }
    }
}

class ALImage {
    constructor(url) {
        this.img = new Image();
        this.img.src = url;
    }
}

const ARROW_UP = 38;
const ARROW_DOWN = 40;
const ARROW_LEFT = 37;
const ARROW_RIGHT= 39;
