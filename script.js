
// === GLOBAL VARIABLES ===
let fishImages = [];
let lilyImages = [];
let bgLayer;
let particles = [];
let rippleRings = [];
let fishArray = [];
let lilyPads = [];
let plopSound;
let spaMusic;
let started = false;


function preload() {

    // LOAD PICTURES
    fishImages.push(loadImage('fish1.png'));
    fishImages.push(loadImage('fish2.png'));
    fishImages.push(loadImage('fish3.png'));

    lilyImages.push(loadImage('lily1.png'));
    lilyImages.push(loadImage('lily2.png'));
    lilyImages.push(loadImage('lily3.png'));
    lilyImages.push(loadImage('lily4.png'));

    // LOAD SOUNDS
    plopSound = loadSound('plop.mp3');
    spaMusic = loadSound('spa.mp3');
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    bgLayer = createGraphics(windowWidth, windowHeight);
    noFill();

    document.getElementById("startButton").addEventListener("click", startExperience);

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    let lilyCount = int(random(3, 6));
    for (let i = 0; i < lilyCount; i++) {
        lilyPads.push(new LilyPad());
    }

    let fishCount = int(random(3, 7));
    for (let i = 0; i < fishCount; i++) {
        fishArray.push(new Fish());
    }
}

function startExperience() {
    userStartAudio();
    document.getElementById("overlay").style.display = "none";
    started = true;

    if (spaMusic && !spaMusic.isPlaying()) {
        console.log("Trying to play spa music...");
        spaMusic.setLoop(true);
        spaMusic.setVolume(0.5);
        spaMusic.play().then(() => {
            console.log("Spa music started!");
        }).catch(err => {
            console.error("Music play failed:", err);
        });
    }
}


function draw() {
    drawGradientBackground();
    image(bgLayer, 0, 0, width, height);

    // FISH (under ripples)
    for (let i = fishArray.length - 1; i >= 0; i--) {
        fishArray[i].move();
        fishArray[i].display();
        if (fishArray[i].isDone()) {
            fishArray.splice(i, 1);
        }
    }

    // PARTICLES
    for (let p of particles) {
        p.move();
        p.display();
    }

    // RIPPLE RINGS
    for (let i = rippleRings.length - 1; i >= 0; i--) {
        rippleRings[i].expand();
        rippleRings[i].display();
        if (rippleRings[i].isFaded()) {
            rippleRings.splice(i, 1);
        }
    }

    // LILYPADS (above ripples)
    for (let pad of lilyPads) {
        pad.move();
        pad.display();
    }

    // Occasionally spawn new fish
    if (random(1) < 0.01 && fishArray.length < 6) {
        fishArray.push(new Fish());
    }

    if (!started) return;
}



function drawGradientBackground() {
    let color1 = color(207, 237, 255);
    let color2 = color(14, 83, 105);

    let amt = map(sin(frameCount * 0.002), -1, 1, 0, 1);
    let blendedTop = lerpColor(color1, color2, amt);
    let blendedBottom = lerpColor(color2, color1, amt);

    bgLayer.clear();

    let yOffset = frameCount * 0.1;

    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(blendedTop, blendedBottom, inter);
        bgLayer.stroke(c);
        bgLayer.line(0, y, width, y);
    }
}


function mousePressed() {

    if (plopSound && plopSound.isLoaded()) {
        plopSound.play();
    }

    for (let i = 0; i < 5; i++) {
        rippleRings.push(new RippleRing(mouseX, mouseY));
    }

    if (!started) return;

}

class Ripple {
    //constructor
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.alpha = 255;
        this.maxRadius = random(150, 900);
        this.history = [];
    }

    expand() {
        this.radius += 12;
        this.alpha = map(this.radius, 0, this.maxRadius, 255, 0);

        this.history.push(this.radius);

    }

    display() {
        noFill();
        strokeWeight(1);
        for (let r of this.history) {
            let alphaValue = map(r, 0, this.maxRadius, 255, 0);
            stroke(255, 0, 0, this.alpha);
            ellipse(this.x, this.y, this.radius * 2);
        }
    }

    isFaded() {
        return this.alpha <= 0;
    }
}

