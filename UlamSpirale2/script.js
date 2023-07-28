let pixelSize = 1;
let cxOff = 0;
let cyOff = 0;
let xOff = 0; // für Zahlen
let yOff = 0; // für Zahlen
let canvas;
let ctx;
let tooltip;
let markedNumbers = new Set();

function setXOff(x) {
    xOff = Math.round(x);
}

function setYOff(y) {
    yOff = Math.round(y);
}

function addXOff(x) {
    setXOff(xOff + x);
}

function addYOff(y) {
    setYOff(yOff + y);
}


let imageData;

// Funktion zum Färben der Pixel
function paintPixel(x, y) {
    let zahl = getUlamNumber(x + xOff, -(y + yOff));
    let r, g, b, a; // red, green, blue, alpha
    if (isPrime(zahl)) {
        if (markedNumbers.has(zahl)) {
            // ctx.fillStyle = 'blue';
            r = 0;
            g = 0;
            b = 255;
            a = 255;

        }
        else if (Math.abs(x + xOff) == Math.abs(y + yOff)) {
            // ctx.fillStyle = 'red';
            r = 255;
            g = 0;
            b = 0;
            a = 255;
        }
        else {
            // ctx.fillStyle = 'black';
            r = 0;
            g = 0;
            b = 0;
            a = 255;
        }
    }
    else if (Math.abs(x + xOff) == Math.abs(y + yOff)) {
        // ctx.fillStyle = 'red';
        r = 255;
        g = 255;
        b = 0;
        a = 255;
    }
    else {
        // white
        r = 255;
        g = 255;
        b = 255;
        a = 255;

    }

    drawRectangle(imageData, r, g, b, a, x * pixelSize + cxOff, y * pixelSize + cyOff, pixelSize, pixelSize);
    /// ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize); // Ein einzelnes Pixel malen
}

const fps = 60;
let canvasStepStart;
let drawCanvasStepTimeout;

function drawCanvasStep(x, y, xMin, xMax, yMax) {
    canvasStepStart = new Date();
    do {
        if (y >= yMax) {
            ctx.putImageData(imageData, 0, 0);
            return;
        }
        if (x >= xMax) {
            x = xMin;
            y++;
        }
        paintPixel(x, y);
        ++x;
    } while ((new Date() - canvasStepStart) < 1000 / fps);
    ctx.putImageData(imageData, 0, 0);
    drawCanvasStepTimeout = setTimeout(function () {
        drawCanvasStepTimeout = null;
        drawCanvasStep(x, y, xMin, xMax, yMax);
    }, 0)
}

function drawCanvas(xMin, xMax, yMin, yMax) {
    tooltip.style.display = 'none';
    if (drawCanvasStepTimeout) {
        clearTimeout(drawCanvasStepTimeout);
        xMin = xMax = yMin = yMax = undefined;
    }
    xMin = xMin ?? 0;
    xMax = xMax ?? canvas.width / pixelSize;
    yMin = yMin ?? 0;
    yMax = yMax ?? canvas.height / pixelSize;
    // if (xMin === 0 && xMax === canvas.width / pixelSize && yMin === 0 && yMax === canvas.height / pixelSize)
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawCanvasStep(xMin, yMin, xMin, xMax + 1, yMax + 1); // unschön hier die +1, aber fürs Erste mal... @todo
}

function resizeCanvas() {
    let wDiff = canvas.width - window.innerWidth;
    let hDiff = canvas.height - window.innerHeight;
    addXOff(wDiff / 2 / pixelSize);
    addYOff(hDiff / 2 / pixelSize);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCanvas();
}

function adjustOff(x, y, isPct = true) {
    if (isPct) {
        x = canvas.width * x / 100;
        y = canvas.height * y / 100;
    }
    const xDiff = Math.round(x / pixelSize);
    const yDiff = Math.round(y / pixelSize);
    const cxDiff = x % pixelSize;
    const cyDiff = y % pixelSize;
    if (xDiff === 0 && yDiff === 0 && cxDiff === 0 && cyDiff === 0)
        return;
    addXOff(xDiff);
    addYOff(yDiff);
    // cxOff = (cxOff + cxDiff) % pixelSize; if( cxOff > 0 ) cxOff -= pixelSize;
    // cyOff = (cyOff + cxDiff) % pixelSize; if( cyOff > 0 ) cyOff -= pixelSize;
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Löschen Sie den aktuellen Inhalt
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zeichnen Sie das ImageData-Objekt an der neuen Position
    ctx.putImageData(imageData, -xDiff * pixelSize, -yDiff * pixelSize);
    let xMin, xMax, yMin, yMax;
    if (xDiff > 0) {
        xMax = Math.floor(canvas.width / pixelSize);
        xMin = xMax - xDiff;
    }
    if (xDiff < 0) {
        xMin = 0;
        xMax = -xDiff;
    }
    if (yDiff > 0) {
        yMax = Math.floor(canvas.height / pixelSize);
        yMin = yMax - yDiff;
    }
    if (yDiff < 0) {
        yMin = 0;
        yMax = -yDiff;
    }
    drawCanvas(xMin, xMax, yMin, yMax);
}

