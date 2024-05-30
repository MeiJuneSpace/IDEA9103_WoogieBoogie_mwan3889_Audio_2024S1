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




## Rectangle Rotation
##### Original Code
###### Class Definition
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
    }

    display() {
        fill(this.color);
        rect(this.drawX, this.drawY, this.drawW, this.drawH);
    }

    updateSize(insideCanvasWidth, insideCanvasHeight) {
        this.drawX = this.x * insideCanvasWidth + insideCanvas.x;
        this.drawY = this.y * insideCanvasHeight + insideCanvas.y;
        this.drawW = this.w * insideCanvasWidth;
        this.drawH = this.h * insideCanvasHeight;
    }
}
###### Corresponding Drawing function
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
    for (let i = 0; i < featuredRectArray.length; i++) {
        let rect = featuredRectArray[i];
        rect.updateSize(insideCanvas.width, insideCanvas.height);
        rect.display();
    }
}
##### Update Code
###### Class Definition
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
###### Corresponding Function
The position array and featured rectangles generation function remains the same.

function drawFeaturedRectangles() {
    let amplitude = fft.getEnergy(20, 20000); // Get the amplitude for the entire frequency range
    for (let i = 0; i < featuredRectArray.length; i++) {
        let rect = featuredRectArray[i];
        rect.updateSize(insideCanvas.width, insideCanvas.height);
        rect.updateAngle(amplitude); // Update the rotation angle
        rect.display();
    }
}



## Interaction Instruction
Press space on the keyboard to start playing song.
The small circles will dance with the rhythm of the background music.
By moving mouse up and down on the canvas, you can adjust the volume of the sound and see the corresponding changes of the size of circles.
By moving mouse from right to left, you can experience pan effect.