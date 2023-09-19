let canvas;
let tooltip;
let ctx;
let xOffReal;
let yOffReal;
let xOff;
let yOff;
let pixelSize = 10;
let markedNumbers = new Set();

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
    tooltip = document.getElementById('tooltip');
    ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    // canvas.style.cursor = "grab";
    xOffReal = (-width + pixelSize) / 2;
    yOffReal = (-height + pixelSize) / 2;
    adjustOffsets();
    drawUlam();
}

let lastX, lastY;
let isDragging = false;

function drag(newX, newY) {
    let xDiff = Math.round(newX - lastX);  // @todo was besseres hier als Math.round
    let yDiff = Math.round(newY - lastY);

    xOffReal -= xDiff;
    yOffReal -= yDiff;

    if (adjustOffsets()) {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, xDiff, yDiff);

        drawUlam();
    }

    lastX = newX;
    lastY = newY;
}

function handleCanvasClick(x, y) {
    let ulamX = Math.floor((x + xOff) / pixelSize);
    let ulamY = -Math.floor((y + yOff) / pixelSize);
    let number = getUlamNumber(ulamX, ulamY);
    let isPrime = isPrimeSimple(number);
    let text = "" + number + "=(" + ulamX + "," + ulamY + ")";
    //let [xStart, yStart] = getTopLeftXY();
    //let imageData = ctx.getImageData(xStart, yStart, canvas.width, canvas.height);

    tooltip.style.left = `${canvas.width * 0.05}px`;
    tooltip.style.top = `${canvas.height * 0.8}px`;
    tooltip.style.display = 'block';
    tooltip.style.color = "black";
    tooltip.style.fontSize = "30px";
    tooltip.style.opacity = 0.85;
    const iProben = 1000;

    let xX = ulamX * pixelSize - xOff;
    let yY = -ulamY * pixelSize - yOff;

    if (isPrime) {

        text += " ist eine Primzahl.";

        let iProbenPositiv1 = 0;
        let iProbenPositiv2 = 0;
        for (i = - (iProben / 2); i < (iProben / 2); i++) {
            xi = xX + i * pixelSize;
            yi = yY - i * pixelSize;
            xReli = ulamX + i;
            yReli = ulamY + i;
            zahli = getUlamNumber(xReli, yReli);
            if (isPrimeSimple(zahli)) {
                iProbenPositiv1++;
                /*if (markedNumbers.has(zahli)) {
                    markedNumbers.delete(zahli);
                    ctx.fillStyle = 'black';
                }
                else
                 {
                    markedNumbers.add(zahli);
                */    ctx.fillStyle = 'blue';
                //};


                ctx.fillRect(xi, yi, pixelSize, pixelSize);
            }

            xi = xX - i * pixelSize;
            yi = yY - i * pixelSize;
            xReli = ulamX - i;
            yReli = ulamY + i;
            zahli = getUlamNumber(xReli, yReli);
            if (isPrimeSimple(zahli)) {
                iProbenPositiv2++;
                /*if (markedNumbers.has(zahli)) {
                    markedNumbers.delete(zahli);
                    ctx.fillStyle = 'black';
                }
                else
                 {
                    markedNumbers.add(zahli);
                */    ctx.fillStyle = 'green';
                //};
                ctx.fillRect(xi, yi, pixelSize, pixelSize);
            }
        }
        text += `</br>Primzahlenhäufigkeiten:`;
        prHa1 = Math.round(iProbenPositiv1 / iProben * 10000) / 100;
        text += ` <span style='color: blue;'> ${prHa1} </span>% ,`;
        prHa2 = Math.round(iProbenPositiv2 / iProben * 10000) / 100;
        text += ` <span style='color: green;'> ${prHa2} </span>% .`;
    }

    // tooltip.textContent = text;
    tooltip.innerHTML = text;
    /*   if (isPrime) {
           if (markedNumbers.has(number)) {
               markedNumbers.delete(number);
               ctx.fillStyle = 'black';
               r = 0; g = 0; b = 0; a = 255;
           }
           else {
               markedNumbers.add(number);
               ctx.fillStyle = 'blue';
               r = 0; g = 0; b = 255; a = 255;
           }
           ctx.fillRect(xX, yY, pixelSize, pixelSize); // Ein einzelnes Pixel malen
           //drawRectangle(imageData, r, g, b, a, x, y, pixelSize, pixelSize);
   
           text += " ist eine Primzahl.";
       }
   
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
   */

}

let didDrag = false;

function addListeners() {
    canvas.addEventListener('mousedown', (e) => {
        lastX = e.clientX - canvas.offsetLeft;
        lastY = e.clientY - canvas.offsetTop;
        didDrag = false;
        isDragging = true;
        // tooltip.style.display = 'none';
    });

    canvas.addEventListener('touchstart', (e) => {
        didDrag = false;
        if (e.touches.length != 1) return;
        const { pageX, pageY } = e.touches[0];
        lastX = pageX - canvas.offsetLeft;
        lastY = pageY - canvas.offsetTop;
        // tooltip.style.display = 'none';
    });

    canvas.addEventListener('mousemove', (e) => {
        const newX = e.clientX - canvas.offsetLeft;
        const newY = e.clientY - canvas.offsetTop;
        if (isDragging) {
            drag(newX, newY);
            canvas.style.cursor = "grabbing";
            didDrag = true;
        }
        const ulamX = Math.floor((newX + xOff) / pixelSize);
        const ulamY = Math.floor((newY + yOff) / pixelSize);
    });

    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length != 1) return;
        e.preventDefault();
        const { pageX, pageY } = e.touches[0];
        const newX = pageX - canvas.offsetLeft;
        const newY = pageY - canvas.offsetTop;
        drag(newX, newY);
        didDrag = true;
    });

    canvas.addEventListener('touchend', () => {
        if (e.touches.length === 0 && !didDrag)
            handleCanvasClick(lastX, lastY);

    });

    canvas.addEventListener('mouseup', (e) => {
        isDragging = false;
        canvas.style.cursor = "default";
        if (!didDrag)
            handleCanvasClick(lastX, lastY);
    });

    tooltip.addEventListener('click', function () { tooltip.style.display = 'none'; });
}

window.onload = function () {
    init();
    addListeners();
}