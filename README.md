# Project Description
This is the repository for IDEA9103 Final Project Individual Submission.
The owner of the repo is mwan3889. The owner chose the audio to drive major visual effect of the image.

The original image of the current design is Piet Mondrian's *Broadway Boogie Woogie*. Please refer to group visual report for more details about group work code implementation and inspiration references.

## Interation Instruction
* Press the space to start music play.
* Move your mouse up and down the screen to adjust the volume of the music and see corresponding visual effect of the circles and rectangles.
* Move your mouse from left to right to hear the pan effect.

## Animated Image Properties
The current individual project achieves the animation effect through the following methods:

* Refreshing the background's randomly generated rectangles at the **draw()** function's refresh rate (60 times per second).
* Hiding all small rectangles until the user presses the *spacebar* to play music.
* Adjusting the size of the circles based on the amplitude of the background music.
* Modifying the rotation of the fixed position rectangles (i.e., large or featured rectangles) in response to the music's amplitude.
* Allowing the user to adjust the music's amplitude by moving the mouse up (increasing volume) or down (decreasing volume) on the canvas. This mouse interaction, combined with the animation properties of the circles and large rectangles, creates the overall dynamic effect of the artwork.
### Team Members' Animation
1. **TIAN's**: Click the PurpleLines - generating small circles move along the PurpleLines path.
2. **SHI's**: Use clock for time representation. Small rectangles will change position and colour based on the time variable. Shadow changes the position as time passes by.
3. **ZENG's**: The circles transform into small caterpillars floating in the image.

## File Arrangement
The owner of the repository used **classOfObejects.js** to group all the object elements and **elements.js** to group all the functions for svg image generation and drawing. All the other functions for mouse, keyboard interaction and variable statement are in the **sketch.js**.

# Details of Individual Approach
## Changes to the Project File
### Refresh Background Small Rectangles 60 Times Per Second
The original code created a static image with small, randomly generated rectangles. To achieve a more dynamic visual effect, the current code combines the rectangle generation and drawing into a single function within **draw()**. This approach continuously refreshes the page based on the frame rate, resulting in a more fluid and lively display.

