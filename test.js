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

// Define background big rectangles
class FeatureRectangles {
    constructor(x, y, w, h, color) {
        this.x = x; // Normalized x position (percentage of insideCanvas width)
        this.y = y; // Normalized y position (percentage of insideCanvas height)
        this.w = w; // Normalized width (percentage of insideCanvas width)
        this.h = h; // Normalized height (percentage of insideCanvas height)
        this.color = color;
        this.drawX = this.x;
        this.drawY = this.y;
        this.drawW = this.w;
        this.drawH = this.h;
        this.angle = 0; // Add an angle property
    }

    display() {
        push();
        translate(this.drawX + this.drawW / 2, this.drawY + this.drawH / 2);  // Move origin to the centre of the rect
        rotate(this.angle); // Apply rotation
        fill(this.color);
        noStroke();
        rect(-this.drawW / 2, -this.drawH / 2, this.drawW, this.drawH); // Draw the rectangle with the new origin
        pop(); // Restore the previous drawing state
    }

    updateSize(insideCanvasWidth, insideCanvasHeight) {
        this.drawX = this.x * insideCanvasWidth + insideCanvas.x;
        this.drawY = this.y * insideCanvasHeight + insideCanvas.y;
        this.drawW = this.w * insideCanvasWidth;
        this.drawH = this.h * insideCanvasHeight;
    }

    updateAngle(amplitude) {
        this.angle = map(amplitude, 0, 255, 0, 1440); // Update the angle based on the amplitude
    }
}

// Create variable to analyze song
let song;

// Pre-set music to pause status
let isPlaying = false;


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
// Array to generate featured rectangles
let featuredRectArray = [];

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

    generateFeaturedRectangles();
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
    drawFrame();

    // Display and update each featured rectangle
    drawFeaturedRectangles();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // Update insideCanvas dimensions
    insideCanvas.updateDimensions();
}
function keyPressed() {
    if (key === ' ') {  // Press space key to start and pause song
        togglePlayPause();
    }
}

function togglePlayPause() {
    if (song.isPlaying()) {
        song.pause();
        // Hide small rects
        showSmallRects = false;
    } else {
        song.loop();  // Loop the song instead of just playing it once
        // Show small rects
        showSmallRects = true;
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

// Draw the purple radiant frame for the canvas
function drawFrame() {
    for (let i = 0; i < 30; i++) {
        noFill();
        stroke(73 + 3 * i, 38 + i, 1 + i);
        let frameX = insideCanvas.x - i / 2;
        let frameY = insideCanvas.y - i / 2;
        let frameWidth = insideCanvas.width + i;
        let frameHeight = insideCanvas.height + i;
        rect(frameX, frameY, frameWidth, frameHeight);
    }
}

// Draw featured big rectangles in fixed position
// Record the position of each rectangles
function featuredRectanglesDataArray() {
    return [
        // Lime Green Rectangles
        { x: 0, y: 1 / 3, w: 1 / 12.5, h: 1 / 6, color: limeGreen },
        { x: 3 / 11, y: 3 / 8, w: 1 / 15, h: 1 / 6, color: limeGreen },
        { x: 6.44 / 14, y: 1 / 6.7, w: 1 / 25, h: 1 / 10, color: limeGreen },
        { x: 11.2 / 14, y: 1 / 4, w: 1 / 40, h: 1 / 10, color: limeGreen },
        { x: 6.2 / 14, y: 1 / 1.25, w: 1 / 35, h: 1 / 10, color: limeGreen },

        // Rose Red Rectangles
        { x: 1.2 / 11, y: 1 / 6, w: 1 / 25, h: 1 / 12, color: roseRed },
        { x: 2.4 / 11, y: 1 / 10, w: 1 / 15, h: 1 / 10, color: roseRed },
        { x: 5.72 / 11, y: 1 / 8.5, w: 1 / 40, h: 1 / 10, color: roseRed },
        { x: 17 / 18, y: 1 / 8, w: 1 / 35, h: 1 / 10, color: roseRed },
        { x: 7.04 / 11, y: 1 / 3.35, w: 1 / 35, h: 1 / 10, color: roseRed },
        { x: 1.97 / 11, y: 4.5 / 10, w: 1 / 10.6, h: 1 / 8, color: roseRed },
        { x: 1 / 10, y: 8 / 10, w: 1 / 16.7, h: 1 / 10, color: roseRed },
        { x: 4.73 / 10, y: 1 / 1.25, w: 1 / 25, h: 1 / 10, color: roseRed },

        // Line Purple Rectangles
        { x: 1 / 10, y: 3.3 / 7, w: 1 / 17.5, h: 1 / 12, color: linePurple },
        { x: 1 / 8.5, y: 1 / 1.6, w: 1 / 40, h: 1 / 13.3, color: linePurple },
        { x: 1 / 5, y: 1 / 1.335, w: 1 / 20, h: 1 / 6.6, color: linePurple },
        { x: 1 / 3.4, y: 1 / 1.6, w: 1 / 20, h: 1 / 14, color: linePurple },
        { x: 1 / 1.25, y: 1 / 1.54, w: 1 / 25, h: 1 / 8, color: linePurple },
        { x: 1 / 1.285, y: 1 / 4, w: 1 / 16, h: 1 / 10, color: linePurple },

        // Milk Yellow Rectangles
        { x: 3 / 11, y: 2.4 / 8, w: 1 / 15, h: 1 / 12, color: milkYellow },
        { x: 3 / 11, y: 4.3 / 8, w: 1 / 15, h: 1 / 28, color: milkYellow },
    ];
}

function generateFeaturedRectangles() {
    let dataArray = featuredRectanglesDataArray();
    for (let i = 0; i < dataArray.length; i++) {
        let data = dataArray[i];
        let rect = new FeatureRectangles(data.x, data.y, data.w, data.h, data.color);
        featuredRectArray.push(rect);
    }
}

function drawFeaturedRectangles() {
    let amplitude = fft.getEnergy(20, 20000); // Get the amplitude for the entire frequency range
    for (let i = 0; i < featuredRectArray.length; i++) {
        let rect = featuredRectArray[i];
        rect.updateSize(insideCanvas.width, insideCanvas.height);
        rect.updateAngle(amplitude); // Update the rotation angle
        rect.display();
    }
}