class Particle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(1, 4);
        this.speedX = random(-0.5, 0.5);
        this.speedY = random(-0.5, 0.5);
        this.alpha = random(100, 200);
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // wrap around the edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    display() {
        noStroke();
        fill(200, 220, 255, this.alpha);
        ellipse(this.x, this.y, this.size);
    }
}

class RippleRing {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = random(0.10);
        this.alpha = 255;
        this.growth = random(1.5, 3);
    }

    expand() {
        this.radius += this.growth; // slower, finer expansion
        this.alpha -= 2; // fade out smoothly
    }

    display() {
        noFill();
        strokeWeight(2);
        stroke(204, 223, 230, this.alpha);
        ellipse(this.x, this.y, this.radius * 2);
    }

    isFaded() {
        return this.alpha <= 0;
    }
}

class Fish {
    constructor() {
        this.img = random(fishImages);
        this.x = random(width);
        this.y = random(height);
        this.size = random(100, 210);
        this.alpha = 0;
        this.fadeSpeed = random(0.5, 1);
        this.lifetime = int(random(200, 400));
        this.age = 0;
        this.angle = random(TWO_PI);
        let speed = random(0.3, 0.6);
        this.vx = cos(this.angle) * speed;
        this.vy = sin(this.angle) * speed;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
        this.age++;

        // Fade in then out
        if (this.age < this.lifetime / 2) {
            this.alpha = min(this.alpha + this.fadeSpeed, 255);
        } else {
            this.alpha = max(this.alpha - this.fadeSpeed, 0);
        }

        for (let other of fishArray) {
            if (other !== this) {
                let d = dist(this.x, this.y, other.x, other.y);
                let minDist = (this.size + other.size) / 2;
                if (d < minDist) {
                    // Push them away from each other
                    let angle = atan2(this.y - other.y, this.x - other.x);
                    this.vx += cos(angle) * 0.1;
                    this.vy += sin(angle) * 0.1;
                }
            }
        }

        this.angle += random(-0.01, 0.01);
        this.vx = cos(this.angle) * 0.5;
        this.vy = sin(this.angle) * 0.5;
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        tint(255, this.alpha);
        imageMode(CENTER);
        image(this.img, 0, 0, this.size, this.size);
        imageMode(CORNER); 
        noTint();
        pop();
    }

    isDone() {
        return this.alpha <= 0 && this.age >= this.lifetime;
    }
}

class LilyPad {
    constructor() {
        this.img = random(lilyImages);
        this.x = random(width);
        this.y = random(height);
        this.size = random(150, 380);
        this.vx = random(-0.6, 0.6);
        this.vy = random(-0.6, 0.6);
        this.alpha = 0;

        //start off screen
        const side = floor(random(4));
        if (side === 0) {
            this.x = -this.size;
            this.y = random(height);
        } else if (side === 1) {
            this.x = width + this.size;
            this.y = random(height);
        } else if (side === 2) {
            this.x = random(width);
            this.y = -this.size;
        } else {
            this.x = random(width);
            this.y = height + this.size;
        }
    }

    checkCollisions() {
        for (let other of lilyPads) {
            if (other !== this) {
                let d = dist(this.x, this.y, other.x, other.y);
                let minDist = (this.size + other.size) / 2;
                if (d < minDist) {
                    // Simple bounce: reverse direction
                    let angle = atan2(this.y - other.y, this.x - other.x);
                    let overlap = minDist - d;
                    this.x += cos(angle) * (overlap / 2);
                    this.y += sin(angle) * (overlap / 2);
                    this.vx = cos(angle) * abs(this.vx);
                    this.vy = sin(angle) * abs(this.vy);
                }
            }
        }
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        // fade in
        if (this.alpha < 255) {
            this.alpha += 1.5;
        }
          
        // wrap around edges
        if (this.x < -this.size) this.x = width;
        if (this.x > width + this.size) this.x = 0;
        if (this.y < -this.size) this.y = height;
        if (this.y > height + this.size) this.y = 0;

        this.checkCollisions();

    }

    display() {
        push();
        tint(255, this.alpha);
        image(this.img, this.x, this.y, this.size, this.size);
        noTint();
        pop();

    }
}
