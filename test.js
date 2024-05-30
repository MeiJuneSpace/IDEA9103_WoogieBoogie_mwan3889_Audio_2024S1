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

    display() {
        noFill();
        stroke(0);
        rect(this.x, this.y, this.width, this.height);
    }
}

// Create variable to analyze song
let song;
// Pre-set music to pause status
let isPlaying = false;

// Make an object to hold the FFT object
let fft;
let smoothing = 0.8;  // For the smoothing of the FFT
let numBins = 1024;
let amplitude;
// Fix the spectrum after we stop the song
let spectrum = [];

// Preset small rects to false to hide them
let showSmallRects = false;

// Define colours
let limeGreen, roseRed, milkYellow, linePurple, shallowPurple;

// Create dimension for inside canvas
let insideCanvas;

// Number of small rects
let numOfSmallRects = 10;

// Noise offsets for small rects
let noiseOffsetX = [];
let noiseOffsetY = [];

// Load sound file before setup() function runs
function preload() {
    //audio file from freesound https://freesound.org/people/multitonbits/sounds/383935/?
    song = loadSound("assets/03HonkyTonkTrainBlues.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Set up a tool to analyze sound's amplitude
    // Initialize FFT
    fft = new p5.FFT(smoothing, numBins);
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

    // Initialize noise offsets
    for (let i = 0; i < numOfSmallRects; i++) {
        noiseOffsetX.push(random(1000));
        noiseOffsetY.push(random(1000));
    }
}

function draw() {
    // This is background color
    background(255);

    if(song.isPlaying()) {
        spectrum = fft.analyze();
    }

    amplitude = fft.getEnergy(20, 20000);
    // Draw the insideCanvas
    insideCanvas.display();

    // Draw the small rects following the mouse
    if (showSmallRects) {
        drawSmallRects();
    }
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

function drawSmallRects() {
    let colors = [limeGreen, roseRed, milkYellow];
    noStroke();

    for (let i = 0; i < numOfSmallRects; i++) {
        fill(random(colors));
        let w = random(insideCanvas.width / 20);
        let h = random(insideCanvas.height / 20);

        let noiseX = noise(noiseOffsetX[i]) * 100 - 50;  // Generate noise-based offset
        let noiseY = noise(noiseOffsetY[i]) * 100 - 50;  // Generate noise-based offset

        // Constrain the mouse position within the insideCanvas bounds
        let constrainedX = constrain(mouseX, insideCanvas.x, insideCanvas.x + insideCanvas.width);
        let constrainedY = constrain(mouseY, insideCanvas.y, insideCanvas.y + insideCanvas.height);

        // Generate small rects positions based on the constrained mouse position
        let x = constrainedX + noiseX;
        let y = constrainedY + noiseY;

        // Ensure the small rects stay within insideCanvas
        x = constrain(x, insideCanvas.x, insideCanvas.x + insideCanvas.width - w);
        y = constrain(y, insideCanvas.y, insideCanvas.y + insideCanvas.height - h);

        rect(x, y, w, h);

        // Update noise offsets for smooth animation
        noiseOffsetX[i] += 0.01;
        noiseOffsetY[i] += 0.01;
    }
}
