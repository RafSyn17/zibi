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

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Funktion zum Färben der Pixel
    function paintPixel(x, y) {
        let zahl = getUlamNumber(x + xOff, -(y + yOff));
        if (zahl == 1)
            ctx.fillStyle = 'red';
        else if (isPrimeSimple(zahl))
            ctx.fillStyle = 'black';
        else
            return;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize); // Ein einzelnes Pixel malen
    }

    // Pixel durchlaufen und bemalen
    for (let y = 0; y < canvas.height / pixelSize; y++) {
        for (let x = 0; x < canvas.width / pixelSize; x++) {
            paintPixel(x, y);
        }
    }
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
    if (isPrimeSimple(zahl))
        return `${zahlStr} ist eine Primzahl`;
    else
        return `${zahlStr} ist keine Primzahl`;
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

        const result = getTooltipData(x, y);

        tooltip.style.left = `${event.pageX}px`;
        tooltip.style.top = `${event.pageY}px`;
        tooltip.style.display = 'block';
        tooltip.textContent = result;

        if (timer) {
            clearTimeout(timer); // Löscht den vorherigen Timeout
        }

        timer = setTimeout(() => {
            tooltip.style.display = 'none';
        }, 2000); // Versteckt den Tooltip nach 2 Sekunden
    });
}