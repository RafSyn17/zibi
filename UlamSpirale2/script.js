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
let storedSimpleResults = {};
let markedNumbers = new Set();


function isPrimeSimpleStore(x) {
    if (storedSimpleResults.hasOwnProperty(x))
        return storedSimpleResults[x];
    let result = isPrimeSimple(x);
    if (doStoreSimpleResults)
        storedSimpleResults[x] = result;
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
    else if (isPrimeSimple(zahl)) {
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
let canvasStepStart
let drawCanvasStepTimeout
function drawCanvasStep(x, y) {
    canvasStepStart = new Date();
    do {
        if (y >= canvas.height / pixelSize)
            return;
        if (x >= canvas.width / pixelSize) {
            x = 0;
            y++;
        }
        paintPixel(x, y);
        ++x;
    } while ((new Date() - canvasStepStart) < 1000 / fps)
    drawCanvasStepTimeout = setTimeout(function () { drawCanvasStep(x, y); }, 0)
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearTimeout(drawCanvasStepTimeout);
    drawCanvasStep(0, 0);
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
    if (x != 0)
        addXOff(canvas.width * (x / 100) / pixelSize);
    if (y != 0)
        addYOff(canvas.height * (y / 100) / pixelSize);
    drawCanvas();

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
    const zahlStr = zahl.toLocaleString();
    const isPrime = isPrimeSimple(zahl);
    if (isPrime)
        if (markedNumbers.has(zahl))
            markedNumbers.delete(zahl);
        else
            markedNumbers.add(zahl);
    let txt;
    if (isPrime)
        txt = `${zahlStr} ist eine Primzahl`;
    else
        txt = `${zahlStr} ist keine Primzahl`;
    return [txt, isPrime];
}

function changeColor(x, y) {
    // Pixelwert des angeklickten Punkts abrufen
    let xX = x - x % pixelSize;
    let yY = y - y % pixelSize;
    const imageData = ctx.getImageData(xX, yY, 1, 1);
    const pixelColor = `srgb(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]})`;

    if (pixelColor === 'srgb(0, 0, 0)' && imageData.data[3] == '255')
        // wenn schwarz dann blau
        ctx.fillStyle = 'blue';
    else
        // wenn blau , dann schwarz
        ctx.fillStyle = 'black';
    ctx.fillRect(xX, yY, pixelSize, pixelSize); // Ein einzelnes Pixel malen
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

        const [result, isPrime] = getTooltipData(x, y);

        tooltip.style.left = `${event.pageX + pixelSize}px`;
        tooltip.style.top = `${event.pageY + pixelSize}px`;
        tooltip.style.display = 'block';
        tooltip.textContent = result;

        if (isPrime)
            changeColor(x, y);

        if (timer) {
            clearTimeout(timer); // Löscht den vorherigen Timeout
        }

        timer = setTimeout(() => {
            tooltip.style.display = 'none';
        }, 2000); // Versteckt den Tooltip nach 2 Sekunden
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