The small rectangles will only be displayed if the music starts to play.
#### Original Code
```
function generateSmallRectangles() {
  let colors = [limeGreen, roseRed, milkYellow];
  smallRectangles = [];
  for (let i = 0; i < numOfSmallRects; i++) {
      let color = random(colors);
      let w = random(insideCanvas.width / 20);
      let h = random(insideCanvas.height / 20);
      let x = insideCanvas.x + random(insideCanvas.width - w);  // This ensures small rects are inside the frame
      let y = insideCanvas.y + random(insideCanvas.height - h); // This ensures small rects are inside the frame
      smallRectangles.push({ color, x, y, w, h });  // Push rect data into an object
  }
}
```
```
function drawSmallRectangles() {
  for (let smallRect of smallRectangles) {
      fill(smallRect.color);
      rect(smallRect.x, smallRect.y, smallRect.w, smallRect.h);
  }
}
```
#### Update Code
This code will be called in the **draw()** function directly.
```
// Randomly generate small rects based on draw frame
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
```
The small random circles will only be displayed if we hit music play.
```
  // Draw small rectangles outside of the frame to create glitch effect
  if (showSmallRects) {
    drawRandomRects();
  }
```
### Modification of Centred Circles
The designer utilised FFT to analyse the background audio frequency and animate centred circles accordingly. The circles will expand when the audio volume is high and contract when the volume is low.
#### Original code
```
// This is the function to generate centred circles
function generateCentredCircle() {
    let featuredRectPos = getFeaturedRectPos();
    centredCircleArray = featuredRectPos.map(data => {
        let radius = min(data.w, data.h); // Calculate radius based on the smallest dimension of the rectangle
        return new circlesInRectangles(data.x + data.w / 2, data.y + data.h / 2, radius, data.color);
    });
    centredCircleArray.forEach(circle => circle.updateSize(insideCanvas.width, insideCanvas.height));
}
```
```
function drawCentredCircle() {
    for (let i = 0; i < centredCircleArray.length; i++) {
        let circle = centredCircleArray[i];
        circle.updateSize(insideCanvas.width, insideCanvas.height, scaleFactor);
        circle.display();
    }
}
```
#### Update Code
The designer made variables to hold fft related objects.
```
// Make an object to hold the FFT object
let fft;
let smoothing = 0.8;  // For the smoothing of the FFT
let numBins = 1024;
let spectrum = [];  // Fix spectrum when we stop the song
let amplitude;
```
The designer made a class for circles to scale them based on the audio frequency analysis.
```
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
```
The author added scale factor in the codes to generate and draw centred circles:
```
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
```
The circle will rescale use the scale factor.
```
function drawCentredCircle() {
    let scaleFactor = map(amplitude, 0, 255, 0.1, 5);  // This exaggerate the movement

    for (let i = 0; i < centredCircleArray.length; i++) {
        let circleInRect = centredCircleArray[i];
        circleInRect.updateSize(scaleFactor);
        circleInRect.updatePosition(insideCanvas.x, insideCanvas.y, insideCanvas.width, insideCanvas.height); // Update position on every draw
        circleInRect.display();
    }
}
```
The circles will rescale and update their position if the window resized. However, the rescale effect is not prominent as they also changes size based on amplitude of the music.
```
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Update insideCanvas dimensions
  insideCanvas.updateDimensions();

  // Regenerate purple lines
  generatePurpleLines();

  // Regenerate small rectangles
  generateSmallRectangles();

  // Regenerate circles
  centredCircleArray.forEach(circle => {
    circle.updatePosition(insideCanvas.x, insideCanvas.y, insideCanvas.width, insideCanvas.height);
});
}
```
### Modification of Featured Rectangles

The designer updated the featured rectangle class to rotate the rectangles based on the background music fft.
#### Original Code
Original class definition of featured rectangles:
```
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
```
**Corresponding drawing function to generate and draw featured rectangles**

This function is used to record position of each featured rectangles on the interior canvas:
```
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
```
This function is used to generate featured rectangles in the **setup()**:
```
function generateFeaturedRectangles() {
    let dataArray = featuredRectanglesDataArray();
    for (let i = 0; i < dataArray.length; i++) {
        let data = dataArray[i];
        let rect = new FeatureRectangles(data.x, data.y, data.w, data.h, data.color);
        featuredRectArray.push(rect);
    }
}
```
This function is used to draw featured rectangles in the **draw()**:
```
function drawFeaturedRectangles() {
    for (let i = 0; i < featuredRectArray.length; i++) {
        let rect = featuredRectArray[i];
        rect.updateSize(insideCanvas.width, insideCanvas.height);
        rect.display();
    }
}
```
#### Update Code

The designer added *angle* variable in the class to rotate the rectangles.

In the display(), the designer used push(), pop() and translate() to rotate corresponding rectangles.

The updateAngle(amplitude) will rotate the rectangles based on the amplitude of the background music. You can see the effect by moving mouse up and down on the browser window to adjust the volume and experience the visual effect brought by volume adjustment.
```
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
```
The position array and the function for generating featured rectangles remain unchanged. Therefore, no replication of copy and paste here.

In the drawFeaturedRectangles() function, the author added rect.updateAngle(amplitude); to synchronize the rotation of the rectangles with the volume of the background music.
```
function drawFeaturedRectangles() {
    let amplitude = fft.getEnergy(20, 20000); // Get the amplitude for the entire frequency range
    for (let i = 0; i < featuredRectArray.length; i++) {
        let rect = featuredRectArray[i];
        rect.updateSize(insideCanvas.width, insideCanvas.height);
        rect.updateAngle(amplitude); // Update the rotation angle
        rect.display();
    }
}
```


## References
No extra references for the code, all the techniques are coming from the tutorials covered in IDEA9103.