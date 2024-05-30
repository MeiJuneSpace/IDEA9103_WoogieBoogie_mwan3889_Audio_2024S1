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

// Array to store small rectangles
let smallRectangles = [];
let numOfSmallRects = 40; // Initialise number of small random rectangles

// Array to store purple lines
let purpleLinesArray = [];

// Array to generate featured rectangles
let featuredRectArray = [];

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

  // Generate purple lines
  generatePurpleLines();
  // Create and add featured rectangles to the array
  generateFeaturedRectangles();
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
  drawFrame();

  // Draw purple lines in the canvas
  // This must be at the bottom of the canvas
  drawPurpleLines();

  // Display and update each featured rectangle
  drawFeaturedRectangles();
  // Draw circles in rect
  drawCentredCircle();

  // Draw small rectangles outside of the frame to create glitch effect
  if (showSmallRects) {
    drawRandomRects();
  }

  // This is the shadow of the whole canvas
  // This must be on the top of the canvas
  drawShadow();
  drawLightShadow();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Update insideCanvas dimensions
  insideCanvas.updateDimensions();

  // Regenerate purple lines
  generatePurpleLines();

  // Regenerate small rectangles
  generateSmallRectangles();

  // Regenerate circles
  generateCentredCircles();
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