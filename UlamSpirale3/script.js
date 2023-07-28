let canvas;
let ctx;
let xOff;
let yOff;
let pixelSize = 100;

function xOf() { return Math.floor(xOff); }
function yOf() { return Math.floor(yOff); }

function getTopLeftXY() {
    return [-posModulo(xOf(), pixelSize), -posModulo(yOf(), pixelSize)];
}

function drawUlam() {
    const [xStart, yStart] = getTopLeftXY();
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let r, g, b, a;
    for (let y = yStart; y < canvas.height; y += pixelSize) {
        for (let x = xStart; x < canvas.width; x += pixelSize) {
            let number = getUlamNumber((x + xOf()) / pixelSize, -(y + yOf()) / pixelSize);
            let isPrime = isPrimeSimple(number);
            if (number == 1) {
                // ctx.fillStyle = "red";
                r = 255; g = 0; b = 0; a = 255;
            }
            else if (isPrime) {

                // ctx.fillStyle = "black";
                r = 0; g = 0; b = 0; a = 255;
            }
            else {
                // ctx.fillStyle = "white";
                r = 255; g = 255; b = 255; a = 255;
            }
            drawRectangle(imageData, r, g, b, a, x, y, pixelSize, pixelSize);
            // ctx.fillRect(x, y, pixelSize, pixelSize);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    xOff = (-width + pixelSize) / 2;
    yOff = (-height + pixelSize) / 2;
}

function addListeners() {
    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        const { pageX, pageY } = e.touches[0];
        lastX = pageX - canvas.offsetLeft;
        lastY = pageY - canvas.offsetTop;
    });

    canvas.addEventListener('touchmove', (e) => {
        if (isDrawing) {
            e.preventDefault();
            const { pageX, pageY } = e.touches[0];
            const currentX = pageX - canvas.offsetLeft;
            const currentY = pageY - canvas.offsetTop;
            xOff += lastX - currentX;
            yOff += lastY - currentY;
            console.log(xOff, yOff);
            drawUlam(); 
            // drawLine(lastX, lastY, currentX, currentY);
            // adjustOff( lastX-currentX, lastY-currentY, false);
            lastX = currentX;
            lastY = currentY;
        }
    });

    canvas.addEventListener('touchend', () => {
        isDrawing = false;
    });
}

window.onload = function () {
    init();
    drawUlam();
    addListeners();
}