function goToCenter() {
    setXOff(- canvas.width / 2 / pixelSize);
    setYOff(- canvas.height / 2 / pixelSize);
    drawCanvas();
}

function zoomIn() {
    pixelSize = Math.round(pixelSize * 2);
    setXOff(xOff + (canvas.width / pixelSize) / 2);
    setYOff(yOff + (canvas.height / pixelSize) / 2);
    resizeCanvas();
}

function zoomOut() {
    pixelSize = Math.round(pixelSize / 2);
    setXOff(xOff - (canvas.width / pixelSize) / 4);
    setYOff(yOff - (canvas.height / pixelSize) / 4);
    resizeCanvas();
}


let isDrawing = false;
let lastX = 0;
let lastY = 0;

function getTooltipData(x, y) {
    xA = Math.floor(x / pixelSize);
    yA = Math.floor(y / pixelSize);
    const zahl = getUlamNumber(xA + xOff, -(yA + yOff));
    const isPrime = isPrimeSimple(zahl);
    return [zahl, isPrime];
}

function toggleMark(zahl, x, y) {
    if (markedNumbers.has(zahl)) {
        markedNumbers.delete(zahl);
        if (Math.abs(Math.floor(x / pixelSize) + xOff) == Math.abs(Math.floor(y / pixelSize) + yOff))
            ctx.fillStyle = 'red';
        else
            ctx.fillStyle = 'black';
    }
    else {
        markedNumbers.add(zahl);
        ctx.fillStyle = 'blue';
    }
    let xX = x - x % pixelSize;
    let yY = y - y % pixelSize;
    ctx.fillRect(xX + cxOff, yY + cyOff, pixelSize, pixelSize); // Ein einzelnes Pixel malen
}

function makeToolTip(zahl, x, y) {
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.display = 'block';

    tooltip.textContent = `${zahl}`;
}

function init() {
    canvas = document.getElementById('canvas');
    tooltip = document.getElementById('tooltip');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    goToCenter();
}

function addButtonListeners() {
    document.getElementById("centerButton").addEventListener("click", goToCenter);

    document.getElementById("zoomInButton").addEventListener("click", zoomIn);

    document.getElementById("zoomOutButton").addEventListener("click", zoomOut);

    // Eventlistener für den "upButton"
    document.getElementById("upButton").
        addEventListener("click",
            function () { adjustOff(0, -20); });

    // Eventlistener für den "leftButton"
    document.getElementById("leftButton").
        addEventListener("click",
            function () { adjustOff(-20, 0); });

    // Eventlistener für den "rightButton"
    document.getElementById("rightButton").
        addEventListener("click",
            function () { adjustOff(20, 0); });

    // Eventlistener für den "downButton"
    document.getElementById("downButton").
        addEventListener("click",
            function () { adjustOff(0, 20); });
}

window.onload = function () {
    init();
    window.addEventListener('resize', resizeCanvas);

    addButtonListeners();

    canvas.addEventListener('click', function (event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const [zahl, isPrime] = getTooltipData(x, y);

        if (isPrime)
            toggleMark(zahl, x, y);

        makeToolTip(zahl, event.pageX + pixelSize, event.pageY + pixelSize);
    });

    // Schließen-Symbol hinzufügen und Event-Listener
    document.getElementById('tooltip').addEventListener('click', function () {
        tooltip.style.display = 'none';
    });

    // Holen Sie sich das Popup
    var settingsPopup = document.getElementById("settingsPopup");

    // Wenn der Benutzer auf den Button klickt, öffnen Sie das Popup
    document.getElementById("settingsButton").onclick = function () {
        settingsPopup.style.display = "block";
    }

    // Wenn der Benutzer auf <span> (x) klickt, schließen Sie das Popup
    document.getElementsByClassName("close")[0].onclick = function () {
        settingsPopup.style.display = "none";
    }

    // Wenn der Benutzer irgendwo außerhalb des Popups klickt, schließen Sie es
    window.onclick = function (event) {
        if (event.target == settingsPopup) {
            settingsPopup.style.display = "none";
        }
    }


    function drawLine(startX, startY, endX, endY) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
    }

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
            // drawLine(lastX, lastY, currentX, currentY);
            adjustOff( lastX-currentX, lastY-currentY, false);
            lastX = currentX;
            lastY = currentY;
        }
    });

    canvas.addEventListener('touchend', () => {
        isDrawing = false;
    });


}