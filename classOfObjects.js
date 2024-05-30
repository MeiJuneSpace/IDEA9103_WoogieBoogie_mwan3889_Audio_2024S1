// This file to for objects classes

// Define a class to organise dimension variables

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

// Define background purple lines
class PurpleLine {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.drawX = this.x;
        this.drawY = this.y;
        this.drawW = this.w;
        this.drawH = this.h;
    }

    display() {
        fill(linePurple);
        rect(this.drawX, this.drawY, this.drawW, this.drawH);
    }

    updateSize(insideCanvasWidth, insideCanvasHeight) {
        this.drawX = this.x * insideCanvasWidth + insideCanvas.x;
        this.drawY = this.y * insideCanvasHeight + insideCanvas.y;
        this.drawW = this.w * insideCanvasWidth;
        this.drawH = this.h * insideCanvasHeight;
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
