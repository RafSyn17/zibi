let canvas;
let ctx;
let xOffReal;
let yOffReal;
let xOff;
let yOff;
let pixelSize = 100;

function adjustOffsets() {
    const xB4 = xOff;
    const yB4 = yOff;
    xOff = Math.round(xOffReal);
    yOff = Math.round(yOffReal);
    if (xOff == xB4 && yOff == yB4)
        return false;
    return true;
}

function getTopLeftXY() {
    return [-posModulo(xOff, pixelSize), -posModulo(yOff, pixelSize)];
}


let drawTimer;
const fps = 60;

function drawResponsive(imageData, x, y, xMin, xMax, yMax) {
    frameStart = new Date();
    do {
        if (y >= yMax) {
            ctx.putImageData(imageData, 0, 0);
            return;
        }
        if (x >= xMax) {
            x = xMin;
            y += pixelSize;
        }
        paintPixel(imageData, x, y, xOff, yOff);
        x += pixelSize;
    } while ((new Date() - frameStart) < 1000 / fps);
    ctx.putImageData(imageData, 0, 0);
    drawTimer = setTimeout(function () { drawResponsive(imageData, x, y, xMin, xMax, yMax) }, 1000 / fps);
}

function drawUlam() {
    clearTimeout(drawTimer);
    const [xStart, yStart] = getTopLeftXY();
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawResponsive(imageData, xStart, yStart, xStart, canvas.width, canvas.height);
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    xOffReal = (-width + pixelSize) / 2;
    yOffReal = (-height + pixelSize) / 2;
    adjustOffsets();
    drawUlam();
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

            let xDiff = currentX - lastX;
            let yDiff = currentY - lastY;

            xOffReal -= xDiff;
            yOffReal -= yDiff;

            if (adjustOffsets()) {
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.putImageData(imageData, xDiff, yDiff);

                drawUlam();
            }

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
    addListeners();
}