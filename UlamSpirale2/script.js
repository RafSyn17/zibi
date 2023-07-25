// let sieve = new SegmentedSieve();

// sieve.generatePrimesUpTo(30);
// console.log(sieve.isPrime(29)); // true
// console.log(sieve.isPrime(20)); // false

// console.log( measureExecutionTime(sieve, 'generatePrimesUpTo', 100000));
// console.log( measureExecutionTime(sieve, 'generatePrimesUpTo', 100000));

// console.log( measureExecutionTime(sieve, 'generatePrimesUpTo', 1000000));
// console.log( measureExecutionTime(sieve, 'generatePrimesUpTo', 1000000));

// console.log( measureExecutionTime(sieve, 'generatePrimesUpTo', 10000000));
// console.log( measureExecutionTime(sieve, 'generatePrimesUpTo', 10000000));

let pixelSize = 4;
let xOff = 0;
let yOff = 0;
let canvas;
let ctx;
let tooltip;
let timer;
let sieve = new SegmentedSieve();
let useEraSieve = false;
let doStoreSimpleResults = true;
let storedSimpleResults = new Map();
let markedNumbers = new Set();


function isPrimeSimpleStore(zahl) {
    if (storedSimpleResults.has(zahl))
        return storedSimpleResults.get(zahl);
    let result = isPrimeSimple(zahl);
    if (doStoreSimpleResults)
        storedSimpleResults.set(zahl, result);
    return result;
}

function isPrimeSieve(x) {
    const step = 1000000;
    const gen = Math.ceil(x / step) * step;
    sieve.generatePrimesUpTo(gen);
    return sieve.isPrime(x);
}

function isPrime(x) {
    if (useEraSieve)
        return isPrimeSieve(x);
    else
        return isPrimeSimpleStore(x);
}

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

// Funktion zum Färben der Pixel
function paintPixel(x, y) {
    let zahl = getUlamNumber(x + xOff, -(y + yOff));
    if (zahl == 1)
        ctx.fillStyle = 'red';
    else if (isPrime(zahl)) {
        if (markedNumbers.has(zahl))
            ctx.fillStyle = 'blue';
        else
            ctx.fillStyle = 'black';

    }
    else
        return; //ctx.fillStyle = 'white';
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize); // Ein einzelnes Pixel malen
}

const fps = 60;
let canvasStepStart;
let drawCanvasStepTimeout;

function drawCanvasStep(x, y, xMin, xMax, yMax) {
    canvasStepStart = new Date();
    do {
        if (y >= yMax)
            return;
        if (x >= xMax) {
            x = xMin;
            y++;
        }
        paintPixel(x, y);
        ++x;
    } while ((new Date() - canvasStepStart) < 1000 / fps)
    drawCanvasStepTimeout = setTimeout(function () { 
        drawCanvasStepTimeout = null;   
        drawCanvasStep(x, y, xMin, xMax, yMax); 
    }, 0)
}

function drawCanvas(xMin, xMax, yMin, yMax) {
    if (drawCanvasStepTimeout) {
        clearTimeout(drawCanvasStepTimeout);
        xMin = xMax = yMin = yMax = undefined;
    }
    xMin = xMin ?? 0;
    xMax = xMax ?? canvas.width / pixelSize;
    yMin = yMin ?? 0;
    yMax = yMax ?? canvas.height / pixelSize;
    if (xMin === 0 && xMax === canvas.width / pixelSize && yMin === 0 && yMax === canvas.height / pixelSize)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvasStep(xMin, yMin, xMin, xMax, yMax);
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

function adjustOffPct(x, y) {
    const xDiff = Math.round(canvas.width * (x / 100) / pixelSize);
    const yDiff = Math.round(canvas.height * (y / 100) / pixelSize);
    if (xDiff === 0 && yDiff === 0)
        return;
    addXOff(xDiff);
    addYOff(yDiff);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Löschen Sie den aktuellen Inhalt
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zeichnen Sie das ImageData-Objekt an der neuen Position
    ctx.putImageData(imageData, -xDiff * pixelSize, -yDiff * pixelSize);
    let xMin, xMax, yMin, yMax;
    if (xDiff > 0) {
        xMax = Math.round(canvas.width / pixelSize);
        xMin = xMax - xDiff;
    }
    if (xDiff < 0) {
        xMin = 0;
        xMax = -xDiff;
    }
    if (yDiff > 0) {
        yMax = Math.round(canvas.height / pixelSize);
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
    setXOff(xOff / 2);
    setYOff(yOff / 2);
    resizeCanvas();
}

function zoomOut() {
    pixelSize = Math.round(pixelSize / 2);
    setXOff(xOff * 2);
    setYOff(yOff * 2);
    resizeCanvas();
}


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
        ctx.fillStyle = 'black';
    }
    else {
            markedNumbers.add(zahl);
        ctx.fillStyle = 'blue';
}
    let xX = x - x % pixelSize;
    let yY = y - y % pixelSize;
    ctx.fillRect(xX, yY, pixelSize, pixelSize); // Ein einzelnes Pixel malen
}

function makeToolTip(zahl, x, y) {
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.display = 'block';

    tooltip.textContent = `${zahl}`;

    if (timer) {
        clearTimeout(timer); // Löscht den vorherigen Timeout
    }

    timer = setTimeout(() => {
        tooltip.style.display = 'none';
    }, 2000); // Versteckt den Tooltip nach 2 Sekunden

}

window.onload = function () {
    canvas = document.getElementById('canvas');
    tooltip = document.getElementById('tooltip');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    goToCenter();
    window.addEventListener('resize', resizeCanvas);

    document.getElementById("centerButton").addEventListener("click", goToCenter);

    document.getElementById("zoomInButton").addEventListener("click", zoomIn);

    document.getElementById("zoomOutButton").addEventListener("click", zoomOut);

    // Eventlistener für den "upButton"
    document.getElementById("upButton").
        addEventListener("click",
            function () { adjustOffPct(0, -20); });

    // Eventlistener für den "leftButton"
    document.getElementById("leftButton").
        addEventListener("click",
            function () { adjustOffPct(-20, 0); });

    // Eventlistener für den "rightButton"
    document.getElementById("rightButton").
        addEventListener("click",
            function () { adjustOffPct(20, 0); });

    // Eventlistener für den "downButton"
    document.getElementById("downButton").
        addEventListener("click",
            function () { adjustOffPct(0, 20); });

    canvas.addEventListener('click', function (event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const [zahl, isPrime] = getTooltipData(x, y);

        if (isPrime)
            toggleMark(zahl, x, y);

        makeToolTip(zahl, event.pageX + pixelSize, event.pageY + pixelSize);
    });

    // Holen Sie sich das Popup
    var settingsPopup = document.getElementById("settingsPopup");

    // Holen Sie sich den Button, der das Popup öffnet
    var settingsButton = document.getElementById("settingsButton");

    // Holen Sie sich das <span>-Element, das das Popup schließt
    var close = document.getElementsByClassName("close")[0];

    // Wenn der Benutzer auf den Button klickt, öffnen Sie das Popup
    settingsButton.onclick = function () {
        settingsPopup.style.display = "block";
    }

    // Wenn der Benutzer auf <span> (x) klickt, schließen Sie das Popup
    close.onclick = function () {
        settingsPopup.style.display = "none";
    }

    // Wenn der Benutzer irgendwo außerhalb des Popups klickt, schließen Sie es
    window.onclick = function (event) {
        if (event.target == settingsPopup) {
            settingsPopup.style.display = "none";
        }
    }

}