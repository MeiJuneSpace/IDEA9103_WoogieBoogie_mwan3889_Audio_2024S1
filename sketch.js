// Define colours
let limeGreen, roseRed, milkYellow, linePurple, shallowPurple;

// Create dimension for inside canvas
let insideCanvas;

// Array to store small rectangles
let smallRectangles = [];
let numOfSmallRects = 60;

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

  // Generate small rectangles
  generateSmallRectangles();

  // Create and add featured rectangles to the array
  generateFeaturedRectangles();

  generateCentredCircle();
}

function draw() {
  // This is background color
  background(255);
  // Draw canvas for the drawing elements
  drawInsideCanvas();
  drawFrame();

  // Draw purple lines in the canvas
  // This must be at the bottom of the canvas
  drawPurpleLines();

  // Draw small rectangles
  drawSmallRectangles();

  // Display and update each featured rectangle
  drawFeaturedRectangles();

  // Draw circles in the middle of specific rects
  drawCentredCircle();

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
}