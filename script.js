let bgLayer;

let particles = [];

let plopSound;

let rippleRings = [];

function preload() {
    plopSound = loadSound('plop.mp3');
    plopSound.onError(() => {
        console.log("Failed to load sound.");
      });
}

//let ripples = []; //declare ripples!

function setup() {
    createCanvas(windowWidth, windowHeight);
    bgLayer = createGraphics(windowWidth, windowHeight);
    noFill();

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }

}

function draw() {
    drawGradientBackground();

    image(bgLayer, 0, 0, width, height);

    for (let p of particles) {
        p.move();
        p.display();
    }

    for (let i = rippleRings.length - 1; i >= 0; i--) {
        rippleRings[i].expand();
        rippleRings[i].display();
        if (rippleRings[i].isFaded()) {
            rippleRings.splice(i, 1);
        }
    }

    // for (let i = ripples.length - 1; i>= 0; i--) {
    //     if (ripples[i]) {
    //         ripples[i].expand();
    //         ripples[i].display();
        

    //         //remove ripples when fully faded
    //         if (ripples[i].isFaded()) {
    //             ripples.splice(i, 1); 
    //         }
    //     }
    // }

    // for (let i = 0; i < ripples.length; i++) {
    //     for (let j = i + 1; j < ripples.length; j++) {
    //         let r1 = ripples[i];
    //         let r2 = ripples[j];
    
    //         let d = dist(r1.x, r1.y, r2.x, r2.y);
    //         if (d < r1.radius + r2.radius) {
    //             // Collision happened, make them "blast" slightly
    //             r1.radius += 5;
    //             r2.radius += 5;
    //             r1.alpha = min(r1.alpha + 30, 255);
    //             r2.alpha = min(r2.alpha + 30, 255);
    //         }
    //     }
    // }
}

function drawGradientBackground() {
    let color1 = color(207, 237, 255);
    let color2 = color(14, 83, 105);

    let amt = map(sin(frameCount * 0.006), -1, 1, 0, 1);
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

    if(plopSound && plopSound.isLoaded()) {
        plopSound.play();
    }

    // let r = new Ripple(mouseX, mouseY);
    // ripples.push(r);

    for (let i = 0; i < 5; i++) {
        rippleRings.push(new RippleRing(mouseX, mouseY));
    }

}

//START OF CLASS
class Ripple {
    //constructor
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0; //start at 0 bc they expand
        this.alpha = 255; //this is for opacity - it'll go down as it expands
        this.maxRadius = random(150, 900); //adding in a feature so that each ripple end size will be random
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
            
            //stroke(204, 223, 230, this.alpha); 
            stroke(255,0,0, this.alpha); 
            ellipse(this.x, this.y, this.radius * 2);
        }
    
        // let dynamicStroke = map(this.radius, 0, this.maxRadius, 6, 1); //lines get thinner as they expand
        // strokeWeight(dynamicStroke);
        // stroke(204, 223, 230, this.alpha); 
        // ellipse(this.x, this.y, this.radius * 2);
    
    }

    isFaded() {
        return this.alpha <= 0 ;
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