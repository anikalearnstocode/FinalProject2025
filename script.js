let plopSound;

function preload() {
    plopSound = loadSound('plop.mp3');
}

let ripples = []; //declare ripples!

function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill();

}

function draw() {
    background(135, 206, 235, 50); //last value is for slight transparency

    for (let i = ripples.length - 1; i>= 0; i--) {
        if (ripples[i]) {
            ripples[i].expand();
            ripples[i].display();
        

            //remove ripples when fully faded
            if (ripples[i].isFaded()) {
                ripples.splice(i, 1); 
            }
        }
    }
}

function mousePressed() {
    //console.log("Mouse clicked at:", mouseX, mouseY); //tester to make sure mousePressed is running
    
    // if(plopSound) {
    //     plopSound.play();

    // let r = new Ripple(mouseX, mouseY);
    // console.log("Created ripple:", r); //another test!
    // ripples.push(r);

    if(plopSound && plopSound.isLoaded()) {
        plopSound.play();
    }

    let r = new Ripple(mouseX, mouseY);
    ripples.push(r);

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
    }

    expand() {
        this.radius += 12;
        //this.alpha -= 10;
        this.alpha = map(this.radius, 0, this.maxRadius, 255, 0);

    }

    display() {
        // noFill();
        // stroke(255, this.alpha);
        // strokeWeight(6);
        // ellipse(this.x, this.y, this.radius * 2);
    
        noFill();
        let dynamicStroke = map(this.radius, 0, this.maxRadius, 6, 1); //lines get thinner as they expand
        strokeWeight(dynamicStroke);
        stroke(100, 150, 255, this.alpha); 
        ellipse(this.x, this.y, this.radius * 2);
    
    }

    isFaded() {
        return this.alpha <= 0 ;
    }
}