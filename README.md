# IDEA9103_WoogieBoogie_mwan3889_Audio_2024S1
This is the repository for IDEA9103 Final Project. The owner of the repo is mwan3889.

# Project Description

## Changes to the project file
Put the small rectangles creating function after the shadow function, to create a feeling of glitch of the whole canvas. The input inside the random() function also changes to create small rectangles outside of the frame canvas.
###### Update Code
  // This is the shadow of the whole canvas
  // This must be on the top of the canvas
  drawShadow();
  drawLightShadow();

// Draw small rectangles outside of the frame to create glitch effect
if (showSmallRects) {
    // drawSmallRectangles();
    drawRandomRects();
}
function drawRandomRects() {
    let colors = [limeGreen, roseRed, milkYellow];

    for (let i = 0; i < numOfSmallRects; i++) {
        fill(random(colors));
        let w = random(windowWidth/20);
        let h = random(windowHeight/20);
        let x = random(windowWidth);  // This ensures small rects are inside the frame
        let y = random(windowHeight); // This ensures small rects are inside the frame
        rect(x, y, w, h);  // Generate rectangles
    }
}
###### Original Code
// Draw small rectangles outside of the frame to create glitch effect
if (showSmallRects) {
    // drawSmallRectangles();
    drawRandomRects();
}
  // This is the shadow of the whole canvas
  // This must be on the top of the canvas
  drawShadow();
  drawLightShadow();
function drawRandomRects() {
    let colors = [limeGreen, roseRed, milkYellow];

    for (let i = 0; i < numOfSmallRects; i++) {
        fill(random(colors));
        let w = random(insideCanvas.width / 20);
        let h = random(insideCanvas.height / 20);
        let x = insideCanvas.x + random(insideCanvas.width - w);  // This ensures small rects are inside the frame
        let y = insideCanvas.y + random(insideCanvas.height - h); // This ensures small rects are inside the frame
        rect(x, y, w, h);  // Generate rectangles
    }
}

## Add fft for centred circles to animate them
###### original code
// This is the function to generate centred circles
function generateCentredCircle() {
    let featuredRectPos = getFeaturedRectPos();
    centredCircleArray = featuredRectPos.map(data => {
        let radius = min(data.w, data.h); // Calculate radius based on the smallest dimension of the rectangle
        return new circlesInRectangles(data.x + data.w / 2, data.y + data.h / 2, radius, data.color);
    });
    centredCircleArray.forEach(circle => circle.updateSize(insideCanvas.width, insideCanvas.height));
}

function drawCentredCircle() {
    for (let i = 0; i < centredCircleArray.length; i++) {
        let circle = centredCircleArray[i];
        circle.updateSize(insideCanvas.width, insideCanvas.height, scaleFactor);
        circle.display();
    }
}
###### Update Code
// Make an object to hold the FFT object
let fft;
let smoothing = 0.8;  // For the smoothing of the FFT
let numBins = 1024;
let spectrum = [];  // Fix spectrum when we stop the song
let amplitude;
// Generate circles based on the specific rect pos and change size based on fft
function generateCentredCircles() {
    let featuredRectPos = getFeaturedRectPos();

    centredCircleArray = featuredRectPos.map(data => {
        let radius = data.minDimension * min(windowWidth, windowHeight) / 2; // Calculate the start radius of the circles
        let circleColour = data.color;
        let centerX = insideCanvas.x + data.x * insideCanvas.width + data.w * insideCanvas.width / 2;
        let centerY = insideCanvas.y + data.y * insideCanvas.height + data.h * insideCanvas.height / 2;
        // Initialise the circle in the middle of the rect
        return new CircleInRects(centerX, centerY, radius, circleColour);
    });
}

function drawCentredCircle() {
    let scaleFactor = map(amplitude, 0, 255, 0.1, 3);  // This exaggerate the movement

    for (let i = 0; i < centredCircleArray.length; i++) {
        let circleInRect = centredCircleArray[i];
        circleInRect.updateSize(scaleFactor);
        circleInRect.display();
    }
}



## Interaction Instruction
Press space on the keyboard to start playing song.
The small circles will dance with the rhythm of the background music.
By moving mouse up and down on the canvas, you can adjust the volume of the sound and see the corresponding changes of the size of circles.
By moving mouse from right to left, you can experience pan effect.