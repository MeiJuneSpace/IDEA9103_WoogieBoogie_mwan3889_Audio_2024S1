class InsideCanvas {
    constructor() {
        this.updateDimensions();
    }

    updateDimensions() {
        // Set the ratio
        this.ratio = 5 / 2;

        // Calculate the width and height based on the window size while maintaining the ratio
        if (windowWidth / windowHeight >= this.ratio) {
            // Window is wider than the ratio, height is the limiting factor
            this.height = 3 * windowHeight / 5;
            this.width = this.height * this.ratio;
        } else {
            // Window is taller than the ratio, width is the limiting factor
            this.width = 4 * windowWidth / 5;
            this.height = this.width / this.ratio;
        }

        // Center the insideCanvas
        this.x = (windowWidth - this.width) / 2;
        this.y = (windowHeight - this.height) / 2;
    }
}

// Create circles based on the specific featured rectangles' pos
class CircleInRects {
    constructor(x, y, radius, color, relativeX, relativeY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.originalRadius = radius; // Create a variable to hold original radius
        this.relativeX = relativeX; // Store the initial relative positions
        this.relativeY = relativeY;
    }

    updateSize(scaleFactor) {
        this.radius = this.originalRadius * scaleFactor;
    }

    updatePosition(canvasX, canvasY, canvasWidth, canvasHeight) {
        this.x = canvasX + this.relativeX * canvasWidth;
        this.y = canvasY + this.relativeY * canvasHeight;
    }

    display() {
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }
}
// Create variable to analyze song
let song;

// Pre-set music to pause status
let isPlaying = false;

// Preset small rects to false to hide them
let showSmallRects = false;

// Set Volume and Pan Variables
let volume = 1.0; // Full volume
let pan = 0.0;  // Start of 0 in the middle of the canvas

// Make an object to hold the FFT object
let fft;
let smoothing = 0.8;  // For the smoothing of the FFT
let numBins = 1024;
let spectrum = [];  // Fix spectrum when we stop the song
let amplitude;

// Define colours
let limeGreen, roseRed, milkYellow, linePurple, shallowPurple;

// Create dimension for inside canvas
let insideCanvas;
// Array to generate centred circles in rectangles
let centredCircleArray = [];

// Load sound file before setup() function runs
function preload() {
    //audio file from freesound https://freesound.org/people/multitonbits/sounds/383935/?
    song = loadSound("assets/03HonkyTonkTrainBlues.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Set up a tool to analyze sound's amplitude
    // Initialize FFT
    fft = new p5.FFT(smoothing);
    song.connect(fft);

    // State parameter range to use opacity under HSB mode
    // The current project uses RGB as its default colour mode
    colorMode(RGB);
    angleMode(DEGREES);

    // Preset colours
    limeGreen = color(130, 255, 213);
    roseRed = color(190, 34, 74);
    milkYellow = color(225, 226, 208);
    linePurple = color(128, 132, 255);
    shallowPurple = color(216, 222, 255);

    // Initialise insideCanvas
    insideCanvas = new InsideCanvas();

    // Create circles in specific rect pos
    generateCentredCircles();
}

function draw() {
    // This is background color
    background(255);

    // Fix the spectrum after we stop the song
    if (song.isPlaying()) {
        spectrum = fft.analyze();
    }

    amplitude = fft.getEnergy(20, 20000);

    // Draw canvas for the drawing elements
    drawInsideCanvas();
    // Draw circles in rect
    drawCentredCircle();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // Update insideCanvas dimensions
    insideCanvas.updateDimensions();

    // Regenerate circles
    // generateCentredCircles();
    centredCircleArray.forEach(circle => {
        circle.updatePosition(insideCanvas.x, insideCanvas.y, insideCanvas.width, insideCanvas.height);
    });
}

function keyPressed() {
    if (key === ' ') {  // Press space key to start and pause song
        togglePlayPause();
    }
}

function togglePlayPause() {
    if (song.isPlaying()) {
        song.pause();

    } else {
        song.loop();  // Loop the song instead of just playing it once

    }
}

// Adjust volume and pan using mouse pos
function mouseMoved() {
    // Invert y value
    volume = map(mouseY, 0, height, 1, 0, true);  // Map it btw 1 and 0
    // true to keep value in the bound
    song.setVolume(volume);

    pan = map(mouseX, 0, width, -1.0, 1.0, true);
    song.pan(pan);
}

// Draw inside canvas based on the insideCanvas class
function drawInsideCanvas() {
    // Draw inside canvas
    fill(shallowPurple);
    noStroke();
    rect(insideCanvas.x, insideCanvas.y, insideCanvas.width, insideCanvas.height);
}

// Generate circles based on the specific rect pos and change size based on fft
function generateCentredCircles() {
    let featuredRectPos = getFeaturedRectPos();

    centredCircleArray = featuredRectPos.map(data => {
        let radius = data.minDimension * min(windowWidth, windowHeight) / 2; // Calculate the start radius of the circles
        let circleColour = data.color;
        let relativeX = data.x + data.w / 2;
        let relativeY = data.y + data.h / 2;
        let centerX = insideCanvas.x + data.x * insideCanvas.width + data.w * insideCanvas.width / 2;
        let centerY = insideCanvas.y + data.y * insideCanvas.height + data.h * insideCanvas.height / 2;
        // Initialise the circle in the middle of the rect
        return new CircleInRects(centerX, centerY, radius, circleColour, relativeX, relativeY);
    });
}

function drawCentredCircle() {
    let scaleFactor = map(amplitude, 0, 255, 0.1, 8);  // This exaggerate the movement

    for (let i = 0; i < centredCircleArray.length; i++) {
        let circleInRect = centredCircleArray[i];
        circleInRect.updateSize(scaleFactor);
        circleInRect.updatePosition(insideCanvas.x, insideCanvas.y, insideCanvas.width, insideCanvas.height); // Update position on every draw
        circleInRect.display();
    }
}

// Draw circles inside of specific rectangles
// Lets get the position of selected rectangles first
function getFeaturedRectPos() {
    let rects = [
        // In the lime green rects
        // Green 1
        { x: 0, y: 1 / 3, w: 1 / 12.5, h: 1 / 6, color: linePurple },
        // Green 2
        { x: 3 / 11, y: 3 / 8, w: 1 / 15, h: 1 / 6, color: linePurple },
        // In the rose red rects
        // Red 2
        { x: 2.4 / 11, y: 1 / 10, w: 1 / 15, h: 1 / 10, color: milkYellow },
        // Red 6
        { x: 1.97 / 11, y: 4.5 / 10, w: 1 / 10.6, h: 1 / 8, color: limeGreen },
        // Red 8
        { x: 4.73 / 10, y: 1 / 1.25, w: 1 / 25, h: 1 / 10, color: limeGreen },
        // In the purple rects
        // P2
        { x: 1 / 8.5, y: 1 / 1.6, w: 1 / 40, h: 1 / 13.3, color: roseRed },
        // P3
        { x: 1 / 5, y: 1 / 1.335, w: 1 / 20, h: 1 / 6.6, color: milkYellow },
        // P4
        { x: 1 / 3.4, y: 1 / 1.6, w: 1 / 20, h: 1 / 14, color: roseRed },
        // P5
        { x: 1 / 1.25, y: 1 / 1.54, w: 1 / 25, h: 1 / 8, color: roseRed },
    ];

    // Record minimum dimension of each specific rects to create circles
    rects = rects.map(rect => {
        rect.minDimension = min(rect.w, rect.h);
        return rect;
    });
    return rects;
}
